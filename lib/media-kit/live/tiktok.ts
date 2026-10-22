import { fetchJson, hhmm, rate, titleFrom, type Connector, type DayRow, type PostRow, type Token } from "./types";

// TikTok: Login Kit + Display API (open.tiktokapis.com). Works in the developer portal's Sandbox with your
// own account added as a target user, so no app review is needed.
//
// TikTok only gives running totals (followers now, each video's views so far), not daily figures. So each
// refresh records today's totals, and a day's views, likes, comments and shares are the change since the
// previous refresh. Nothing before the first refresh is filled in.

const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY || "";
const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET || "";
const API = "https://open.tiktokapis.com/v2";
const SCOPES = ["user.info.basic", "user.info.profile", "user.info.stats", "video.list"];

async function tokenRequest(params: Record<string, string>, what: string): Promise<Token> {
  const res = await fetchJson(
    `${API}/oauth/token/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_key: CLIENT_KEY, client_secret: CLIENT_SECRET, ...params }),
    },
    what
  );
  if (!res.access_token) throw new Error(`${what}: ${res.error_description || res.error || "no token returned"}`);
  return {
    access_token: res.access_token,
    expires_at: Date.now() + res.expires_in * 1000,
    refresh_token: res.refresh_token,
    refresh_expires_at: Date.now() + res.refresh_expires_in * 1000,
    open_id: res.open_id,
  };
}

async function fresh(token: Token): Promise<Token> {
  if (Number(token.expires_at) > Date.now() + 60_000) return token;
  return tokenRequest({ grant_type: "refresh_token", refresh_token: String(token.refresh_token) }, "TikTok token refresh");
}

type Video = {
  id: string;
  title?: string;
  video_description?: string;
  create_time: number;
  cover_image_url?: string;
  share_url?: string;
  view_count?: number;
  like_count?: number;
  comment_count?: number;
  share_count?: number;
};

export const tiktok: Connector = {
  id: "tiktok",
  name: "TikTok",
  env: ["TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET"],

  authorizeUrl: (state, redirectUri) =>
    "https://www.tiktok.com/v2/auth/authorize/?" +
    new URLSearchParams({ client_key: CLIENT_KEY, scope: SCOPES.join(","), response_type: "code", redirect_uri: redirectUri, state }),

  async exchange(code, redirectUri) {
    const token = await tokenRequest({ grant_type: "authorization_code", code, redirect_uri: redirectUri }, "TikTok sign-in");
    const me = await fetchJson(`${API}/user/info/?fields=username`, { headers: { Authorization: `Bearer ${token.access_token}` } }, "TikTok account");
    return { token, handle: me.data?.user?.username && `@${me.data.user.username}` };
  },

  refresh: fresh,

  async sync({ token, days, today }) {
    const auth = { Authorization: `Bearer ${token.access_token}` };

    const me = await fetchJson(`${API}/user/info/?fields=username,follower_count,likes_count,video_count`, { headers: auth }, "TikTok account");
    const user = me.data?.user || {};

    // Every video (20 per page), up to 500.
    const videos: Video[] = [];
    let cursor: number | undefined;
    for (let page = 0; page < 25; page++) {
      const res = await fetchJson(
        `${API}/video/list/?fields=id,title,video_description,create_time,cover_image_url,share_url,view_count,like_count,comment_count,share_count`,
        { method: "POST", headers: { ...auth, "Content-Type": "application/json" }, body: JSON.stringify({ max_count: 20, ...(cursor ? { cursor } : {}) }) },
        "TikTok videos"
      );
      videos.push(...(res.data?.videos || []));
      if (!res.data?.has_more) break;
      cursor = res.data.cursor;
    }

    const sum = (k: keyof Video) => videos.reduce((a, v) => a + (Number(v[k]) || 0), 0);
    const totals = {
      views: sum("view_count"),
      likes: sum("like_count"),
      comments: sum("comment_count"),
      shares: sum("share_count"),
      perVideo: Object.fromEntries(videos.map((v) => [v.id, Number(v.view_count) || 0])),
    };
    const titleOf = (v: Video) => titleFrom(v.title || v.video_description, "TikTok video");

    const row: DayRow = { platform: "tiktok", date: today, m: {}, l: {}, totals };
    if (typeof user.follower_count === "number") row.m.followers = user.follower_count;

    // Change since the last refresh on an earlier day. A video deleted since then would make a total go down;
    // that day's figure is left out rather than shown as a negative.
    const prev = [...days].reverse().find((d) => d.date < today && d.totals && typeof (d.totals as any).views === "number");
    const before = prev?.totals as typeof totals | undefined;
    if (before) {
      for (const k of ["views", "likes", "comments", "shares"] as const) {
        const gain = totals[k] - before[k];
        if (gain >= 0) row.m[k] = gain;
      }
      const top: Record<string, number> = {};
      for (const v of videos) {
        const was = before.perVideo?.[v.id] ?? 0;
        const gain = (Number(v.view_count) || 0) - was;
        if (gain > 0) top[titleOf(v)] = (top[titleOf(v)] || 0) + gain;
      }
      if (Object.keys(top).length) row.l.topVideos = top;
    }

    const posts: PostRow[] = videos.slice(0, 50).map((v) => {
      const t = v.create_time * 1000;
      const views = Number(v.view_count) || 0;
      return {
        platform: "tiktok",
        id: v.id,
        date: new Date(t).toISOString().slice(0, 10),
        time: hhmm(t),
        title: titleOf(v),
        thumbnail: v.cover_image_url || null,
        url: v.share_url || null,
        views,
        engagement_rate: rate((Number(v.like_count) || 0) + (Number(v.comment_count) || 0) + (Number(v.share_count) || 0), views),
      };
    });

    return { handle: user.username && `@${user.username}`, days: [row], posts };
  },
};
