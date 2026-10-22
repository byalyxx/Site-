import type { PlatformId } from "@/content/media-kit";
import { instagram } from "./instagram";
import { selectAll, supabaseConfigured, upsert, uploadPublic } from "./supabase";
import { tiktok } from "./tiktok";
import { isoDay, type Connector, type DayRow, type PostRow, type Token } from "./types";
import { youtube } from "./youtube";

// The daily refresh. For each connected account: renew its token, fetch the latest figures, merge them into
// the stored days, copy new post thumbnails into storage, and note how it went. One platform failing doesn't
// stop the others.

export const CONNECTORS: Record<PlatformId, Connector> = { tiktok, instagram, youtube };

export type Account = {
  platform: PlatformId;
  token: Token;
  handle: string | null;
  last_sync: string | null;
  last_error: string | null;
};

export const missingEnv = (c: Connector) => c.env.filter((k) => !process.env[k]);

export async function saveAccount(platform: PlatformId, token: Token, handle?: string | null) {
  await upsert("media_kit_accounts", [{ platform, token, ...(handle ? { handle } : {}), updated_at: new Date().toISOString() }]);
}

const STORED = `${process.env.SUPABASE_URL?.replace(/\/$/, "")}/storage/v1/object/public/`;
const MAX_THUMBS_PER_RUN = 40;

async function copyThumbnail(post: PostRow): Promise<string | null> {
  if (!post.thumbnail) return null;
  try {
    const res = await fetch(post.thumbnail, { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const type = res.headers.get("content-type") || "image/jpeg";
    const ext = type.includes("png") ? "png" : type.includes("webp") ? "webp" : "jpg";
    return await uploadPublic(`posts/${post.platform}/${post.id}.${ext}`, await res.arrayBuffer(), type);
  } catch (e) {
    console.warn(`Thumbnail for ${post.platform} ${post.id} not copied: ${e}`);
    // YouTube's image links are permanent; TikTok's and Instagram's expire, so those are dropped rather than left to break.
    return post.platform === "youtube" ? post.thumbnail : null;
  }
}

export type SyncReport = { platform: PlatformId; ok: boolean; message: string }[];

export async function syncAll(only?: PlatformId): Promise<SyncReport> {
  if (!supabaseConfigured) throw new Error("Supabase is not set up (SUPABASE_URL, SUPABASE_SECRET_KEY).");
  const accounts = (await selectAll<Account>("media_kit_accounts")).filter((a) => !only || a.platform === only);
  const today = isoDay(Date.now());
  const report: SyncReport = [];
  let thumbsLeft = MAX_THUMBS_PER_RUN;

  for (const account of accounts) {
    const connector = CONNECTORS[account.platform];
    let token = account.token;
    try {
      const missing = missingEnv(connector);
      if (missing.length) throw new Error(`Missing settings: ${missing.join(", ")}`);

      token = await connector.refresh(account.token);
      if (token !== account.token) await saveAccount(account.platform, token);

      const stored = await selectAll<DayRow>("media_kit_days", `&platform=eq.${account.platform}&order=date.asc`);
      const result = await connector.sync({ token, days: stored, today });

      // Merge key by key, so a refresh that only brings followers doesn't wipe that day's views.
      const byDate = new Map(stored.map((d) => [d.date, d]));
      const rows = result.days.map((d) => {
        const old = byDate.get(d.date);
        return {
          platform: account.platform,
          date: d.date,
          m: { ...(old?.m || {}), ...d.m },
          l: { ...(old?.l || {}), ...d.l },
          totals: d.totals ?? old?.totals ?? null,
          updated_at: new Date().toISOString(),
        };
      });
      await upsert("media_kit_days", rows);

      const known = new Map(
        (await selectAll<PostRow>("media_kit_posts", `&platform=eq.${account.platform}`)).map((p) => [p.id, p])
      );
      const posts: (PostRow & { updated_at: string })[] = [];
      for (const p of result.posts) {
        const had = known.get(p.id)?.thumbnail;
        let thumbnail = had && had.startsWith(STORED) ? had : null;
        if (!thumbnail && thumbsLeft > 0) {
          thumbsLeft--;
          thumbnail = await copyThumbnail(p);
        }
        posts.push({ ...p, thumbnail, updated_at: new Date().toISOString() });
      }
      await upsert("media_kit_posts", posts);

      await upsert("media_kit_accounts", [
        { platform: account.platform, token, ...(result.handle ? { handle: result.handle } : {}), last_sync: new Date().toISOString(), last_error: null },
      ]);
      report.push({ platform: account.platform, ok: true, message: `${rows.length} days, ${posts.length} posts` });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error(`Media kit refresh for ${account.platform} failed: ${message}`);
      await upsert("media_kit_accounts", [{ platform: account.platform, token, last_error: message.slice(0, 1000) }]).catch(() => {});
      report.push({ platform: account.platform, ok: false, message });
    }
  }
  return report;
}
