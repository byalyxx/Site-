import { mediaKitData, type MediaKitData, type MediaKitDay, type MediaKitPost, type PlatformId } from "@/content/media-kit";
import { selectAll } from "../live/supabase";
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

    // Past deliverables: the file's, then every post the refresh found tagging a brand, best first.
    const listed = new Set(data.deliverables.map((d) => d.url).filter(Boolean));
    for (const x of posts) {
      if (!x.sponsor || (x.url && listed.has(x.url))) continue;
      data.deliverables.push({
        brand: x.sponsor,
        title: x.title.replace(/#\S+/g, "").trim() || x.title,
        platform: x.platform,
        ...(x.url ? { url: x.url } : {}),
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
