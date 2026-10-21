"use client";

import { useState } from "react";
import { Monitor, Smartphone, Tablet, type LucideIcon } from "lucide-react";
import { SocialIcon } from "@/components/icons";
import { cn } from "./cn";

// Media kit analytics in a dashboard layout: a row of figures, a line chart you can hover,
// then ranked lists with a bar behind each row. Plain SVG + tokens, no chart library.

export function ExampleTag() {
  return (
    <span className="rounded-tile border border-dashed border-site-muted px-1.5 py-0.5 text-tag font-semibold uppercase tracking-wide text-site-muted">
      Example data
    </span>
  );
}

export function StatRow({ stats }: { stats: { label: string; value: string }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-5 border-y border-site-line py-5 tab:grid-cols-3">
      {stats.map((s) => (
        <div key={s.label} className="flex min-w-0 flex-col gap-1">
          <dt className="text-meta text-site-muted">{s.label}</dt>
          <dd className="text-figure font-medium tabular-nums text-site-fg">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

type Series = { label: string; values: number[] };

// This period solid, the one before dotted. Hover, tap or use the arrow keys to read a day.
export function TrendChart({ current, previous, pointLabel }: { current: Series; previous: Series; pointLabel: string }) {
  const [active, setActive] = useState<number | null>(null);
  const W = 400;
  const H = 150;
  const n = current.values.length;
  const max = niceMax(Math.max(...current.values, ...previous.values));
  const x = (i: number) => (i / (n - 1)) * W;
  const y = (v: number) => H - (v / max) * H;
  const path = (values: number[]) => values.map((v, i) => `${i ? "L" : "M"} ${x(i)} ${y(v)}`).join(" ");
  const cur = path(current.values);
  const label = (i: number) => `${pointLabel} ${i + 1}`;

  function pick(clientX: number, el: Element) {
    const r = el.getBoundingClientRect();
    setActive(Math.min(n - 1, Math.max(0, Math.round(((clientX - r.left) / r.width) * (n - 1)))));
  }

  const left = active === null ? 0 : (active / (n - 1)) * 100;

  return (
    <figure className="flex flex-col gap-3">
      <span className="text-small tabular-nums text-site-muted" aria-hidden>
        {format(max)}
      </span>
      <div
        className="relative touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-site-muted"
        tabIndex={0}
        role="img"
        data-trend={JSON.stringify({ current, previous, pointLabel, max })}
        aria-label={`${current.label} over ${n} ${pointLabel.toLowerCase()}s, peaking at ${Math.max(...current.values)}. ${previous.label} peaked at ${Math.max(...previous.values)}. Use the arrow keys to read each ${pointLabel.toLowerCase()}.`}
        onPointerMove={(e) => pick(e.clientX, e.currentTarget)}
        onPointerDown={(e) => pick(e.clientX, e.currentTarget)}
        onPointerLeave={() => setActive(null)}
        onBlur={() => setActive(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") setActive((a) => Math.min(n - 1, (a ?? -1) + 1));
          else if (e.key === "ArrowLeft") setActive((a) => Math.max(0, (a ?? n) - 1));
          else return;
          e.preventDefault();
        }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block w-full overflow-visible text-site-data" style={{ height: H }}>
          <defs>
            <linearGradient id="trend-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity="0.16" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" x2={W} y1={H} y2={H} vectorEffect="non-scaling-stroke" className="stroke-site-line" />
          <path d={`${cur} L ${W} ${H} L 0 ${H} Z`} fill="url(#trend-fill)" />
          <path d={path(previous.values)} fill="none" strokeWidth="1.5" strokeDasharray="2 4" vectorEffect="non-scaling-stroke" className="stroke-site-muted" />
          <path d={cur} fill="none" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" stroke="currentColor" />
          {active !== null && (
            <line x1={x(active)} x2={x(active)} y1="0" y2={H} vectorEffect="non-scaling-stroke" className="stroke-site-border" />
          )}
        </svg>
        {active !== null && (
          <>
            <Dot left={left} top={(y(current.values[active]) / H) * 100} className="bg-site-data" />
            <Dot left={left} top={(y(previous.values[active]) / H) * 100} className="bg-site-muted" />
            <div
              className="pointer-events-none absolute top-0 z-10 w-52 rounded-control border border-site-border bg-site-surface p-3 shadow-sm"
              style={left > 55 ? { right: `${100 - left}%`, marginRight: 12 } : { left: `${left}%`, marginLeft: 12 }}
              aria-live="polite"
            >
              <p className="border-b border-site-line pb-2 text-meta text-site-muted">{label(active)}</p>
              <dl className="flex flex-col gap-1.5 pt-2 text-copy">
                <TipRow swatch="border-site-data" label={current.label} value={current.values[active]} />
                <TipRow swatch="border-dotted border-site-muted" label={previous.label} value={previous.values[active]} />
              </dl>
            </div>
          </>
        )}
      </div>
      <div className="flex justify-between text-small text-site-muted" aria-hidden>
        <span>{label(0)}</span>
        <span>{label(Math.floor((n - 1) / 2))}</span>
        <span>{label(n - 1)}</span>
      </div>
      <figcaption className="flex flex-wrap gap-x-5 gap-y-1 text-meta text-site-muted">
        <span className="inline-flex items-center gap-2">
          <span className="w-4 border-t-2 border-site-data" aria-hidden />
          {current.label}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-4 border-t-2 border-dotted border-site-muted" aria-hidden />
          {previous.label}
        </span>
      </figcaption>
    </figure>
  );
}

function Dot({ left, top, className }: { left: number; top: number; className: string }) {
  return (
    <span
      className={cn("pointer-events-none absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-pill ring-2 ring-site-bg", className)}
      style={{ left: `${left}%`, top: `${top}%` }}
      aria-hidden
    />
  );
}

function TipRow({ swatch, label, value }: { swatch: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("w-3 shrink-0 border-t-2", swatch)} aria-hidden />
      <dt className="min-w-0 flex-1 truncate text-site-muted">{label}</dt>
      <dd className="font-medium tabular-nums text-site-fg">{value}</dd>
    </div>
  );
}

const rowIcons: Record<string, LucideIcon> = { mobile: Smartphone, desktop: Monitor, tablet: Tablet };
const socialIcons = ["tiktok", "instagram", "youtube"];

export type BreakdownRow = { label: string; value: number; display?: string; icon?: string };

// A ranked list: each row's bar is its share of the largest row.
export function Breakdown({
  title,
  unit,
  rows,
  example,
}: {
  title: string;
  unit: string;
  rows: BreakdownRow[];
  example?: boolean;
}) {
  const top = Math.max(...rows.map((r) => r.value));
  return (
    <div className="flex flex-col gap-3 border-t border-site-line pt-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-title font-semibold text-site-fg">{title}</h3>
        <span className="flex items-center gap-2 text-meta text-site-muted">
          {example && <ExampleTag />}
          {unit}
        </span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {rows.map((r) => {
          const Icon = r.icon ? rowIcons[r.icon] : undefined;
          return (
            <li key={r.label} className="flex items-center gap-4">
              <div className="relative flex h-field min-w-0 flex-1 items-center gap-3 px-3">
                <span className="absolute inset-y-0 left-0 rounded-control bg-site-thumb" style={{ width: `${(r.value / top) * 100}%` }} aria-hidden />
                <span className="relative flex min-w-0 items-center gap-3 text-copy text-site-fg">
                  {r.icon && socialIcons.includes(r.icon) && <SocialIcon name={r.icon} className="size-4 shrink-0" />}
                  {Icon && <Icon className="size-4 shrink-0 text-site-muted" aria-hidden />}
                  <span className="truncate">{r.label}</span>
                </span>
              </div>
              <span className="w-12 shrink-0 text-right text-copy font-medium tabular-nums text-site-fg">{r.display ?? r.value}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function niceMax(v: number) {
  const step = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil(v / (step / 2)) * (step / 2);
}

function format(n: number) {
  return n >= 1000 ? `${n / 1000}K` : String(n);
}
