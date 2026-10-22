import { socials } from "@/content/site";
import { selectAll, supabaseConfigured } from "./media-kit/live/supabase";

export type Social = { label: string; url: string; followers: string };

// The follower line on the home page and media kit: the latest counts the daily refresh stored (TikTok and
// Instagram followers, YouTube subscribers), each linking to the connected account. Rounded down so the "+"
// stays true (8,528 → 8.5k+). Anything not stored yet keeps what content/site.ts says.
const KEYS: Record<string, { platform: string; metric: string; url: (handle: string) => string }> = {
  TikTok: { platform: "tiktok", metric: "followers", url: (h) => `https://www.tiktok.com/@${h}` },
  Instagram: { platform: "instagram", metric: "followers", url: (h) => `https://www.instagram.com/${h}/` },
  YouTube: { platform: "youtube", metric: "subscribers", url: (h) => `https://www.youtube.com/@${h}` },
};

export const compactPlus = (n: number) =>
  n >= 1_000_000
    ? `${Math.floor(n / 100_000) / 10}m+`
    : n >= 1000
      ? `${Math.floor(n / 100) / 10}k+`
      : `${n}`;

export async function loadFollowers(): Promise<Social[]> {
  const listed = socials.map((s) => ({ label: s.label, url: s.url, followers: s.followers as string }));
  if (!supabaseConfigured) return listed;
  try {
    const [days, accounts] = await Promise.all([
      // Newest first; a platform's count is the first row that has one.
      selectAll<{ platform: string; date: string; m: Record<string, number> }>("media_kit_days", "&date=gte." + since() + "&order=date.desc"),
      selectAll<{ platform: string; handle: string | null }>("media_kit_accounts"),
    ]);
    return listed.map((s) => {
      const k = KEYS[s.label];
      if (!k) return s;
      const count = days.find((d) => d.platform === k.platform && typeof d.m?.[k.metric] === "number")?.m[k.metric];
      const handle = accounts.find((a) => a.platform === k.platform)?.handle?.replace(/^@/, "");
      return { ...s, ...(count ? { followers: compactPlus(count) } : {}), ...(handle ? { url: k.url(handle) } : {}) };
    });
  } catch (e) {
    console.warn(`Followers: using content/site.ts (${e instanceof Error ? e.message : e})`);
    return listed;
  }
}

// Counts older than two months are left to the file rather than shown as current.
const since = () => new Date(Date.now() - 60 * 86_400_000).toISOString().slice(0, 10);
