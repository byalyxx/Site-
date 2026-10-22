"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

// Live clock for the place chip. Renders nothing on the server so the HTML never shows a stale time.
export function LocalTime({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () => setTime(new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" }).format(new Date()));
    format();
    const id = setInterval(format, 30_000);
    return () => clearInterval(id);
  }, [timeZone]);

  if (!time) return null;
  return (
    <sup className="pt-1 text-small font-medium tabular-nums text-site-muted" title={`Local time (${timeZone})`}>
      {time}
    </sup>
  );
}

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
    <button type="button" onClick={copy} className={className} aria-label={copied ? "Email copied" : `Copy ${email}`}>
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
    </button>
  );
}

// Light/dark switch in the footer.
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
