import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { inngest } from "@/inngest/client";
import { auth } from "@/auth";

// GET all decks
export async function GET() {
  try {
    const session = await auth();
    const ownerId = session?.user?.email;
    if (!ownerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decks = await prisma.deck.findMany({
      where: { ownerId },
      include: {
        slides: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(decks, { status: 200 });
  } catch (error) {
    console.error("Error fetching decks:", error);
    return NextResponse.json(
      { error: "Failed to fetch decks" },
      { status: 500 }
    );
  }
}

// POST create a new deck
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const ownerId = session?.user?.email;
    if (!ownerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { idea } = body;

    if (!idea || idea.trim().length === 0) {
      return NextResponse.json(
        { error: "Idea is required" },
        { status: 400 }
      );
    }

    // Create deck in database
    const deck = await prisma.deck.create({
      data: {
        ownerId,
        idea: idea.trim(),
        status: "PENDING",
      },
    });

    try {
      await inngest.send({
        name: "deck/generate",
        data: {
          deckId: deck.id,
        },
      });
    } catch (error) {
      console.error("Error dispatching deck generation:", error);

      await prisma.deck.update({
        where: { id: deck.id },
        data: {
          status: "FAILED",
          errorMessage: "Deck generation could not be started. Please try again.",
        },
      });

      return NextResponse.json(
        { error: "Deck generation could not be started. Please try again." },
        { status: 503 },
      );
    }

    return NextResponse.json(deck, { status: 201 });
  } catch (error) {
    console.error("Error creating deck:", error);
    return NextResponse.json(
      { error: "Failed to create deck" },
      { status: 500 }
    );
  }
}
