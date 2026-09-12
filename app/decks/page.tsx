"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DeckCard, DeckCardProps } from "@/components/deck-card";
import { Spinner } from "@/components/ui/spinner";
import { ThemeToggle } from "@/components/theme-toggle";
import { RiAiGenerate2Line as Sparkles, RiAddLine as Plus } from "@remixicon/react";
import { AuthButtons } from "@/components/auth-buttons";

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
    <main className="min-h-screen bg-[#f5f7f2] text-[#17211b] dark:bg-[#101510] dark:text-[#edf4ea]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#17211b]/10 bg-[#f5f7f2]/90 backdrop-blur-sm dark:border-white/10 dark:bg-[#101510]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <Link href="/" className="flex items-center gap-3" aria-label="PitchPilot home">
            <Image src="/logo.png" alt="PitchPilot logo" width={36} height={36} className="size-9 rounded-xl object-contain" priority />
            <h1 className="font-semibold tracking-tight">PitchPilot</h1>
          </Link>
          <nav className="flex items-center gap-1" aria-label="Workspace navigation">
            <Link href="/create" className="rounded-full px-4 py-2 text-sm font-semibold text-[#17211b]/65 hover:bg-[#17211b]/5 hover:text-[#17211b] dark:text-white/65 dark:hover:bg-white/10 dark:hover:text-white">
              Create
            </Link>
            <Link href="/decks" aria-current="page" className="rounded-full bg-[#17211b] px-4 py-2 text-sm font-semibold text-[#f5f7f2] dark:bg-[#d6f45f] dark:text-[#17211b]">
              Your decks
            </Link>
            <AuthButtons />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="space-y-8">
          {/* Page Title */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Your Pitch Decks</h2>
            <p className="text-[#17211b]/60 dark:text-white/60">
              Manage and revisit every story you have built with PitchPilot.
            </p>
          </div>

          {/* Error State */}
          {error && !loading && (
            <div role="alert" aria-live="polite" className="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <Spinner className="h-8 w-8" />
                <p className="text-[#17211b]/60 dark:text-white/60">Loading decks…</p>
              </div>
            </div>
          ) : decks.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#17211b]/20 bg-[#e8efe2] px-6 py-20 dark:border-white/15 dark:bg-[#182019]">
              <Sparkles className="h-12 w-12 text-zinc-400 dark:text-zinc-600 mb-4" />
              <h3 className="mb-2 text-xl font-semibold text-[#17211b] dark:text-white">
                No pitch decks yet
              </h3>
              <p className="mb-6 max-w-sm text-center text-[#17211b]/60 dark:text-white/60">
                Start with a thought and turn it into a confident presentation.
              </p>
              <Link href="/create">
                <Button className="gap-2 rounded-full bg-[#17211b] text-[#f5f7f2] hover:bg-[#31473a] dark:bg-[#d6f45f] dark:text-[#17211b] dark:hover:bg-[#c1df50]">
                  <Plus className="h-4 w-4" />
                  Create Your First Deck
                </Button>
              </Link>
            </div>
          ) : (
            /* Decks Grid */
            <>
              <div className="flex items-center justify-between">
                  <p className="text-sm text-[#17211b]/60 dark:text-white/60">
                  Total decks: <span className="font-semibold text-[#17211b] dark:text-white">{decks.length}</span>
                </p>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="rounded-full px-3 py-2 text-sm text-[#17211b]/60 transition-colors hover:bg-[#17211b]/5 hover:text-[#17211b] disabled:opacity-50 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  {refreshing ? "Refreshing…" : "Refresh"}
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
      </section>
    </main>
  );
}
