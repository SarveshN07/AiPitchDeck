"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  return (
    <Button
      type="button"
      className="w-full bg-blue-600 text-white hover:bg-blue-700"
      onClick={() => signIn("google", { callbackUrl })}
    >
      Continue with Google
    </Button>
  );
}