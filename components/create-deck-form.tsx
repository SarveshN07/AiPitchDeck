"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

interface CreateDeckFormProps {
  onSuccess?: (deckId: string) => void;
  onError?: (error: string) => void;
}

export function CreateDeckForm({ onSuccess, onError }: CreateDeckFormProps) {
  const [idea, setIdea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!idea.trim()) {
      setError("Please enter a business idea");
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
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
      <div className="space-y-2">
        <label htmlFor="idea" className="text-sm font-medium text-black dark:text-zinc-200">
          Your Business Idea
        </label>
        <Input
          id="idea"
          placeholder="Describe your business idea or startup concept..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          disabled={isLoading}
          className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-black dark:text-zinc-100 placeholder:text-zinc-500"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        {isLoading ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Generating Pitch Deck...
          </>
        ) : (
          "Create Pitch Deck"
        )}
      </Button>

      <p className="text-xs text-zinc-600 dark:text-zinc-500 text-center">
        Your pitch deck will be generated with 5-8 slides, images, and professional content.
      </p>
    </form>
  );
}
