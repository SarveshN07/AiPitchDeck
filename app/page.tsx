"use client";

import Link from "next/link";
import { CreateDeckForm } from "@/components/create-deck-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { RiAiGenerate2Line as Sparkles } from "@remixicon/react";

export default function Home() {
  const router = useRouter();

  const handleCreateSuccess = (deckId: string) => {
    router.push(`/deck/${deckId}`);
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
          <div className="flex items-center gap-3">
            <Link href="/decks">
              <Button variant="outline" className="border-zinc-300 dark:border-zinc-700 text-black dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900">
                View All Decks
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-60px)] flex flex-col items-center justify-center px-6 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-black/5 dark:bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl sm:text-6xl font-bold tracking-tight">
              Generate Pitch Decks
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                in Seconds
              </span>
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
              Turn your business idea into a professional pitch deck. AI-powered
              content, beautiful design, and custom images for each slide.
            </p>
          </div>

          {/* Form */}
          <div className="flex justify-center pt-8">
            <CreateDeckForm onSuccess={handleCreateSuccess} />
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 text-left max-w-3xl">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              <h3 className="font-semibold">AI-Generated Content</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Professional slides with compelling copy and structure
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                <span className="text-xl">🖼️</span>
              </div>
              <h3 className="font-semibold">Custom Images</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Each slide gets a unique, relevant AI-generated image
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
              <h3 className="font-semibold">Instant Creation</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Get your complete deck in just a few minutes
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
