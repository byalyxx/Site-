import { mediaKitData, type MediaKitData, type MediaKitDay, type MediaKitPost, type PlatformId } from "@/content/media-kit";
import { selectAll } from "../live/supabase";
import { tiktokVideoId } from "../live/tiktok-links";
import type { Account } from "../live/sync";
import type { DayRow, PostRow } from "../live/types";
import type { MediaKitAdapter } from "./types";

// Live numbers: what the daily refresh (lib/media-kit/live/sync.ts) stored in Supabase, on top of
// content/media-kit.ts. A platform with nothing stored yet keeps whatever the file has, and the handles, links,
// snapshot figures and deliverables always come from the file.
export const liveAdapter: MediaKitAdapter = {
  name: "live",
  load: async () => {
    const [days, posts, accounts] = await Promise.all([
      selectAll<DayRow>("media_kit_days", "&order=date.asc"),
      selectAll<PostRow>("media_kit_posts", "&order=date.asc"),
      selectAll<Account>("media_kit_accounts"),
    ]);

    const data: MediaKitData = structuredClone(mediaKitData);
    for (const id of Object.keys(data.platforms) as PlatformId[]) {
      const own = days.filter((d) => d.platform === id);
      if (!own.length) continue;
      const p = data.platforms[id];
      p.days = own.map((d): MediaKitDay => ({
        date: d.date,
        ...(Object.keys(d.m || {}).length ? { m: d.m } : {}),
        ...(Object.keys(d.l || {}).length ? { l: d.l } : {}),
      }));
      p.posts = posts
        .filter((x) => x.platform === id)
        .map((x): MediaKitPost => ({
          date: x.date,
          ...(x.time ? { time: x.time } : {}),
          title: x.title,
          thumbnail: x.thumbnail,
          url: x.url,
          views: Number(x.views),
          engagementRate: Math.min(100, Number(x.engagement_rate)),
        }));
    }

    // Past deliverables: the file's (with live views when the refresh has the same video), then every post the
    // refresh found tagging a brand, best first.
    // Matched by link without its ?query, or for TikTok by video ID (so a short vm.tiktok.com link finds its video).
    const bare = (u: string) => u.split("?")[0].replace(/\/$/, "");
    const byUrl = new Map(posts.filter((x) => x.url).map((x) => [bare(x.url!), x]));
    const byTikTokId = new Map(posts.filter((x) => x.platform === "tiktok").map((x) => [x.id, x]));
    for (const d of data.deliverables) {
      const id = await tiktokVideoId(d.url);
      const live = (id && byTikTokId.get(id)) || (d.url && byUrl.get(bare(d.url)));
      if (live) {
        d.views = Number(live.views);
        if (!d.thumb && live.thumbnail) {
          d.thumb = live.thumbnail;
          d.alt ??= `${d.brand}: ${live.title}`;
        }
        if (!d.title) d.title = live.title.replace(/#\S+/g, "").trim() || live.title;
        if (!d.platform) d.platform = live.platform;
        if (live.url) d.url = bare(live.url);
      }
    }
    const listed = new Set(data.deliverables.map((d) => d.url && bare(d.url)).filter(Boolean));
    for (const x of posts) {
      if (!x.sponsor || (x.url && listed.has(bare(x.url)))) continue;
      data.deliverables.push({
        brand: x.sponsor,
        title: x.title.replace(/#\S+/g, "").trim() || x.title,
        platform: x.platform,
        ...(x.url ? { url: bare(x.url) } : {}),
        ...(x.thumbnail ? { thumb: x.thumbnail, alt: `${x.sponsor}: ${x.title}` } : {}),
        views: Number(x.views),
      });
    }
    data.deliverables.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));

    // "Updated" is the last successful refresh, so a brand can see how fresh the numbers are.
    const synced = accounts.map((a) => a.last_sync).filter((s): s is string => !!s).sort();
    if (synced.length) data.updated = synced[synced.length - 1].slice(0, 10);
    return data;
  },
};
