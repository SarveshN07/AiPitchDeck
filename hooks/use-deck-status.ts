"use client";

import { useEffect, useState, useCallback } from "react";

export interface DeckData {
  id: string;
  idea: string;
  title: string | null;
  status: "PENDING" | "GENERATING" | "COMPLETED" | "FAILED";
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  slides: Array<{
    id: string;
    deckId: string;
    order: number;
    title: string;
    content: string;
    imagePrompt: string;
    imageUrl: string | null;
    createdAt: string;
  }>;
}

interface UseDeckStatusOptions {
  enabled?: boolean;
  pollInterval?: number; // in milliseconds
  onStatusChange?: (status: DeckData["status"]) => void;
  onComplete?: (deck: DeckData) => void;
  onError?: (error: string) => void;
}

export function useDeckStatus(
  deckId: string,
  options: UseDeckStatusOptions = {}
) {
  const {
    enabled = true,
    pollInterval = 2000, // 2 seconds
    onStatusChange,
    onComplete,
    onError,
  } = options;

  const [deck, setDeck] = useState<DeckData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeck = useCallback(async () => {
    try {
      const response = await fetch(`/api/decks/${deckId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch deck");
      }
      const data = await response.json();
      setDeck(data);
      setError(null);

      // Notify on status change
      if (onStatusChange) {
        onStatusChange(data.status);
      }

      // Notify on completion
      if (data.status === "COMPLETED" && onComplete) {
        onComplete(data);
      }

      // Notify on error
      if (data.status === "FAILED" && onError && data.errorMessage) {
        onError(data.errorMessage);
      }

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [deckId, onStatusChange, onComplete, onError]);

  // Initial fetch
  useEffect(() => {
    if (!enabled) return;
    fetchDeck();
  }, [enabled, deckId, fetchDeck]);

  // Poll for updates
  useEffect(() => {
    if (!enabled || !deck) return;

    // Don't poll if already completed or failed
    if (deck.status === "COMPLETED" || deck.status === "FAILED") {
      return;
    }

    const interval = setInterval(() => {
      fetchDeck();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [enabled, deck, pollInterval, fetchDeck]);

  return {
    deck,
    loading,
    error,
    refetch: fetchDeck,
    isGenerating: deck?.status === "GENERATING",
    isCompleted: deck?.status === "COMPLETED",
    isFailed: deck?.status === "FAILED",
  };
}
