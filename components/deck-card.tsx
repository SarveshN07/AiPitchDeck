"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { RiArrowRightLine as ChevronRight } from "@remixicon/react";

export interface DeckCardProps {
  id: string;
  idea: string;
  title?: string | null;
  status: "PENDING" | "GENERATING" | "COMPLETED" | "FAILED";
  errorMessage?: string | null;
  createdAt: string;
  slideCount?: number;
}

const statusConfig = {
  PENDING: { label: "Pending", color: "bg-zinc-300 dark:bg-zinc-700" },
  GENERATING: { label: "Generating...", color: "bg-blue-300 dark:bg-blue-900" },
  COMPLETED: { label: "Completed", color: "bg-green-300 dark:bg-green-900" },
  FAILED: { label: "Failed", color: "bg-red-300 dark:bg-red-900" },
};

export function DeckCard({
  id,
  idea,
  title,
  status,
  errorMessage,
  createdAt,
  slideCount,
}: DeckCardProps) {
  const config = statusConfig[status];
  const isCompleted = status === "COMPLETED";

  return (
    <Link href={isCompleted ? `/deck/${id}` : "#"}>
      <Card
        className={`p-6 border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer group ${
          !isCompleted ? "opacity-75" : ""
        }`}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-black dark:text-zinc-100 truncate">
                {title || "Untitled Deck"}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-1">
                {idea}
              </p>
            </div>
            {isCompleted && (
              <ChevronRight className="h-5 w-5 text-zinc-500 group-hover:text-zinc-300 dark:text-zinc-500 dark:group-hover:text-zinc-300 transition-colors shrink-0" />
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-300 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Badge className={`${config.color} text-black dark:text-white border-0`}>
                {config.label}
              </Badge>
              {slideCount && (
                <span className="text-xs text-zinc-600 dark:text-zinc-500">
                  {slideCount} slides
                </span>
              )}
            </div>
            <span className="text-xs text-zinc-600 dark:text-zinc-500">
              {format(new Date(createdAt), "MMM dd, yyyy")}
            </span>
          </div>

          {errorMessage && status === "FAILED" && (
            <div className="mt-2 p-2 bg-red-100 dark:bg-red-950 rounded text-xs text-red-700 dark:text-red-200">
              {errorMessage}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
