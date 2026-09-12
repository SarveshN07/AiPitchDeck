import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { RiCheckboxCircleLine as Check, RiMagicLine as Magic } from "@remixicon/react";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-[#f5f7f2] text-[#17211b] dark:bg-[#101510] dark:text-[#edf4ea] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-[#17211b] p-10 text-[#f5f7f2] lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute -right-24 top-20 size-72 rounded-full bg-[#d6f45f]/20 blur-3xl" aria-hidden="true" />
        <Link href="/" className="relative z-10 flex items-center gap-3" aria-label="PitchPilot home"><Image src="/logo.png" alt="PitchPilot logo" width={40} height={40} className="size-10 rounded-xl object-contain" priority /><span className="font-semibold tracking-tight">PitchPilot</span></Link>
        <div className="relative z-10 max-w-lg"><p className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#d6f45f]">A better first impression</p><h1 className="text-5xl font-semibold leading-[1.02] tracking-tighter text-balance xl:text-7xl">Your next big idea deserves a sharper story.</h1><p className="mt-7 max-w-md text-lg leading-8 text-white/65">Sign in and turn the thought in your head into a deck you can confidently put in front of people.</p><div className="mt-10 space-y-4 text-sm text-white/75"><p className="flex items-center gap-3"><Check className="size-5 text-[#d6f45f]" aria-hidden="true" />Structured storytelling for every idea</p><p className="flex items-center gap-3"><Check className="size-5 text-[#d6f45f]" aria-hidden="true" />Custom visuals that support the message</p></div></div>
        <p className="relative z-10 text-sm text-white/40">Build the story. Pitch the future.</p>
      </section>
      <section className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center justify-between lg:hidden"><Link href="/" className="flex items-center gap-3" aria-label="PitchPilot home"><Image src="/logo.png" alt="PitchPilot logo" width={36} height={36} className="size-9 rounded-xl object-contain" priority /><span className="font-semibold">PitchPilot</span></Link><Link href="/" className="text-sm font-medium text-[#17211b]/60 hover:text-[#17211b] dark:text-white/60 dark:hover:text-white">Back home</Link></div>
          <div className="mb-8"><div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-[#d6f45f] text-[#17211b]"><Magic className="size-6" aria-hidden="true" /></div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#719d39]">Welcome back</p><h2 className="mt-3 text-4xl font-semibold tracking-tighter text-balance">Pick up where your idea left off.</h2><p className="mt-4 leading-7 text-[#17211b]/60 dark:text-white/60">Your workspace is ready. Sign in to create a new deck or return to your saved stories.</p></div>
          <div className="rounded-[1.75rem] border border-[#17211b]/10 bg-white p-6 shadow-xl shadow-[#17211b]/5 dark:border-white/10 dark:bg-[#182019] sm:p-8"><LoginForm callbackUrl="/create" /><p className="mt-5 text-center text-xs leading-5 text-[#17211b]/45 dark:text-white/45">By continuing, you agree to use PitchPilot for your own presentations and ideas.</p></div>
          <Link href="/" className="mt-6 block text-center text-sm font-medium text-[#17211b]/60 hover:text-[#17211b] dark:text-white/60 dark:hover:text-white">Return to PitchPilot home</Link>
        </div>
      </section>
    </main>
  );
}
