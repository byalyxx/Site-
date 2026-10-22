// What each platform reports, in its own terms. Metrics are not shared between platforms:
// a KPI or list only appears when the data for it exists.
//
// `metrics` and the list keys are what content/media-kit.ts may use for that platform; the validator
// rejects anything else, so a misspelt key fails the build instead of quietly disappearing.
//
// `tooltip` is the secondary figure in the chart tooltip: a count (`sum`) or a rate (`num` ÷ `den`,
// so a week's rate is weighted by that week's views rather than added up day by day).
//
// `combined` names the metrics that measure the same thing on every platform, for the All tab.
// Engagements are likes + comments + shares on all three (saves are left out: YouTube has none).
//
// KPI `value(days, snapshot)` returns a number (formatted with `format`) or a ready string, or null to hide it.

import type { MediaKitDay, PlatformId } from "@/content/media-kit";

type Snapshot = Record<string, string | number>;
type Value = (days: MediaKitDay[], snapshot?: Snapshot) => number | string | null;

export type PlatformSpec = {
  name: string;
  metrics: string[];
  chart: { key: string; label: string };
  combined: { views: string; viewsLabel: string; audience: string; audienceLabel: string };
  tooltip:
    | { label: string; sum: string; format: string }
    | { label: string; num: string[]; den: string; scale: number; format: string };
  kpis: { label: string; value: Value; format: string }[];
  lists: { key: string; title: string; icon: string; unit: string; share?: boolean }[][];
};

const sum =
  (key: string) =>
  (days: MediaKitDay[]): number | null => {
    let total = 0;
    let seen = false;
    for (const d of days) {
      const v = d.m && d.m[key];
      if (typeof v === "number") {
        total += v;
        seen = true;
      }
    }
    return seen ? total : null;
  };

// Latest value in the range (follower-type totals), falling back to the snapshot figure.
const latest =
  (key: string): Value =>
  (days, snapshot) => {
    for (let i = days.length - 1; i >= 0; i--) {
      const v = days[i].m && days[i].m![key];
      if (typeof v === "number") return v;
    }
    return snapshot && snapshot[key] != null ? snapshot[key] : null;
  };

const ratio =
  (top: string[], bottom: string, scale = 1): Value =>
  (days) => {
    const a = top.map((k) => sum(k)(days));
    const b = sum(bottom)(days);
    if (a.some((v) => v == null) || !b) return null;
    return ((a as number[]).reduce((x, y) => x + y, 0) / b) * scale;
  };

export const ENGAGEMENT_KEYS = ["likes", "comments", "shares"];

export const PLATFORMS: Record<PlatformId, PlatformSpec> = {
  tiktok: {
    name: "TikTok",
    metrics: ["followers", "views", "profileViews", "likes", "comments", "shares"],
    chart: { key: "views", label: "Video views" },
    combined: { views: "views", viewsLabel: "video views", audience: "followers", audienceLabel: "followers" },
    tooltip: { label: "Engagement rate", num: ["likes", "comments", "shares"], den: "views", scale: 100, format: "percent" },
    kpis: [
      { label: "Followers", value: latest("followers"), format: "compact" },
      { label: "Video views", value: sum("views"), format: "compact" },
      { label: "Profile views", value: sum("profileViews"), format: "compact" },
      // (likes + comments + shares) / views
      { label: "Engagement rate", value: ratio(["likes", "comments", "shares"], "views", 100), format: "percent" },
    ],
    lists: [
      [
        { key: "topVideos", title: "Top videos", icon: "video", unit: "Views" },
        { key: "trafficSources", title: "Traffic sources", icon: "source", unit: "Views" },
      ],
      [
        { key: "territories", title: "Audience territories", icon: "country", unit: "Viewers" },
        { key: "ageGender", title: "Age and gender", icon: "person", unit: "Viewers", share: true },
      ],
    ],
  },

  instagram: {
    name: "Instagram",
    metrics: ["followers", "reach", "plays", "accountsEngaged", "profileVisits", "likes", "comments", "shares"],
    chart: { key: "reach", label: "Reach" },
    // Plays, not reach: plays count views the way TikTok and YouTube do, reach counts accounts.
    combined: { views: "plays", viewsLabel: "plays", audience: "followers", audienceLabel: "followers" },
    tooltip: { label: "Accounts engaged", sum: "accountsEngaged", format: "number" },
    kpis: [
      { label: "Followers", value: latest("followers"), format: "compact" },
      { label: "Reach", value: sum("reach"), format: "compact" },
      { label: "Accounts engaged", value: sum("accountsEngaged"), format: "compact" },
      { label: "Profile visits", value: sum("profileVisits"), format: "compact" },
    ],
    lists: [
      [
        { key: "topPosts", title: "Top posts and reels", icon: "video", unit: "Reach" },
        { key: "contentReach", title: "Reach by content type", icon: "layers", unit: "Reach" },
      ],
      [
        { key: "locations", title: "Top locations", icon: "country", unit: "Followers", share: true },
        { key: "followerGrowth", title: "Follower growth", icon: "person", unit: "Accounts" },
      ],
    ],
  },

  youtube: {
    name: "YouTube",
    metrics: ["subscribers", "views", "watchMinutes", "impressions", "impressionClicks", "likes", "comments", "shares"],
    chart: { key: "views", label: "Views" },
    combined: { views: "views", viewsLabel: "views", audience: "subscribers", audienceLabel: "subscribers" },
    tooltip: { label: "Avg view duration", num: ["watchMinutes"], den: "views", scale: 60, format: "duration" },
    kpis: [
      { label: "Subscribers", value: latest("subscribers"), format: "compact" },
      { label: "Views", value: sum("views"), format: "compact" },
      {
        label: "Watch time",
        value: (days) => {
          const m = sum("watchMinutes")(days);
          return m == null ? null : m / 60;
        },
        format: "hours",
      },
      // watch time / views, in seconds
      { label: "Avg view duration", value: ratio(["watchMinutes"], "views", 60), format: "duration" },
      { label: "Impressions", value: sum("impressions"), format: "compact" },
      // views from impressions / impressions
      { label: "Click-through rate", value: ratio(["impressionClicks"], "impressions", 100), format: "percent" },
    ],
    lists: [
      [
        { key: "topVideos", title: "Top videos", icon: "video", unit: "Views" },
        { key: "trafficSources", title: "Traffic sources", icon: "source", unit: "Views" },
      ],
      [
        { key: "countries", title: "Top countries", icon: "country", unit: "Views" },
        { key: "devices", title: "Device type", icon: "device", unit: "Views", share: true },
      ],
    ],
  },
};

// Lists the All tab reads from `all.days[].l` (views across all three platforms together).
export const ALL_LIST_KEYS = ["countries"];
