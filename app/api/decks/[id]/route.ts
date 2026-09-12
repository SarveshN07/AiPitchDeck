import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deck = await prisma.deck.findUnique({
      where: { id },
      include: {
        slides: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!deck) {
      return NextResponse.json(
        { error: "Deck not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(deck, { status: 200 });
  } catch (error) {
    console.error("Error fetching deck:", error);
    return NextResponse.json(
      { error: "Failed to fetch deck" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deck = await prisma.deck.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Deck deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting deck:", error);
    return NextResponse.json(
      { error: "Failed to delete deck" },
      { status: 500 }
    );
  }
}
