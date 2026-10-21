"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

// Live clock for the place chip. Renders nothing on the server so the HTML never shows a stale time.
export function LocalTime({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      setTime(new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" }).format(new Date()));
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
      {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}
