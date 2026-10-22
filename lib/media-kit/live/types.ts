import type { PlatformId } from "@/content/media-kit";

// Shapes shared by the platform connectors (youtube.ts, instagram.ts, tiktok.ts) and the sync in sync.ts.

export type Token = Record<string, unknown>;

// A row of media_kit_days. `m` and `l` use the keys in lib/media-kit/platforms.ts.
export type DayRow = {
  platform: PlatformId;
  date: string;
  m: Record<string, number>;
  l: Record<string, Record<string, number>>;
  totals?: Record<string, unknown> | null;
};

// A row of media_kit_posts. `thumbnail` is the platform's own image link until the sync copies it into storage.
export type PostRow = {
  platform: PlatformId;
  id: string;
  date: string;
  time: string | null;
  title: string;
  thumbnail: string | null;
  url: string | null;
  views: number;
  engagement_rate: number;
};

export type SyncInput = {
  token: Token; // already renewed by `refresh`
  days: DayRow[]; // what's already stored for this platform, oldest first
  today: string; // YYYY-MM-DD (UTC), the day the sync runs
};

export type SyncResult = {
  handle?: string;
  days: DayRow[]; // merged into the stored rows key by key
  posts: PostRow[];
};

export type Connector = {
  id: PlatformId;
  name: string;
  // Names of the environment variables this connector needs; the connect page lists whichever are missing.
  env: string[];
  authorizeUrl: (state: string, redirectUri: string) => string;
  exchange: (code: string, redirectUri: string) => Promise<{ token: Token; handle?: string }>;
  // Renews the token when it's due. The sync saves the result before fetching anything, so a renewed token
  // is never lost to a later error.
  refresh: (token: Token) => Promise<Token>;
  sync: (input: SyncInput) => Promise<SyncResult>;
};

export const DAY_MS = 86_400_000;
export const isoDay = (t: number | Date) => new Date(t).toISOString().slice(0, 10);
export const addDays = (day: string, n: number) => isoDay(Date.parse(day + "T00:00:00Z") + n * DAY_MS);

// GET/POST that throws with the platform's own error text, so the connect page can show what went wrong.
export async function fetchJson<T = any>(url: string, init: RequestInit = {}, what = "request"): Promise<T> {
  const res = await fetch(url, { ...init, cache: "no-store" });
  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    // not JSON; reported below if the status is bad
  }
  if (!res.ok || (body && body.error && typeof body.error === "object" && body.error.code && body.error.code !== "ok")) {
    const msg = body?.error?.message || body?.error_description || body?.error?.code || text.slice(0, 300);
    throw new Error(`${what}: ${res.status} ${msg}`);
  }
  return body as T;
}

// Engagement rate as a percentage, or 0 when there are no views yet.
export const rate = (engaged: number, views: number) => (views > 0 ? Math.round((engaged / views) * 1000) / 10 : 0);

// "HH:MM" in UTC
export const hhmm = (t: number) => new Date(t).toISOString().slice(11, 16);

// A post title from a caption: first line, at most 90 characters.
export function titleFrom(text: string | undefined | null, fallback: string) {
  const line = (text || "").split("\n").map((s) => s.trim()).find(Boolean);
  if (!line) return fallback;
  return line.length > 90 ? line.slice(0, 89).trimEnd() + "…" : line;
}
