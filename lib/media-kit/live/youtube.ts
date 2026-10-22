import { addDays, fetchJson, hhmm, rate, type Connector, type DayRow, type PostRow, type Token } from "./types";

// YouTube: the Analytics API for daily figures and lists, the Data API for subscribers and uploads.
// Read-only scopes. Google keeps the refresh token valid as long as the Google Cloud app is "In production"
// (in "Testing" it expires after 7 days; see README).

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const SCOPES = ["https://www.googleapis.com/auth/youtube.readonly", "https://www.googleapis.com/auth/yt-analytics.readonly"];

const DATA = "https://www.googleapis.com/youtube/v3";
const REPORTS = "https://youtubeanalytics.googleapis.com/v2/reports";
const BULK = "https://youtubereporting.googleapis.com/v1";
// The Reporting API's daily reach report: thumbnail impressions and their click-through rate, per video per day.
const REACH_REPORT = "channel_reach_basic_a1";

// YouTube's traffic source codes, in the words YouTube Studio uses.
const SOURCES: Record<string, string> = {
  YT_SEARCH: "YouTube search",
  SUBSCRIBER: "Browse features",
  RELATED_VIDEO: "Suggested videos",
  SHORTS: "Shorts feed",
  EXT_URL: "External",
  NO_LINK_OTHER: "Direct or unknown",
  YT_CHANNEL: "Channel pages",
  PLAYLIST: "Playlists",
  YT_PLAYLIST_PAGE: "Playlist page",
  NOTIFICATION: "Notifications",
  END_SCREEN: "End screens",
  ANNOTATION: "Cards and annotations",
  HASHTAGS: "Hashtag pages",
  YT_OTHER_PAGE: "Other YouTube features",
  ADVERTISING: "Advertising",
  CAMPAIGN_CARD: "Campaign cards",
  SOUND_PAGE: "Sound pages",
  LIVE_REDIRECT: "Live redirects",
  VIDEO_REMIXES: "Remixes",
  NO_LINK_EMBEDDED: "Embedded players",
  PRODUCT_PAGE: "Product pages",
  IMMERSIVE_LIVE: "Immersive live",
};
const AUDIENCE_GENDERS: Record<string, string> = { male: "Men", female: "Women", user_specified: "Other" };
const DEVICES: Record<string, string> = { MOBILE: "Mobile phone", DESKTOP: "Computer", TABLET: "Tablet", TV: "TV", GAME_CONSOLE: "Game console", UNKNOWN_PLATFORM: "Unknown" };
const countryName = (() => {
  const names = new Intl.DisplayNames(["en"], { type: "region" });
  return (code: string) => {
    try {
      return names.of(code) || code;
    } catch {
      return code;
    }
  };
})();

async function accessToken(token: Token): Promise<Token> {
  if (typeof token.access_token === "string" && Number(token.expires_at) > Date.now() + 60_000) return token;
  const res = await fetchJson(
    "https://oauth2.googleapis.com/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: "refresh_token", refresh_token: String(token.refresh_token) }),
    },
    "YouTube token refresh"
  );
  return { ...token, access_token: res.access_token, expires_at: Date.now() + res.expires_in * 1000 };
}

type Report = { columnHeaders: { name: string }[]; rows?: (string | number)[][] };

export const youtube: Connector = {
  id: "youtube",
  name: "YouTube",
  env: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],

  authorizeUrl: (state, redirectUri) =>
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: SCOPES.join(" "),
      access_type: "offline",
      prompt: "consent",
      include_granted_scopes: "true",
      state,
    }),

  async exchange(code, redirectUri) {
    const res = await fetchJson(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: "authorization_code", code, redirect_uri: redirectUri }),
      },
      "YouTube sign-in"
    );
    if (!res.refresh_token) throw new Error("Google sent no refresh token. Remove the app's access at myaccount.google.com/permissions and connect again.");
    const token: Token = { refresh_token: res.refresh_token, access_token: res.access_token, expires_at: Date.now() + res.expires_in * 1000 };
    const ch = await fetchJson(`${DATA}/channels?part=snippet&mine=true`, { headers: { Authorization: `Bearer ${res.access_token}` } }, "YouTube channel");
    return { token, handle: ch.items?.[0]?.snippet?.customUrl || ch.items?.[0]?.snippet?.title };
  },

  refresh: accessToken,

  async sync({ token, days, today }) {
    const auth = { headers: { Authorization: `Bearer ${token.access_token}` } };
    const get = (url: string, what: string) => fetchJson(url, auth, what);
    const report = (params: Record<string, string>, what: string): Promise<Report> =>
      get(`${REPORTS}?` + new URLSearchParams({ ids: "channel==MINE", ...params }), `YouTube ${what}`);
    const rowsOf = (r: Report) => {
      const cols = r.columnHeaders.map((c) => c.name);
      return (r.rows || []).map((row) => Object.fromEntries(cols.map((c, i) => [c, row[i]])) as Record<string, any>);
    };

    // Daily figures: the last two years on every run (so a year can be compared with the one before). It's one
    // request either way, and it keeps every stored day matching YouTube Studio. Lists: four weeks on the first
    // run, then the last week, because YouTube keeps finalising the most recent two or three days.
    const firstRun = days.length === 0;
    const end = addDays(today, -1);
    const start = addDays(end, -729);
    const listStart = addDays(end, firstRun ? -27 : -6);
    const out = new Map<string, DayRow>();
    const day = (date: string) => {
      if (!out.has(date)) out.set(date, { platform: "youtube", date, m: {}, l: {} });
      return out.get(date)!;
    };

    const daily = await report(
      { startDate: start, endDate: end, dimensions: "day", sort: "day", metrics: "views,estimatedMinutesWatched,likes,comments,shares" },
      "daily figures"
    );
    for (const r of rowsOf(daily)) {
      Object.assign(day(r.day).m, { views: r.views, watchMinutes: r.estimatedMinutesWatched, likes: r.likes, comments: r.comments, shares: r.shares });
    }

    // Impressions and click-through rate. The Analytics API doesn't give these, so they come from the Reporting
    // API: a "job" that YouTube runs once a day, leaving one CSV per day (it also makes some days from before
    // the job started). The job is created on the first refresh; each refresh after reads the days not stored
    // yet, plus the last week, which YouTube can restate.
    const notes: string[] = [];
    try {
      const jobs = await get(`${BULK}/jobs`, "YouTube reporting jobs");
      let job = (jobs.jobs || []).find((j: any) => j.reportTypeId === REACH_REPORT);
      if (!job) {
        job = await fetchJson(
          `${BULK}/jobs`,
          { method: "POST", headers: { ...auth.headers, "Content-Type": "application/json" }, body: JSON.stringify({ reportTypeId: REACH_REPORT, name: "Media kit impressions" }) },
          "YouTube reporting job"
        );
        notes.push("impressions job created, first figures within 48 hours");
      }
      const have = new Set(days.filter((d) => typeof d.m?.impressions === "number").map((d) => d.date));
      const recent = addDays(today, -8);
      // Newest copy of each day's report (YouTube reissues a day when it corrects it).
      const newest = new Map<string, { downloadUrl: string; createTime: string }>();
      let reports = 0;
      let pageToken = "";
      for (let page = 0; page < 20; page++) {
        const res = await get(`${BULK}/jobs/${job.id}/reports?pageSize=500${pageToken ? `&pageToken=${pageToken}` : ""}`, "YouTube reports");
        for (const r of res.reports || []) {
          reports++;
          const date = String(r.startTime).slice(0, 10);
          if (have.has(date) && date < recent) continue;
          const prev = newest.get(date);
          if (!prev || r.createTime > prev.createTime) newest.set(date, r);
        }
        if (!res.nextPageToken) break;
        pageToken = res.nextPageToken;
      }
      if (!reports && !notes.length) notes.push("impressions waiting for YouTube's first report (up to 48 hours after the first refresh)");
      // At most 120 days per refresh, newest first, so a big backlog fills over a few refreshes.
      const todo = [...newest.entries()].sort((a, b) => b[0].localeCompare(a[0])).slice(0, 120);
      for (const [date, r] of todo) {
        const csv = await fetch(r.downloadUrl, { ...auth, cache: "no-store" }).then((x) => {
          if (!x.ok) throw new Error(`YouTube report download: ${x.status}`);
          return x.text();
        });
        const [head, ...lines] = csv.trim().split("\n");
        const cols = head.split(",");
        const iImp = cols.indexOf("video_thumbnail_impressions");
        const iCtr = cols.indexOf("video_thumbnail_impressions_ctr");
        if (iImp < 0) continue;
        let impressions = 0;
        let clicks = 0;
        for (const line of lines) {
          const v = line.split(",");
          const n = Number(v[iImp]) || 0;
          impressions += n;
          const ctr = Number(v[iCtr]) || 0;
          clicks += n * (ctr > 1 ? ctr / 100 : ctr);
        }
        // Days with no impressions are stored as 0 too, so they aren't fetched again.
        day(date).m.impressions = impressions;
        // The rate comes as a fraction; store clicks so a week's rate is weighted properly.
        day(date).m.impressionClicks = Math.round(clicks);
      }
    } catch (e) {
      console.warn(String(e));
      notes.push(`impressions not read (${e instanceof Error ? e.message : e})`);
    }

    // Lists, one day at a time (YouTube won't split these by day in a single report).
    for (let d = listStart; d <= end; d = addDays(d, 1)) {
      const one = { startDate: d, endDate: d, metrics: "views" };
      const [countries, sources, devices, top, ages] = await Promise.all([
        report({ ...one, dimensions: "country", sort: "-views", maxResults: "25" }, "countries"),
        report({ ...one, dimensions: "insightTrafficSourceType", sort: "-views" }, "traffic sources"),
        report({ ...one, dimensions: "deviceType", sort: "-views" }, "devices"),
        report({ ...one, dimensions: "video", sort: "-views", maxResults: "10" }, "top videos"),
        // Viewers by age and gender, as percentages of the day's signed-in viewers. Missing on quiet days.
        report({ startDate: d, endDate: d, metrics: "viewerPercentage", dimensions: "ageGroup,gender" }, "age and gender").catch(
          () => null
        ),
      ]);
      const row = day(d);
      const list = (rows: Record<string, any>[], key: string, label: (v: string) => string) => {
        const o: Record<string, number> = {};
        for (const r of rows) if (r.views > 0) o[label(String(r[key]))] = (o[label(String(r[key]))] || 0) + Number(r.views);
        return o;
      };
      row.l.countries = list(rowsOf(countries), "country", countryName);
      row.l.trafficSources = list(rowsOf(sources), "insightTrafficSourceType", (c) => SOURCES[c] || c);
      row.l.devices = list(rowsOf(devices), "deviceType", (c) => DEVICES[c] || c);
      const topRows = rowsOf(top).filter((r) => r.views > 0);
      if (topRows.length) {
        const titles = await get(`${DATA}/videos?part=snippet&id=${topRows.map((r) => r.video).join(",")}`, "YouTube video titles");
        const title = new Map<string, string>(titles.items.map((v: any) => [v.id, v.snippet.title]));
        row.l.topVideos = list(topRows, "video", (id) => title.get(id) || id);
      } else row.l.topVideos = {};
      // Weighted by the day's views, so a busy day counts for more when days are added together.
      const dayViews = Number(row.m.views) || 0;
      if (ages && dayViews) {
        const o: Record<string, number> = {};
        for (const r of rowsOf(ages)) {
          const label = `${AUDIENCE_GENDERS[String(r.gender)] || "Other"} ${String(r.ageGroup).replace("age", "").replace(/-$/, "+").replace("-", "–")}`;
          const v = Math.round((Number(r.viewerPercentage) / 100) * dayViews);
          if (v > 0) o[label] = (o[label] || 0) + v;
        }
        row.l.ageGender = o;
      }
      for (const k of Object.keys(row.l)) if (!Object.keys(row.l[k]).length) delete row.l[k];
    }

    // Subscribers as YouTube shows them today. Recorded on today's date only: earlier days aren't guessed.
    const ch = await get(`${DATA}/channels?part=statistics,contentDetails,snippet&mine=true`, "YouTube channel");
    const channel = ch.items?.[0];
    if (channel && !channel.statistics.hiddenSubscriberCount) day(today).m.subscribers = Number(channel.statistics.subscriberCount);

    // The latest 50 uploads, for the chart tooltip.
    const posts: PostRow[] = [];
    const uploads = channel?.contentDetails?.relatedPlaylists?.uploads;
    if (uploads) {
      const list = await get(`${DATA}/playlistItems?part=contentDetails&maxResults=50&playlistId=${uploads}`, "YouTube uploads");
      const ids = list.items.map((i: any) => i.contentDetails.videoId);
      if (ids.length) {
        const vids = await get(`${DATA}/videos?part=snippet,statistics&id=${ids.join(",")}`, "YouTube video stats");
        for (const v of vids.items) {
          const t = Date.parse(v.snippet.publishedAt);
          const views = Number(v.statistics.viewCount || 0);
          const thumbs = v.snippet.thumbnails || {};
          posts.push({
            platform: "youtube",
            id: v.id,
            date: new Date(t).toISOString().slice(0, 10),
            time: hhmm(t),
            title: v.snippet.title,
            thumbnail: (thumbs.medium || thumbs.high || thumbs.default)?.url || null,
            url: `https://www.youtube.com/watch?v=${v.id}`,
            views,
            // The Data API has no share count per video, so this is (likes + comments) / views.
            engagement_rate: rate(Number(v.statistics.likeCount || 0) + Number(v.statistics.commentCount || 0), views),
          });
        }
      }
    }

    return { notes, handle: channel?.snippet?.customUrl, days: [...out.values()], posts };
  },
};
