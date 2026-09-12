"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useDeckStatus } from "@/hooks/use-deck-status";
import { SlideCarousel } from "@/components/slide-carousel";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import {
  RiArrowLeftLine as ArrowLeft,
  RiFileCopyLine as Copy,
  RiDownloadCloud2Line as Download,
  RiShareForwardLine as Share2,
  RiDeleteBin2Line as Trash2,
  RiAiGenerate2Line as Sparkles,
} from "@remixicon/react";
import { format } from "date-fns";

export default function DeckViewerPage() {
  const router = useRouter();
  const params = useParams();
  const deckId = params.id as string;

  const { deck, loading, error, isGenerating, isCompleted, isFailed } =
    useDeckStatus(deckId, {
      pollInterval: 2000,
    });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/deck/${deckId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/decks/${deckId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete deck");

      router.push("/decks");
    } catch (err) {
      console.error("Error deleting deck:", err);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="h-8 w-8" />
          <p className="text-zinc-600 dark:text-zinc-400">Loading deck...</p>
        </div>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center">
        <div className="max-w-sm">
          <h1 className="text-2xl font-bold mb-4">Deck Not Found</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            The deck you're looking for doesn't exist or an error occurred.
          </p>
          <Link href="/decks">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700">
              <ArrowLeft className="h-4 w-4" />
              Back to Decks
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = {
    PENDING: {
      label: "Pending",
      color: "bg-zinc-300 dark:bg-zinc-700",
      description: "Waiting to generate...",
    },
    GENERATING: {
      label: "Generating",
      color: "bg-blue-300 dark:bg-blue-900",
      description: "Creating your pitch deck...",
    },
    COMPLETED: {
      label: "Completed",
      color: "bg-green-300 dark:bg-green-900",
      description: "Ready to view",
    },
    FAILED: {
      label: "Failed",
      color: "bg-red-300 dark:bg-red-900",
      description: deck.errorMessage || "Generation failed",
    },
  };

  const currentStatus = statusConfig[deck.status];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link href="/decks">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span className="truncate text-lg font-semibold">Pitch Deck AI</span>
            </div>
          </div>

          {isCompleted && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyLink}
                className="gap-2 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copied!" : "Share"}
              </Button>
            </div>
          )}
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl min-w-0 overflow-hidden px-3 py-8 sm:px-6 sm:py-12">
        <div className="space-y-8">
          {/* Deck Info Section */}
          <div className="space-y-4">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex min-w-0 flex-wrap items-center gap-2">
                  <h1 className="min-w-0 break-words text-2xl font-bold sm:text-3xl">
                    {deck.title || "Untitled Deck"}
                  </h1>
                  <Badge className={`${currentStatus.color} text-black dark:text-white border-0`}>
                    {currentStatus.label}
                  </Badge>
                </div>
                <p className="mb-4 break-words text-zinc-600 dark:text-zinc-400">{deck.idea}</p>
              </div>
              {isCompleted && (
                <button
                  onClick={() => setDeleteDialogOpen(true)}
                  className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Delete deck"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Status Section */}
            <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-300 dark:border-zinc-800 space-y-3">
              <div>
                <p className="text-xs text-zinc-600 dark:text-zinc-500 mb-1">Status</p>
                <p className="text-sm text-black dark:text-zinc-200">{currentStatus.description}</p>
              </div>

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Spinner className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm text-black dark:text-zinc-300">
                      Generating your pitch deck... This may take a few minutes.
                    </p>
                  </div>
                  <div className="w-full bg-zinc-300 dark:bg-zinc-800 rounded h-2">
                    <div className="bg-blue-600 dark:bg-blue-500 h-full rounded animate-pulse" style={{ width: "60%" }} />
                  </div>
                </div>
              )}

              {isFailed && (
                <div className="p-3 bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-200">
                  {deck.errorMessage || "An error occurred during generation"}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-500">Created</p>
                  <p className="text-sm text-black dark:text-zinc-200">
                    {format(new Date(deck.createdAt), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-500">Slides</p>
                  <p className="text-sm text-black dark:text-zinc-200">
                    {deck.slides.length} {deck.slides.length === 1 ? "slide" : "slides"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Section */}
          {isCompleted && deck.slides.length > 0 ? (
            <SlideCarousel slides={deck.slides} title={deck.title || "Untitled Deck"} />
          ) : (
            <div className="flex items-center justify-center h-96 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-300 dark:border-zinc-800">
              <div className="text-center">
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                  {isGenerating
                    ? "Slides will appear here when generation is complete..."
                    : isFailed
                      ? "No slides available due to generation failure"
                      : "No slides available"}
                </p>
                {!isCompleted && !isFailed && (
                  <Spinner className="h-6 w-6 mx-auto text-blue-600 dark:text-blue-400" />
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black dark:text-white">Delete Pitch Deck</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-600 dark:text-zinc-400">
              Are you sure you want to delete this pitch deck? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className="border-zinc-300 dark:border-zinc-700 text-black dark:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-900 dark:hover:bg-red-800"
            >
              {deleting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
