"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function CopyEmail({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button type="button" onClick={copy} className={className} title={email}>
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
    </button>
  );
}

// Light/dark switch, beside the home heading and in sub-page footers.
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark mode"
      className={className}
    >
      <Sun className="size-3.5 dark:hidden" aria-hidden />
      <Moon className="hidden size-3.5 dark:block" aria-hidden />
    </button>
  );
}
