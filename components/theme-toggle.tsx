"use client";

import { useTheme } from "@/providers/theme-provider";
import { RiSunLine, RiMoonLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled
        className="relative gap-2 w-9 h-9"
      />
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <div className="relative w-4 h-4">
        {/* Sun Icon - visible in light mode */}
        <RiSunLine
          className={`absolute inset-0 h-4 w-4 transition-all duration-300 ${
            theme === "light"
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 rotate-90 scale-0"
          }`}
        />
        {/* Moon Icon - visible in dark mode */}
        <RiMoonLine
          className={`absolute inset-0 h-4 w-4 transition-all duration-300 ${
            theme === "dark"
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-0"
          }`}
        />
      </div>
      <span className="text-xs font-medium hidden sm:inline">
        {theme === "dark" ? "Light" : "Dark"}
      </span>
    </Button>
  );
}
