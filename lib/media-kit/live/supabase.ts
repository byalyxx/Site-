// A small Supabase client over its REST API (PostgREST + Storage), so the site needs no extra packages.
// Server-side only: it uses the project's secret key, which can read and write everything. Never import this
// from a client component.
//
// Tables and the storage bucket are created by supabase/media-kit.sql.

const URL_ = process.env.SUPABASE_URL?.replace(/\/$/, "");
const KEY = process.env.SUPABASE_SECRET_KEY;

export const supabaseConfigured = Boolean(URL_ && KEY);

function headers(extra: Record<string, string> = {}): Record<string, string> {
  if (!URL_ || !KEY) throw new Error("Supabase is not set up: add SUPABASE_URL and SUPABASE_SECRET_KEY (see README).");
  // New-style keys (sb_secret_…) go in `apikey` only; legacy service_role keys are JWTs and also go in Authorization.
  return { apikey: KEY, ...(KEY.startsWith("eyJ") ? { Authorization: `Bearer ${KEY}` } : {}), ...extra };
}

async function check(res: Response, what: string) {
  if (!res.ok) throw new Error(`Supabase ${what} failed: ${res.status} ${await res.text().catch(() => "")}`.trim());
  return res;
}

// Every row of a table, in pages of 1000 (PostgREST's default cap).
export async function selectAll<T>(table: string, query = ""): Promise<T[]> {
  const out: T[] = [];
  for (let offset = 0; ; offset += 1000) {
    const res = await fetch(`${URL_}/rest/v1/${table}?select=*${query}&limit=1000&offset=${offset}`, {
      headers: headers(),
      cache: "no-store",
    });
    const page = (await (await check(res, `read of ${table}`)).json()) as T[];
    out.push(...page);
    if (page.length < 1000) return out;
  }
}

// Insert or replace rows by primary key.
export async function upsert(table: string, rows: object[]) {
  if (!rows.length) return;
  const res = await fetch(`${URL_}/rest/v1/${table}`, {
    method: "POST",
    headers: headers({ "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify(rows),
  });
  await check(res, `write to ${table}`);
}

// Stores a file in the public `media-kit` bucket and returns its public URL.
export async function uploadPublic(path: string, body: ArrayBuffer, contentType: string): Promise<string> {
  const res = await fetch(`${URL_}/storage/v1/object/media-kit/${path}`, {
    method: "POST",
    headers: headers({ "Content-Type": contentType, "x-upsert": "true", "Cache-Control": "max-age=31536000" }),
    body,
  });
  await check(res, `upload of ${path}`);
  return `${URL_}/storage/v1/object/public/media-kit/${path}`;
}
