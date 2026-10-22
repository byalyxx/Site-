// The media kit's numbers (/media-kit). This is the only file you need to edit for the analytics.
// It is read through the file adapter in lib/media-kit/adapters/file.ts and checked by
// lib/media-kit/validate.ts when the page builds, so a typo fails the build instead of shipping.
//
// Rules the page follows:
// - A metric with no data is left out, never shown as zero.
// - Nothing is carried from one platform to another.
//
// `snapshot` holds figures you only have as a single total (shown as-is, whatever the date range).
// `days` holds one entry per day, oldest first, so every date range can be worked out:
//   { date: "2026-10-21", hours: [24 numbers, optional, for the chart on single-day ranges],
//     m: { ...daily totals }, l: { listName: { "Row label": number } } }
// The keys each platform understands are listed in lib/media-kit/platforms.ts.
// `posts` lists what went up, so the chart tooltip can say which post a spike came from:
//   { date: "2026-10-09", time: "18:00" (optional, places it on hourly charts), title: "I ranked every upgrade on my desk",
//     thumbnail: "/media-kit/posts/ranked.jpg", url: "https://…", views: 48200, engagementRate: 9.1 }
// Images go in public/media-kit/ (posts/, deliverables/) and are referenced from "/media-kit/…".
//
// Partners are not listed here: the page uses `partners` in content/site.ts, the same rows as /partners.

export type PlatformId = "tiktok" | "instagram" | "youtube";

export type MediaKitDay = {
  date: string; // YYYY-MM-DD
  hours?: number[]; // 24 values: the charted metric per hour
  m?: Record<string, number>;
  l?: Record<string, Record<string, number>>;
};

export type MediaKitPost = {
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  title: string;
  thumbnail: string | null;
  url: string | null;
  views: number;
  engagementRate: number; // percent
};

export type MediaKitPlatform = {
  handle: string;
  url: string;
  snapshot: Record<string, string | number>;
  days: MediaKitDay[];
  posts: MediaKitPost[];
};

export type MediaKitAllDay = {
  date: string;
  views?: Partial<Record<PlatformId, number>>;
  hours?: Partial<Record<PlatformId, number[]>>;
  l?: Record<string, Record<string, number>>;
};

export type MediaKitDeliverable = {
  brand: string;
  title?: string;
  platform?: PlatformId;
  url?: string;
  thumb?: string; // 9:16 image
  alt?: string;
  views?: number; // all-time views, for the All tab's top deliverables list
};

export type MediaKitData = {
  updated: string; // YYYY-MM-DD the numbers were last brought up to date
  email?: string;
  platforms: Record<PlatformId, MediaKitPlatform>;
  all: { days: MediaKitAllDay[] };
  deliverables: MediaKitDeliverable[];
  sample?: boolean; // set by the sample generator only
};

export const mediaKitData: MediaKitData = {
  // Date the numbers were last brought up to date (YYYY-MM-DD).
  updated: "2026-09-23",
  email: "byalyxx@gmail.com",

  platforms: {
    tiktok: {
      handle: "@byalyxx",
      url: "https://www.tiktok.com/@byalyxx",
      // Same figure as the old byalyxx.com/media-kit (Sep 23, 2026).
      snapshot: { followers: "7k+" },
      days: [],
      posts: [],
    },
    instagram: {
      handle: "@byalyxx",
      url: "https://www.instagram.com/byalyxx/",
      snapshot: { followers: "900+" },
      days: [],
      posts: [],
    },
    youtube: {
      handle: "@byalyxx",
      url: "https://www.youtube.com/@byalyxx",
      snapshot: { subscribers: "600+" },
      days: [],
      posts: [],
    },
  },

  // The All tab. Per-platform totals (views, followers, engagements) are worked out from the
  // platform days above, using the metrics in each platform's `combined` entry (lib/media-kit/platforms.ts).
  // Add a day here only for what the platforms can't give on their own:
  //   { date: "2026-10-21",
  //     views: { tiktok: 9120, instagram: 3400, youtube: 700 },        optional, overrides the worked-out totals
  //     hours: { tiktok: [24 numbers], instagram: [...], youtube: [...] }, views per hour, for single-day ranges
  //     l: { countries: { "United Kingdom": 4300, ... } } }              views by country, all three platforms together
  // Top countries shows each country's share of the range's total views (the three platforms' views added up),
  // so the countries listed here don't need to cover every country: the total already does.
  all: { days: [] },

  // Brand work, best first: the first three are what a brand sees without scrolling.
  // { brand: "Flexispot", title: "E7 Pro desk setup", platform: "tiktok" | "instagram" | "youtube",
  //   url: "https://…", thumb: "/media-kit/deliverables/flexispot.jpg" (9:16 image), alt: "What the frame shows",
  //   views: 182000 }
  deliverables: [],
};
