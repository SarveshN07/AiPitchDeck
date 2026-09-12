"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AuthButtons() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Button variant="outline" onClick={() => signIn("google", { callbackUrl: "/create" })}>
        Sign in
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>
      Sign out
    </Button>
  );
}