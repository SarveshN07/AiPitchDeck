import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { inngest } from "@/inngest/client";

// GET all decks
export async function GET() {
  try {
    const decks = await prisma.deck.findMany({
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
        idea: idea.trim(),
        status: "PENDING",
      },
    });

    // Trigger Inngest event to generate deck
    await inngest.send({
      name: "deck/generate",
      data: {
        deckId: deck.id,
      },
    });

    return NextResponse.json(deck, { status: 201 });
  } catch (error) {
    console.error("Error creating deck:", error);
    return NextResponse.json(
      { error: "Failed to create deck" },
      { status: 500 }
    );
  }
}
