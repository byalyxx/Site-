import type { MediaKitAdapter } from "./types";

// Stub for pulling live numbers from the platforms instead of content/media-kit.ts.
// Not active: lib/media-kit/load.ts only uses it when MEDIA_KIT_SOURCE=api.
//
// TODO: TikTok: Business API (Display/Research) for daily video views, followers, profile views,
//       likes, comments, shares, plus top videos, traffic sources, territories, age and gender.
// TODO: Instagram: Graph API insights (reach, plays, accounts engaged, profile visits, followers)
//       and per-media insights for `posts`.
// TODO: YouTube: Analytics API reports (views, watch minutes, impressions, CTR, subscribers),
//       and the Data API for uploads into `posts`.
// TODO: keep tokens server-side (env vars), never in the client bundle.
// TODO: map each response into content/media-kit.ts's shape: one `days` entry per date, oldest first,
//       metric keys from lib/media-kit/platforms.ts, missing metrics left out (never zero).
// TODO: cache the responses (the page is built statically; revalidate on a schedule).
export const apiAdapter: MediaKitAdapter = {
  name: "api",
  load: async () => {
    throw new Error("The media kit API adapter is a stub (see the TODOs in lib/media-kit/adapters/api.ts). Unset MEDIA_KIT_SOURCE to use the file adapter.");
  },
};
