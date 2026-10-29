import { videos } from "@/content/site";
import { selectAll, supabaseConfigured } from "./media-kit/live/supabase";
import type { Token } from "./media-kit/live/types";
import { youtube } from "./media-kit/live/youtube";

export type VideoStats = { views: string; likes: string; comments: string };

// Views, likes and comments under the featured video on the home page, read from YouTube each time the page
// rebuilds (at most once an hour), using the channel connected at /media-kit/connect. Read-only: the renewed
// token isn't saved, the daily refresh does that. Anything that fails keeps the counts in content/site.ts.
const short = new Intl.NumberFormat("en", { notation: "compact" });
const compact = (n: number) => short.format(n).toLowerCase();

export async function loadVideoStats(id: string): Promise<VideoStats | undefined> {
  const listed = videos.find((v) => v.id === id)?.stats;
  if (!supabaseConfigured) return listed;
  try {
    const [account] = await selectAll<{ token: Token }>("media_kit_accounts", "&platform=eq.youtube");
    if (!account) return listed;
    const token = await youtube.refresh(account.token);
    const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${id}`, {
      headers: { Authorization: `Bearer ${token.access_token}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`YouTube video stats: ${res.status}`);
    const s = (await res.json()).items?.[0]?.statistics;
    if (!s) throw new Error(`YouTube has no stats for ${id}`);
    // A count the channel hides (likes, or comments when they're off) keeps the file's value.
    const pick = (n: string | undefined, fallback?: string) => (n === undefined ? fallback ?? "" : compact(Number(n)));
    return { views: pick(s.viewCount, listed?.views), likes: pick(s.likeCount, listed?.likes), comments: pick(s.commentCount, listed?.comments) };
  } catch (e) {
    console.warn(`Video stats: using content/site.ts (${e instanceof Error ? e.message : e})`);
    return listed;
  }
}
