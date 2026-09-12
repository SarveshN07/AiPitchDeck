"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { RiArrowRightUpLine as ArrowUpRight, RiLightbulbLine as Bulb } from "@remixicon/react";

interface CreateDeckFormProps {
  onSuccess?: (deckId: string) => void;
  onError?: (error: string) => void;
}

export function CreateDeckForm({ onSuccess, onError }: CreateDeckFormProps) {
  const [idea, setIdea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const maxCharacters = 1000;
  const starterIdeas = [
    "A healthier meal delivery service for busy families",
    "A tool that helps small teams understand their customers",
    "A climate technology idea that makes cities more resilient",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (idea.trim().length < 10) {
      setError("Add a little more detail so PitchPilot can shape a strong story.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create deck");
      }

      const deck = await response.json();
      setIdea("");
      onSuccess?.(deck.id);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-7">
      <div className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#719d39]">Deck brief</p>
            <label htmlFor="idea" className="text-xl font-semibold tracking-tight text-[#17211b] dark:text-white">
              What are you building?
            </label>
          </div>
          <span className="shrink-0 text-xs tabular-nums text-[#17211b]/45 dark:text-white/45">{idea.length}/{maxCharacters}</span>
        </div>
        <div className="rounded-[1.5rem] border-2 border-[#17211b]/20 bg-[#f5f7f2] p-2 shadow-[0_12px_30px_-20px_rgba(23,33,27,0.7)] transition-colors focus-within:border-[#719d39] focus-within:ring-4 focus-within:ring-[#719d39]/15 dark:border-white/20 dark:bg-[#101510] dark:shadow-none">
          <Textarea
            id="idea"
            name="idea"
            autoComplete="off"
            rows={9}
            maxLength={maxCharacters}
            placeholder="Describe the product, the audience, and the problem it solves…"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            disabled={isLoading}
            className="min-h-56 resize-y rounded-[1.1rem] border-0 bg-transparent px-4 py-4 text-lg leading-8 text-[#17211b] placeholder:text-[#17211b]/35 focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent dark:text-white dark:placeholder:text-white/35"
          />
          <div className="flex items-center justify-between px-4 pb-2 pt-1 text-xs text-[#17211b]/40 dark:text-white/40"><span>Start with the problem, not the polish.</span><span className="tabular-nums">{idea.trim().length < 10 ? "Add more detail" : "Ready to build"}</span></div>
        </div>
        <p className="text-sm leading-6 text-[#17211b]/55 dark:text-white/55">The more context you share, the more specific your narrative and slide content will be.</p>
      </div>

      <div className="space-y-3">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#719d39]"><Bulb className="size-4" aria-hidden="true" />Need a starting point?</p>
        <div className="flex flex-wrap gap-2">
          {starterIdeas.map((starterIdea) => (
            <button key={starterIdea} type="button" onClick={() => setIdea(starterIdea)} disabled={isLoading} className="rounded-full border border-[#17211b]/12 px-3 py-2 text-left text-xs leading-5 text-[#17211b]/65 transition-colors hover:border-[#719d39] hover:bg-[#e8efe2] hover:text-[#17211b] disabled:opacity-50 dark:border-white/15 dark:text-white/65 dark:hover:bg-[#273429] dark:hover:text-white">{starterIdea}</button>
          ))}
        </div>
      </div>

      {error && (
        <div role="alert" aria-live="polite" className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="h-12 w-full gap-2 rounded-full bg-[#17211b] text-[#f5f7f2] hover:bg-[#31473a] dark:bg-[#d6f45f] dark:text-[#17211b] dark:hover:bg-[#c1df50]"
      >
        {isLoading ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Building Your Deck…
          </>
        ) : (
          <>Build My Pitch Deck <ArrowUpRight className="size-4" aria-hidden="true" /></>
        )}
      </Button>

      <p className="text-center text-xs text-[#17211b]/45 dark:text-white/45">
        Your deck will include 5–8 slides with structured content and custom visuals.
      </p>
    </form>
  );
}
