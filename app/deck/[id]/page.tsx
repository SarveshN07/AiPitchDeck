"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
import { useEffect, useState } from "react";
import {
  RiArrowLeftLine as ArrowLeft,
  RiDeleteBin2Line as Trash2,
  RiDownload2Line as Download,
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
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [progressClock, setProgressClock] = useState(() => Date.now());

  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setProgressClock(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleExportPptx = async () => {
    if (!deck || deck.slides.length === 0) return;

    setExporting(true);
    setExportError(null);

    try {
      const { default: PptxGenJS } = await import("pptxgenjs");
      const presentation = new PptxGenJS();
      presentation.layout = "LAYOUT_WIDE";
      presentation.author = "PitchPilot";
      presentation.company = "PitchPilot";
      presentation.subject = deck.idea;
      presentation.title = deck.title || "PitchPilot Deck";

      for (const slide of deck.slides) {
        const presentationSlide = presentation.addSlide();
        presentationSlide.background = { color: "17211B" };

        if (slide.imageUrl) {
          presentationSlide.addImage({
            path: slide.imageUrl,
            x: 0,
            y: 0,
            w: 13.333,
            h: 7.5,
            transparency: 28,
          });
        }

        presentationSlide.addShape(presentation.ShapeType.rect, {
          x: 0,
          y: 4.65,
          w: 13.333,
          h: 2.85,
          fill: { color: "17211B", transparency: 8 },
          line: { color: "17211B", transparency: 100 },
        });
        presentationSlide.addText(slide.title, {
          x: 0.65,
          y: 5.1,
          w: 12,
          h: 0.55,
          bold: true,
          color: "FFFFFF",
          fontFace: "Aptos Display",
          fontSize: 27,
          margin: 0,
          breakLine: false,
        });
        presentationSlide.addText(slide.content, {
          x: 0.65,
          y: 5.85,
          w: 11.8,
          h: 1.05,
          color: "E8EFE2",
          fontFace: "Aptos",
          fontSize: 15,
          breakLine: false,
          fit: "shrink",
          margin: 0,
          valign: "top",
        });
      }

      const fileName = `${(deck.title || "pitchpilot-deck")
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase() || "pitchpilot-deck"}.pptx`;
      await presentation.writeFile({ fileName });
    } catch (error) {
      console.error("Error exporting PPTX:", error);
      setExportError("Could not export the deck. Please try again.");
    } finally {
      setExporting(false);
    }
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
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7f2] text-[#17211b] dark:bg-[#101510] dark:text-[#edf4ea]">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="h-8 w-8" />
          <p className="text-[#17211b]/60 dark:text-white/60">Loading deck…</p>
        </div>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7f2] text-[#17211b] dark:bg-[#101510] dark:text-[#edf4ea]">
        <div className="max-w-sm">
          <h1 className="text-2xl font-bold mb-4">Deck Not Found</h1>
          <p className="mb-6 text-[#17211b]/60 dark:text-white/60">
            The deck you&apos;re looking for doesn&apos;t exist or an error occurred.
          </p>
          <Link href="/decks">
            <Button className="gap-2 rounded-full bg-[#17211b] text-[#f5f7f2] hover:bg-[#31473a] dark:bg-[#d6f45f] dark:text-[#17211b] dark:hover:bg-[#c1df50]">
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
        color: "bg-[#d9e4d0] dark:bg-[#3c513d]",
        description: "Waiting to generate…",
    },
    GENERATING: {
      label: "Generating",
      color: "bg-[#c8dca7] dark:bg-[#4f683b]",
      description: "Creating your pitch deck…",
    },
    COMPLETED: {
      label: "Completed",
      color: "bg-[#c8e39a] dark:bg-[#527238]",
      description: "Ready to view",
    },
    FAILED: {
      label: "Failed",
      color: "bg-red-200 dark:bg-red-900",
      description: deck.errorMessage || "Generation failed",
    },
  };

  const currentStatus = statusConfig[deck.status];
  const elapsedSeconds = Math.max(
    0,
    (progressClock - new Date(deck.createdAt).getTime()) / 1000,
  );
  const timeProgress = Math.min(72, elapsedSeconds * 0.35);
  const slideProgress = Math.min(12, deck.slides.length * 2);
  const generationProgress = Math.min(
    92,
    Math.max(8, Math.round(8 + timeProgress + slideProgress)),
  );

  return (
    <div className="min-h-screen bg-[#f5f7f2] text-[#17211b] transition-colors dark:bg-[#101510] dark:text-[#edf4ea]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#17211b]/10 bg-[#f5f7f2]/90 backdrop-blur-sm dark:border-white/10 dark:bg-[#101510]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link href="/decks">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-[#17211b]/60 hover:text-[#17211b] dark:text-white/60 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <Link href="/" className="flex items-center gap-2" aria-label="PitchPilot home">
              <Image src="/logo.png" alt="PitchPilot logo" width={32} height={32} className="size-8 rounded-lg object-contain" priority />
              <span className="truncate text-lg font-semibold">PitchPilot</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {isCompleted && (
              <Button
                size="sm"
                onClick={handleExportPptx}
                disabled={exporting}
                className="h-9 gap-2 rounded-full bg-[#17211b] px-4 text-[#f5f7f2] shadow-sm hover:bg-[#31473a] dark:bg-[#d6f45f] dark:text-[#17211b] dark:hover:bg-[#c1df50]"
              >
                <Download className="h-4 w-4" />
                {exporting ? "Exporting…" : "Export PPTX"}
              </Button>
            )}
            <ThemeToggle />
          </div>
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
                  <h1 className="min-w-0 wrap-break-word text-2xl font-semibold tracking-tight sm:text-3xl">
                    {deck.title || "Untitled Deck"}
                  </h1>
                  <Badge className={`${currentStatus.color} text-black dark:text-white border-0`}>
                    {currentStatus.label}
                  </Badge>
                </div>
                <p className="mb-4 wrap-break-word text-[#17211b]/60 dark:text-white/60">{deck.idea}</p>
              </div>
              {isCompleted && (
                <button
                  onClick={() => setDeleteDialogOpen(true)}
                  aria-label="Delete deck"
                  className="rounded-full p-2 text-[#17211b]/50 transition-colors hover:bg-red-100 hover:text-red-600 dark:text-white/50 dark:hover:bg-red-950/50 dark:hover:text-red-300"
                  title="Delete deck"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Status Section */}
            <div className="space-y-3 rounded-[1.5rem] border border-[#17211b]/10 bg-[#e8efe2] p-5 dark:border-white/10 dark:bg-[#182019]">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#719d39]">Status</p>
                <p className="text-sm text-[#17211b] dark:text-white">{currentStatus.description}</p>
              </div>

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Spinner className="h-4 w-4 text-[#719d39]" />
                    <p className="text-sm text-[#17211b] dark:text-white/80">
                      Generating your pitch deck… This may take a few minutes.
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#17211b]/50 dark:text-white/50">
                    <span>Progress</span>
                    <span className="tabular-nums">{generationProgress}%</span>
                  </div>
                  <div
                    className="h-2 w-full rounded-full bg-[#17211b]/10 dark:bg-white/10"
                    role="progressbar"
                    aria-label="Deck generation progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={generationProgress}
                  >
                    <div className="h-full rounded-full bg-[#719d39] transition-[width] duration-1000 ease-out" style={{ width: `${generationProgress}%` }} />
                  </div>
                </div>
              )}

              {isFailed && (
                <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200">
                  {deck.errorMessage || "An error occurred during generation"}
                </div>
              )}

              {exportError && (
                <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200">
                  {exportError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-xs text-[#17211b]/50 dark:text-white/50">Created</p>
                  <p className="text-sm text-[#17211b] dark:text-white/80">
                    {format(new Date(deck.createdAt), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#17211b]/50 dark:text-white/50">Slides</p>
                  <p className="text-sm text-[#17211b] dark:text-white/80">
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
            <div className="flex h-96 items-center justify-center rounded-[1.5rem] border border-dashed border-[#17211b]/15 bg-[#e8efe2] dark:border-white/15 dark:bg-[#182019]">
              <div className="text-center">
                <p className="mb-4 text-[#17211b]/60 dark:text-white/60">
                  {isGenerating
                    ? "Slides will appear here when generation is complete…"
                    : isFailed
                      ? "No slides available due to generation failure"
                      : "No slides available"}
                </p>
                {!isCompleted && !isFailed && (
                  <Spinner className="mx-auto h-6 w-6 text-[#719d39]" />
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border-[#17211b]/15 bg-[#f5f7f2] dark:border-white/15 dark:bg-[#182019]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#17211b] dark:text-white">Delete Pitch Deck</AlertDialogTitle>
              <AlertDialogDescription className="text-[#17211b]/60 dark:text-white/60">
              Are you sure you want to delete this pitch deck? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className="border-[#17211b]/15 text-[#17211b] dark:border-white/15 dark:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
            >
              {deleting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Deleting…
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
