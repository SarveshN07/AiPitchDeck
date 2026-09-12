import Image from "next/image";
import Link from "next/link";
import { AuthButtons } from "@/components/auth-buttons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  RiArrowRightUpLine as ArrowUpRight,
  RiCheckboxCircleLine as Check,
  RiLayoutMasonryLine as Layout,
  RiMagicLine as Magic,
} from "@remixicon/react";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f7f2] text-[#17211b] dark:bg-[#101510] dark:text-[#edf4ea]">
      <header className="border-b border-[#17211b]/10 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <Link href="/" className="flex items-center gap-3" aria-label="PitchPilot home">
            <Image src="/logo.png" alt="PitchPilot logo" width={36} height={36} className="size-9 rounded-xl object-contain" priority />
            <span className="font-semibold tracking-tight">PitchPilot</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            <a href="#how-it-works" className="rounded-full px-4 py-2 text-sm font-medium text-[#17211b]/65 hover:bg-[#17211b]/5 hover:text-[#17211b] dark:text-white/65 dark:hover:bg-white/10 dark:hover:text-white">How it works</a>
            <Link href="/decks" className="rounded-full px-4 py-2 text-sm font-medium text-[#17211b]/65 hover:bg-[#17211b]/5 hover:text-[#17211b] dark:text-white/65 dark:hover:bg-white/10 dark:hover:text-white">My decks</Link>
          </nav>
          <div className="flex items-center gap-2">
            <AuthButtons />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-77px)] max-w-7xl items-center gap-16 px-6 py-16 lg:grid-cols-[0.88fr_1.12fr] lg:px-10 lg:py-20">
        <div className="max-w-xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#17211b]/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#3c5b45] dark:border-white/15 dark:text-[#c5e7b9]"><span className="size-1.5 rounded-full bg-[#88b64a]" aria-hidden="true" />From idea to influence</p>
          <h1 className="max-w-lg text-5xl font-semibold leading-[0.98] tracking-tighter text-balance sm:text-7xl">Make the room believe in your idea.</h1>
          <p className="mt-7 max-w-md text-lg leading-8 text-[#17211b]/65 dark:text-white/65">PitchPilot turns a rough business idea into a clear, persuasive deck with a story people can follow and visuals they remember.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/create"><Button size="lg" className="h-11 gap-2 rounded-full bg-[#17211b] px-6 text-[#f5f7f2] hover:bg-[#31473a] dark:bg-[#d6f45f] dark:text-[#17211b] dark:hover:bg-[#c1df50]">Create your deck <ArrowUpRight className="size-4" aria-hidden="true" /></Button></Link>
            <Link href="#how-it-works" className="rounded-full px-4 py-2.5 text-sm font-semibold text-[#17211b]/70 hover:bg-[#17211b]/5 hover:text-[#17211b] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white">See how it works <span aria-hidden="true">&#8595;</span></Link>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#17211b]/60 dark:text-white/60"><span className="inline-flex items-center gap-2"><Check className="size-4 text-[#719d39]" aria-hidden="true" />Story-first structure</span><span className="inline-flex items-center gap-2"><Check className="size-4 text-[#719d39]" aria-hidden="true" />Custom visuals</span></div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl" aria-label="PitchPilot deck preview">
          <div className="absolute -right-8 -top-8 size-32 rounded-full bg-[#d6f45f] blur-2xl dark:bg-[#6b8d3d]" aria-hidden="true" />
          <div className="relative rounded-[2rem] bg-[#17211b] p-3 shadow-2xl shadow-[#17211b]/20 dark:bg-[#273429]"><div className="rounded-[1.5rem] bg-[#e8efe2] p-5 dark:bg-[#dcebd5] sm:p-8">
            <div className="flex items-center justify-between border-b border-[#17211b]/15 pb-5 text-[#17211b]"><div className="flex items-center gap-2 text-sm font-semibold"><Layout className="size-4" aria-hidden="true" />Deck canvas</div><span className="rounded-full bg-[#d6f45f] px-3 py-1 text-xs font-semibold">5 slides</span></div>
            <div className="grid gap-4 py-7 sm:grid-cols-[1.1fr_0.9fr]"><div className="flex min-h-64 flex-col justify-between rounded-2xl bg-[#17211b] p-6 text-[#f5f7f2]"><Magic className="size-7 text-[#d6f45f]" aria-hidden="true" /><div><p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#d6f45f]">The pitch</p><p className="text-3xl font-semibold leading-tight">A sharper story for a bolder future.</p></div></div><div className="space-y-4"><div className="h-28 rounded-2xl bg-[#bdd29b]" /><div className="space-y-2 rounded-2xl bg-white p-5 text-[#17211b]"><div className="h-2 w-2/3 rounded-full bg-[#17211b]/75" /><div className="h-2 w-full rounded-full bg-[#17211b]/15" /><div className="h-2 w-4/5 rounded-full bg-[#17211b]/15" /></div></div></div>
            <div className="flex items-center justify-between text-xs font-medium text-[#17211b]/55"><span>Generated with your idea</span><span>01 / 05</span></div>
          </div></div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-8 border-t border-[#17211b]/10 bg-[#e8efe2] px-6 py-20 text-[#17211b] dark:border-white/10 dark:bg-[#182019] dark:text-[#edf4ea] lg:px-10">
        <div className="mx-auto max-w-7xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#719d39]">How it works</p><h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tighter text-balance sm:text-5xl">Bring the thought. Leave with the story.</h2><div className="mt-12 grid gap-5 md:grid-cols-3"><div className="border-t-2 border-[#719d39] pt-5"><span className="text-sm font-semibold text-[#719d39]">01</span><h3 className="mt-5 text-xl font-semibold">Share the spark</h3><p className="mt-3 leading-7 text-[#17211b]/60 dark:text-white/60">Describe your business idea in plain language. No template or polished brief required.</p></div><div className="border-t-2 border-[#719d39] pt-5"><span className="text-sm font-semibold text-[#719d39]">02</span><h3 className="mt-5 text-xl font-semibold">Shape the narrative</h3><p className="mt-3 leading-7 text-[#17211b]/60 dark:text-white/60">PitchPilot creates a logical sequence with the right tension, evidence, and momentum.</p></div><div className="border-t-2 border-[#719d39] pt-5"><span className="text-sm font-semibold text-[#719d39]">03</span><h3 className="mt-5 text-xl font-semibold">Make it presentable</h3><p className="mt-3 leading-7 text-[#17211b]/60 dark:text-white/60">Review your finished deck, open any slide, and share the idea with confidence.</p></div></div></div>
      </section>
    </main>
  );
}
