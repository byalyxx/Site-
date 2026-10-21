import { ArrowUpRight, BarChart3, Eye, Globe, MapPin, MousePointerClick, Users, type LucideIcon } from "lucide-react";
import { cn } from "./cn";

// Charts for the media kit. Plain SVG + tokens, no chart library: the numbers come from content/site.ts.

const statIcons: Record<string, LucideIcon> = {
  reach: Users,
  activity: BarChart3,
  taps: MousePointerClick,
  visits: Eye,
  country: MapPin,
};

export function ExampleTag() {
  return (
    <span className="rounded-tile border border-dashed border-site-muted px-1.5 py-0.5 text-tag font-semibold uppercase tracking-wide text-site-muted">
      Example data
    </span>
  );
}

// A bordered panel: the one place on the site that uses a card, because it groups figures that belong together.
export function Panel({
  title,
  aside,
  children,
  className,
}: {
  title: React.ReactNode;
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6 rounded-card border border-site-border bg-site-surface p-4 tab:p-5", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-title font-semibold text-site-fg">{title}</div>
        {aside && <div className="flex items-center gap-2 text-meta text-site-muted">{aside}</div>}
      </div>
      {children}
    </div>
  );
}

// Ring split between two shares (in percent), with the headline figure in the middle.
export function AudienceRing({
  label,
  value,
  note,
  split,
}: {
  label: string;
  value: string;
  note?: string;
  split: { followers: number; nonFollowers: number };
}) {
  const r = 84;
  const c = 2 * Math.PI * r;
  const gap = 26; // track left between the two arcs, including the 7px each round cap adds
  const a = (split.followers / 100) * c;
  const b = (split.nonFollowers / 100) * c;

  return (
    <figure className="flex flex-col items-center gap-5">
      <div className="relative w-55 max-w-full">
        <svg viewBox="0 0 200 200" className="block w-full -rotate-90" role="img" aria-label={`${split.followers}% of ${label.toLowerCase()} from followers, ${split.nonFollowers}% from non-followers`}>
          <circle cx="100" cy="100" r={r} fill="none" strokeWidth="14" className="stroke-site-line" />
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${Math.max(a - gap, 0)} ${c}`}
            strokeDashoffset={-gap / 2}
            className="stroke-site-data"
          />
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${Math.max(b - gap, 0)} ${c}`}
            strokeDashoffset={-(a + gap / 2)}
            className="stroke-site-data-soft"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center">
          <span className="text-meta text-site-muted">{label}</span>
          <span className="text-display tabular-nums text-site-fg">{value}</span>
          {note && <span className="text-small text-site-muted">{note}</span>}
        </div>
      </div>
      <figcaption className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-meta text-site-muted">
        <Legend swatch="bg-site-data">Followers {split.followers}%</Legend>
        <Legend swatch="bg-site-data-soft">Non-followers {split.nonFollowers}%</Legend>
      </figcaption>
    </figure>
  );
}

function Legend({ swatch, dashed, children }: { swatch?: string; dashed?: boolean; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      {dashed ? (
        <span className="w-4 border-t-2 border-dotted border-site-muted" aria-hidden />
      ) : (
        <span className={cn("size-2 rounded-pill", swatch)} aria-hidden />
      )}
      {children}
    </span>
  );
}

export function StatTile({
  icon,
  label,
  value,
  change,
  className,
}: {
  icon: string;
  label: string;
  value: string;
  change?: string;
  className?: string;
}) {
  const Icon = statIcons[icon] ?? Globe;
  return (
    <div className={cn("flex min-w-0 flex-col items-center gap-1 rounded-control border border-site-border bg-site-bg px-2 py-4 text-center", className)}>
      <Icon className="mb-1 size-4 text-site-muted" aria-hidden />
      <span className="text-figure font-semibold tabular-nums text-site-fg">{value}</span>
      <span className="text-meta text-site-muted">{label}</span>
      {change && <span className="text-meta font-medium tabular-nums text-site-positive">{change}</span>}
    </div>
  );
}

// Line chart: this period as a solid line with a soft fill, the period before as a dotted line.
export function GrowthChart({
  current,
  previous,
  xLabels,
}: {
  current: { label: string; values: number[] };
  previous: { label: string; values: number[] };
  xLabels: string[];
}) {
  const W = 400;
  const H = 160;
  const max = niceMax(Math.max(...current.values, ...previous.values));
  const ticks = [max, max / 2, 0];
  const line = (values: number[]) => smoothPath(values.map((v, i) => [(i / (values.length - 1)) * W, H - (v / max) * H]));
  const cur = line(current.values);

  return (
    <figure className="flex flex-col gap-4">
      <div className="flex gap-3">
        <div className="flex flex-col justify-between text-small tabular-nums text-site-muted" aria-hidden style={{ height: H }}>
          {ticks.map((t) => (
            <span key={t}>
              {format(t)}
            </span>
          ))}
        </div>
        <div className="relative min-w-0 flex-1">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="block w-full overflow-visible text-site-data"
            style={{ height: H }}
            role="img"
            aria-label={`${current.label} compared with ${previous.label}: highest point ${Math.max(...current.values)}, versus ${Math.max(...previous.values)} before`}
          >
            <defs>
              <linearGradient id="growth-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="currentColor" stopOpacity="0.18" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            {ticks.map((t) => (
              <line key={t} x1="0" x2={W} y1={H - (t / max) * H} y2={H - (t / max) * H} vectorEffect="non-scaling-stroke" className="stroke-site-line" />
            ))}
            <path d={`${cur} L ${W} ${H} L 0 ${H} Z`} fill="url(#growth-fill)" />
            <path d={line(previous.values)} fill="none" strokeWidth="2" strokeDasharray="1 5" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="stroke-site-muted" />
            <path d={cur} fill="none" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" stroke="currentColor" />
          </svg>
          <div className="mt-2 flex justify-between text-small text-site-muted" aria-hidden>
            {xLabels.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </div>
      </div>
      <figcaption className="flex flex-wrap gap-x-5 gap-y-1 text-meta text-site-muted">
        <span className="inline-flex items-center gap-2">
          <span className="w-4 border-t-2 border-site-data" aria-hidden />
          {current.label}
        </span>
        <Legend dashed>{previous.label}</Legend>
      </figcaption>
    </figure>
  );
}

export function ChangeBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-copy font-semibold tabular-nums text-site-positive">
      <ArrowUpRight className="size-3.5" aria-hidden />
      {children}
    </span>
  );
}

function niceMax(v: number) {
  const step = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil(v / (step / 2)) * (step / 2);
}

function format(n: number) {
  return n >= 1000 ? `${n / 1000}K` : String(n);
}

// Catmull-Rom through the points, as cubic Béziers, clamped so the curve never overshoots below 0.
function smoothPath(points: number[][]) {
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [p0, p1, p2, p3] = [points[i - 1] ?? points[i], points[i], points[i + 1], points[i + 2] ?? points[i + 1]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}
