"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DeckCard, DeckCardProps } from "@/components/deck-card";
import { Spinner } from "@/components/ui/spinner";
import { ThemeToggle } from "@/components/theme-toggle";
import { RiAiGenerate2Line as Sparkles, RiAddLine as Plus } from "@remixicon/react";

export default function DecksPage() {
  const [decks, setDecks] = useState<DeckCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDecks = async () => {
    try {
      const response = await fetch("/api/decks");
      if (!response.ok) throw new Error("Failed to fetch decks");
      const data = await response.json();
      setDecks(data);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDecks();
    // Refresh every 5 seconds to get latest status
    const interval = setInterval(fetchDecks, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDecks();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6" />
            <h1 className="text-xl font-bold">Pitch Deck AI</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Create New
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Page Title */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Your Pitch Decks</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Manage and view all your generated pitch decks
            </p>
          </div>

          {/* Error State */}
          {error && !loading && (
            <div className="p-4 bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800 rounded text-red-700 dark:text-red-200">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <Spinner className="h-8 w-8" />
                <p className="text-zinc-600 dark:text-zinc-400">Loading decks...</p>
              </div>
            </div>
          ) : decks.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950/50">
              <Sparkles className="h-12 w-12 text-zinc-400 dark:text-zinc-600 mb-4" />
              <h3 className="text-xl font-semibold text-black dark:text-zinc-200 mb-2">
                No pitch decks yet
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-center max-w-sm mb-6">
                Get started by creating your first pitch deck. It only takes a
                few seconds!
              </p>
              <Link href="/">
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                  Create Your First Deck
                </Button>
              </Link>
            </div>
          ) : (
            /* Decks Grid */
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Total decks: <span className="font-semibold">{decks.length}</span>
                </p>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white disabled:opacity-50 transition-colors"
                >
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {decks.map((deck) => (
                  <DeckCard
                    key={deck.id}
                    {...deck}
                    slideCount={
                      deck.status === "COMPLETED"
                        ? (
                            decks.find((d) => d.id === deck.id) as any
                          )?.slideCount
                        : undefined
                    }
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
