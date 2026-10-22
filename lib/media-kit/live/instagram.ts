import { addDays, DAY_MS, fetchJson, hhmm, rate, titleFrom, type Connector, type DayRow, type PostRow, type Token } from "./types";

// Instagram: the Instagram API with Instagram Login (graph.instagram.com). Needs a Business or Creator
// account, but no Facebook Page. The long-lived token lasts 60 days; every sync renews it once it's a day old,
// so it never runs out while the daily refresh is running.

const APP_ID = process.env.INSTAGRAM_APP_ID || "";
const APP_SECRET = process.env.INSTAGRAM_APP_SECRET || "";
const GRAPH = "https://graph.instagram.com/v23.0";
const SCOPES = ["instagram_business_basic", "instagram_business_manage_insights"];

const CONTENT_TYPES: Record<string, string> = { FEED: "Posts", REELS: "Reels", STORY: "Stories", AD: "Ads" };

async function fresh(token: Token): Promise<Token> {
  if (Number(token.refreshed_at) > Date.now() - DAY_MS) return token;
  const res = await fetchJson(
    `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token.access_token}`,
    {},
    "Instagram token renewal"
  );
  return { ...token, access_token: res.access_token, refreshed_at: Date.now(), expires_at: Date.now() + res.expires_in * 1000 };
}

// Total of each metric between two moments (Instagram's "total_value" insights).
async function totals(token: string, metrics: string[], since: number, until: number, extra = "") {
  const res = await fetchJson(
    `${GRAPH}/me/insights?metric=${metrics.join(",")}&period=day&metric_type=total_value&since=${since}&until=${until}${extra}&access_token=${token}`,
    {},
    "Instagram insights"
  );
  return res.data as { name: string; total_value: { value?: number; breakdowns?: { results: { dimension_values: string[]; value: number }[] }[] } }[];
}

export const instagram: Connector = {
  id: "instagram",
  name: "Instagram",
  env: ["INSTAGRAM_APP_ID", "INSTAGRAM_APP_SECRET"],

  authorizeUrl: (state, redirectUri) =>
    "https://www.instagram.com/oauth/authorize?" +
    new URLSearchParams({ client_id: APP_ID, redirect_uri: redirectUri, response_type: "code", scope: SCOPES.join(","), state }),

  async exchange(code, redirectUri) {
    const short = await fetchJson(
      "https://api.instagram.com/oauth/access_token",
      {
        method: "POST",
        body: new URLSearchParams({ client_id: APP_ID, client_secret: APP_SECRET, grant_type: "authorization_code", redirect_uri: redirectUri, code }),
      },
      "Instagram sign-in"
    );
    const long = await fetchJson(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${APP_SECRET}&access_token=${short.access_token}`,
      {},
      "Instagram long-lived token"
    );
    const me = await fetchJson(`${GRAPH}/me?fields=username&access_token=${long.access_token}`, {}, "Instagram account");
    return {
      token: { access_token: long.access_token, refreshed_at: Date.now(), expires_at: Date.now() + long.expires_in * 1000 },
      handle: me.username && `@${me.username}`,
    };
  },

  refresh: fresh,

  async sync({ token, days, today }) {
    const at = String(token.access_token);
    const out = new Map<string, DayRow>();
    const day = (date: string) => {
      if (!out.has(date)) out.set(date, { platform: "instagram", date, m: {}, l: {} });
      return out.get(date)!;
    };

    // Daily totals for each finished day: the last month on the first run, then the last three days
    // (Instagram can take up to 48 hours to settle).
    const firstRun = days.length === 0;
    const end = addDays(today, -1);
    const recent: string[] = [];
    for (let d = addDays(end, firstRun ? -29 : -2); d <= end; d = addDays(d, 1)) recent.push(d);

    // Older days, filled in a bit at a time: up to 60 more days before the earliest stored one on each refresh,
    // back to two years ago (as far as Instagram keeps account insights). Stops at the first day Instagram
    // refuses, so a shorter history just ends there.
    const filled = days.filter((r) => typeof r.m?.views === "number" || typeof r.m?.reach === "number").map((r) => r.date);
    const older: string[] = [];
    if (filled.length) {
      const limit = addDays(today, -730);
      for (let d = addDays(filled[0], -1); d >= limit && older.length < 60; d = addDays(d, -1)) older.push(d);
    }

    for (const d of [...recent, ...older]) {
      const isOlder = !recent.includes(d);
      const since = Date.parse(d + "T00:00:00Z") / 1000;
      const until = since + 86_400;
      const row = day(d);
      const names: Record<string, string> = {
        reach: "reach",
        views: "views",
        accounts_engaged: "accountsEngaged",
        likes: "likes",
        comments: "comments",
        shares: "shares",
        profile_views: "profileVisits",
      };
      let got;
      try {
        got = await totals(at, Object.keys(names), since, until);
      } catch (e) {
        if (!isOlder) throw e;
        console.warn(String(e));
        out.delete(d);
        break;
      }
      for (const r of got) {
        if (typeof r.total_value?.value === "number") row.m[names[r.name]] = r.total_value.value;
      }
      // Reach split by content type (posts, reels, stories). Skipped quietly if the account doesn't get it.
      try {
        const [byType] = await totals(at, ["reach"], since, until, "&breakdown=media_product_type");
        const results = byType?.total_value?.breakdowns?.[0]?.results || [];
        const o: Record<string, number> = {};
        for (const x of results) if (x.value > 0) o[CONTENT_TYPES[x.dimension_values[0]] || x.dimension_values[0]] = x.value;
        if (Object.keys(o).length) row.l.contentReach = o;
      } catch (e) {
        console.warn(String(e));
      }
    }

    // Followers today, recorded on today's date only.
    const me = await fetchJson(`${GRAPH}/me?fields=username,followers_count&access_token=${at}`, {}, "Instagram account");
    if (typeof me.followers_count === "number") day(today).m.followers = me.followers_count;

    // Recent posts with their lifetime reach and views.
    const media = await fetchJson(
      `${GRAPH}/me/media?fields=id,caption,media_type,media_product_type,permalink,thumbnail_url,media_url,timestamp,like_count,comments_count&limit=25&access_token=${at}`,
      {},
      "Instagram posts"
    );
    const posts: PostRow[] = [];
    const reachNow: Record<string, number> = {};
    const titles: Record<string, string> = {};
    for (const p of media.data || []) {
      let reach = 0;
      let views = 0;
      let shares = 0;
      try {
        const ins = await fetchJson(`${GRAPH}/${p.id}/insights?metric=reach,views,shares&access_token=${at}`, {}, "Instagram post insights");
        for (const r of ins.data || []) {
          const v = Number(r.values?.[0]?.value ?? r.total_value?.value ?? 0);
          if (r.name === "reach") reach = v;
          if (r.name === "views") views = v;
          if (r.name === "shares") shares = v;
        }
      } catch (e) {
        console.warn(String(e));
      }
      const t = Date.parse(p.timestamp);
      const title = titleFrom(p.caption, p.media_product_type === "REELS" ? "Reel" : "Post");
      reachNow[p.id] = reach;
      titles[p.id] = title;
      const shown = views || reach;
      posts.push({
        platform: "instagram",
        id: p.id,
        date: new Date(t).toISOString().slice(0, 10),
        time: hhmm(t),
        title,
        thumbnail: p.thumbnail_url || (p.media_type === "VIDEO" ? null : p.media_url) || null,
        url: p.permalink || null,
        views: shown,
        engagement_rate: rate(Number(p.like_count || 0) + Number(p.comments_count || 0) + shares, shown),
      });
    }

    // Top posts and reels: Instagram only gives each post's lifetime reach, so the day's figure is the change
    // since the last refresh, filed under today. The first refresh has nothing to compare with and adds none.
    // (Compared with an earlier day, so a second refresh on the same day doesn't shrink today's figure.)
    const prev = [...days].reverse().find((d) => d.date < today && d.totals && (d.totals as any).postReach);
    const before = (prev?.totals as any)?.postReach as Record<string, number> | undefined;
    const todayRow = day(today);
    todayRow.totals = { postReach: reachNow };
    if (before) {
      const o: Record<string, number> = {};
      for (const [id, n] of Object.entries(reachNow)) {
        const gain = n - (before[id] ?? 0);
        if (gain > 0 && before[id] !== undefined) o[titles[id]] = (o[titles[id]] || 0) + gain;
        // A post that's new since the last refresh: everything it reached so far happened since then.
        if (gain > 0 && before[id] === undefined) o[titles[id]] = (o[titles[id]] || 0) + n;
      }
      if (Object.keys(o).length) todayRow.l.topPosts = o;
    }

    return { handle: me.username && `@${me.username}`, days: [...out.values()], posts };
  },
};
