"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CreateDeckForm } from "@/components/create-deck-form";
import { AuthButtons } from "@/components/auth-buttons";
import { ThemeToggle } from "@/components/theme-toggle";
import { RiAiGenerate2Line as Sparkles, RiCheckLine as Check } from "@remixicon/react";

export default function CreatePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f5f7f2] text-[#17211b] dark:bg-[#101510] dark:text-[#edf4ea]">
      <header className="border-b border-[#17211b]/10 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3" aria-label="PitchPilot home">
            <Image src="/logo.png" alt="PitchPilot logo" width={36} height={36} className="size-9 rounded-xl object-contain" priority />
            <span className="font-semibold tracking-tight">PitchPilot</span>
          </Link>
          <nav className="flex items-center gap-1" aria-label="Workspace navigation">
            <Link href="/create" aria-current="page" className="rounded-full bg-[#17211b] px-4 py-2 text-sm font-semibold text-[#f5f7f2] dark:bg-[#d6f45f] dark:text-[#17211b]">Create</Link>
            <Link href="/decks" className="rounded-full px-4 py-2 text-sm font-semibold text-[#17211b]/65 hover:bg-[#17211b]/5 hover:text-[#17211b] dark:text-white/65 dark:hover:bg-white/10 dark:hover:text-white">Your decks</Link>
            <AuthButtons />
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 lg:py-20">
        <div>
          <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-[#d6f45f] text-[#17211b]"><Sparkles className="size-6" aria-hidden="true" /></div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#719d39]">New deck</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tighter text-balance sm:text-5xl">Start with the idea you can’t stop thinking about.</h1>
          <p className="mt-5 max-w-sm leading-7 text-[#17211b]/60 dark:text-white/60">Give the story a starting point. PitchPilot will shape it into a confident pitch with a clear narrative, useful detail, and visual rhythm.</p>
          <div className="mt-10 space-y-4 border-t border-[#17211b]/10 pt-6 text-sm text-[#17211b]/60 dark:border-white/10 dark:text-white/60">
            <p className="font-semibold text-[#17211b] dark:text-white">What you will get</p>
            <p className="flex items-center gap-3"><Check className="size-4 text-[#719d39]" aria-hidden="true" /> A persuasive story arc</p>
            <p className="flex items-center gap-3"><Check className="size-4 text-[#719d39]" aria-hidden="true" /> Slide-ready copy and structure</p>
            <p className="flex items-center gap-3"><Check className="size-4 text-[#719d39]" aria-hidden="true" /> A custom visual direction</p>
          </div>
        </div>
        <div className="rounded-[2rem] border border-[#17211b]/10 bg-white p-6 shadow-xl shadow-[#17211b]/5 dark:border-white/10 dark:bg-[#182019] sm:p-10 lg:p-12">
          <CreateDeckForm onSuccess={(deckId) => router.push(`/deck/${deckId}`)} />
        </div>
      </section>
    </main>
  );
}