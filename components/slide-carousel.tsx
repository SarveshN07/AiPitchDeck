"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  RiArrowLeftLine as ChevronLeft,
  RiArrowRightLine as ChevronRight,
  RiFullscreenExitLine as FullscreenExit,
  RiFullscreenLine as Fullscreen,
} from "@remixicon/react";

export interface Slide {
  id: string;
  order: number;
  title: string;
  content: string;
  imageUrl?: string | null;
  imagePrompt: string;
}

interface SlideCarouselProps {
  slides: Slide[];
  title: string;
}

export function SlideCarousel({ slides, title }: SlideCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoPlay || slides.length === 0) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 8000); // Auto-advance every 8 seconds

    return () => clearTimeout(timer);
  }, [currentIndex, autoPlay, slides.length]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === slideRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
        setAutoPlay(false);
      }
      if (event.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
        setAutoPlay(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-300 dark:border-zinc-800">
        <p className="text-zinc-600 dark:text-zinc-400">No slides available</p>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];
  const progress = ((currentIndex + 1) / slides.length) * 100;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setAutoPlay(false);
  };

  const toggleFullscreen = async () => {
    if (!slideRef.current) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await slideRef.current.requestFullscreen();
      }
    } catch (error) {
      console.error("Unable to change fullscreen mode:", error);
    }
  };

  return (
    <div className="w-full min-w-0 space-y-6 overflow-hidden">
      {/* Main Slide */}
      <div
        className="group relative box-border w-full max-w-full overflow-hidden rounded-lg border border-zinc-300 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900 sm:p-5"
        onMouseEnter={() => setAutoPlay(false)}
        onMouseLeave={() => setAutoPlay(true)}
      >
        <div
          ref={slideRef}
          className={`relative max-w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950 ${
            isFullscreen
              ? "fixed inset-0 m-auto aspect-video h-auto w-[min(92vw,163.5vh)]"
              : "mx-auto aspect-video h-auto w-[min(96%,120vh)] max-w-6xl"
          }`}
        >
          {currentSlide.imageUrl ? (
            <Image
              src={currentSlide.imageUrl}
              alt={currentSlide.title}
              fill
              className="object-contain"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
              <p className="text-zinc-500">Image loading...</p>
            </div>
          )}

          {/* Slide Content Overlay */}
          <div className="absolute inset-0 flex min-w-0 flex-col justify-end overflow-hidden bg-linear-to-t from-black/80 via-transparent to-transparent p-4 sm:p-8">
            <h2 className="mb-2 max-w-full break-words text-xl font-bold text-white sm:text-3xl">
              {currentSlide.title}
            </h2>
            <p className="max-w-full break-words text-sm text-zinc-200 line-clamp-3 sm:text-lg">
              {currentSlide.content}
            </p>
          </div>

          {/* Slide Counter */}
          <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 rounded text-sm text-white">
            {currentIndex + 1} / {slides.length}
          </div>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="absolute left-4 top-4 rounded-lg bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            aria-label={isFullscreen ? "Exit fullscreen" : "View slide fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "View slide fullscreen"}
          >
            {isFullscreen ? (
              <FullscreenExit className="h-5 w-5" />
            ) : (
              <Fullscreen className="h-5 w-5" />
            )}
          </button>

          {/* Navigation Buttons */}
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-lg bg-black/60 p-3 text-white opacity-100 shadow-lg transition-colors hover:bg-black/80 sm:left-4"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-black/60 p-3 text-white opacity-100 shadow-lg transition-colors hover:bg-black/80 sm:right-4"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-zinc-300 dark:bg-zinc-800">
          <div
            className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Slide Thumbnails Navigation */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-black dark:text-zinc-300">
          {title} — Slide {currentIndex + 1}
        </p>
        <div className="flex max-w-full gap-2 overflow-x-auto overflow-y-hidden pb-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`relative aspect-square w-24 shrink-0 overflow-hidden rounded border-2 transition-all sm:w-32 ${
                index === currentIndex
                  ? "border-blue-600 dark:border-blue-500 ring-2 ring-blue-600/50 dark:ring-blue-500/50"
                  : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600"
              }`}
            >
              {slide.imageUrl ? (
                <Image
                  src={slide.imageUrl}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-contain bg-zinc-100 dark:bg-zinc-950"
                />
              ) : (
                <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs text-zinc-600 dark:text-zinc-500">
                  {index + 1}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Slide Details */}
      <div className="min-w-0 space-y-4 overflow-hidden rounded-lg border border-zinc-300 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
        <div>
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Title</h3>
          <p className="break-words text-lg font-bold text-black dark:text-white">{currentSlide.title}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Content</h3>
          <p className="break-words text-black dark:text-zinc-200 leading-relaxed">{currentSlide.content}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Image Prompt
          </h3>
          <p className="break-words text-sm italic text-zinc-600 dark:text-zinc-400">{currentSlide.imagePrompt}</p>
        </div>
      </div>
    </div>
  );
}
