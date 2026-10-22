// Load-time check for the media kit data. Runs on whatever an adapter returns, before the page renders,
// and collects every problem with its path (e.g. `platforms.tiktok.days[3].m.veiws`) instead of stopping
// at the first one. The page itself never sees data that failed this.

import type { MediaKitData, PlatformId } from "@/content/media-kit";
import { ALL_LIST_KEYS, PLATFORMS } from "./platforms";

const PLATFORM_IDS = Object.keys(PLATFORMS) as PlatformId[];

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const isCount = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0;
const isDate = (v: unknown): v is string =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && new Date(v + "T00:00:00Z").toISOString().slice(0, 10) === v;
const isTime = (v: unknown) => typeof v === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
const isText = (v: unknown): v is string => typeof v === "string" && v.trim() !== "";
const isLink = (v: unknown) => typeof v === "string" && (v.startsWith("https://") || v.startsWith("/"));

export function validateMediaKit(input: unknown): string[] {
  const errors: string[] = [];
  const bad = (path: string, what: string) => errors.push(`${path}: ${what}`);

  if (!isObj(input)) return ["data: expected an object"];
  const data = input;

  if (!isDate(data.updated)) bad("updated", "expected a YYYY-MM-DD date");
  if (data.email !== undefined && !isText(data.email)) bad("email", "expected text");
  if (data.sample !== undefined && typeof data.sample !== "boolean") bad("sample", "expected true or false");

  // Numbers keyed by label, as in `l` lists and `m` metrics
  const counts = (path: string, v: unknown, allowed?: string[]) => {
    if (!isObj(v)) return bad(path, "expected an object");
    for (const [k, n] of Object.entries(v)) {
      if (allowed && !allowed.includes(k)) bad(`${path}.${k}`, `unknown key (known: ${allowed.join(", ")})`);
      else if (!isCount(n)) bad(`${path}.${k}`, "expected a number, 0 or more");
    }
  };
  const lists = (path: string, v: unknown, allowed: string[]) => {
    if (!isObj(v)) return bad(path, "expected an object");
    for (const [k, list] of Object.entries(v)) {
      if (!allowed.includes(k)) bad(`${path}.${k}`, `unknown list (known: ${allowed.join(", ")})`);
      else counts(`${path}.${k}`, list);
    }
  };
  const hours = (path: string, v: unknown) => {
    if (!Array.isArray(v) || v.length !== 24 || !v.every(isCount)) bad(path, "expected 24 numbers, one per hour");
  };
  // Days and all.days: valid dates, oldest first, one entry per date
  const dated = (path: string, days: unknown, each: (path: string, d: Record<string, unknown>) => void) => {
    if (!Array.isArray(days)) return bad(path, "expected a list");
    let prev = "";
    days.forEach((d, i) => {
      const at = `${path}[${i}]`;
      if (!isObj(d)) return bad(at, "expected an object");
      if (!isDate(d.date)) bad(`${at}.date`, "expected a YYYY-MM-DD date");
      else {
        if (prev && d.date <= prev) bad(`${at}.date`, d.date === prev ? `${d.date} appears twice` : `${d.date} comes after ${prev}: keep days oldest first`);
        prev = d.date;
      }
      each(at, d);
    });
  };

  if (!isObj(data.platforms)) bad("platforms", "expected an object");
  else {
    for (const k of Object.keys(data.platforms)) if (!PLATFORM_IDS.includes(k as PlatformId)) bad(`platforms.${k}`, "unknown platform");
    for (const id of PLATFORM_IDS) {
      const p = data.platforms[id];
      const at = `platforms.${id}`;
      if (!isObj(p)) {
        bad(at, "missing");
        continue;
      }
      const spec = PLATFORMS[id];
      const listKeys = spec.lists.flat().map((l) => l.key);
      if (!isText(p.handle)) bad(`${at}.handle`, "expected text");
      if (!isLink(p.url)) bad(`${at}.url`, "expected an https:// link");
      if (!isObj(p.snapshot)) bad(`${at}.snapshot`, "expected an object");
      else
        for (const [k, v] of Object.entries(p.snapshot))
          if (!(isText(v) || isCount(v))) bad(`${at}.snapshot.${k}`, "expected text or a number");

      dated(`${at}.days`, p.days, (dAt, d) => {
        if (d.hours !== undefined) hours(`${dAt}.hours`, d.hours);
        if (d.m !== undefined) counts(`${dAt}.m`, d.m, spec.metrics);
        if (d.l !== undefined) lists(`${dAt}.l`, d.l, listKeys);
      });

      if (!Array.isArray(p.posts)) bad(`${at}.posts`, "expected a list");
      else
        p.posts.forEach((post, i) => {
          const pAt = `${at}.posts[${i}]`;
          if (!isObj(post)) return bad(pAt, "expected an object");
          if (!isDate(post.date)) bad(`${pAt}.date`, "expected a YYYY-MM-DD date");
          if (post.time !== undefined && !isTime(post.time)) bad(`${pAt}.time`, "expected HH:MM, 24-hour");
          if (!isText(post.title)) bad(`${pAt}.title`, "expected text");
          if (post.thumbnail !== null && !isLink(post.thumbnail)) bad(`${pAt}.thumbnail`, "expected an image path, a link or null");
          if (post.url !== null && !isLink(post.url)) bad(`${pAt}.url`, "expected an https:// link or null");
          if (!isCount(post.views)) bad(`${pAt}.views`, "expected a number, 0 or more");
          if (!(isCount(post.engagementRate) && post.engagementRate <= 100)) bad(`${pAt}.engagementRate`, "expected a percentage, 0 to 100");
        });
    }
  }

  if (!isObj(data.all)) bad("all", "expected an object with `days`");
  else
    dated("all.days", data.all.days, (dAt, d) => {
      if (d.views !== undefined) counts(`${dAt}.views`, d.views, PLATFORM_IDS);
      if (d.hours !== undefined) {
        if (!isObj(d.hours)) bad(`${dAt}.hours`, "expected an object keyed by platform");
        else
          for (const [k, h] of Object.entries(d.hours)) {
            if (!PLATFORM_IDS.includes(k as PlatformId)) bad(`${dAt}.hours.${k}`, "unknown platform");
            else hours(`${dAt}.hours.${k}`, h);
          }
      }
      if (d.l !== undefined) lists(`${dAt}.l`, d.l, ALL_LIST_KEYS);
    });

  if (!Array.isArray(data.deliverables)) bad("deliverables", "expected a list");
  else
    data.deliverables.forEach((d, i) => {
      const at = `deliverables[${i}]`;
      if (!isObj(d)) return bad(at, "expected an object");
      if (!isText(d.brand)) bad(`${at}.brand`, "expected text");
      if (d.title !== undefined && !isText(d.title)) bad(`${at}.title`, "expected text");
      if (d.platform !== undefined && !PLATFORM_IDS.includes(d.platform as PlatformId)) bad(`${at}.platform`, `expected one of ${PLATFORM_IDS.join(", ")}`);
      if (d.url !== undefined && !isLink(d.url)) bad(`${at}.url`, "expected an https:// link");
      if (d.thumb !== undefined && !isLink(d.thumb)) bad(`${at}.thumb`, "expected an image path");
      if (d.alt !== undefined && !isText(d.alt)) bad(`${at}.alt`, "expected text");
      if (d.views !== undefined && !isCount(d.views)) bad(`${at}.views`, "expected a number, 0 or more");
    });

  return errors;
}

export function assertValidMediaKit(input: unknown, source: string): MediaKitData {
  const errors = validateMediaKit(input);
  if (errors.length) {
    throw new Error(`Media kit data from the ${source} adapter failed validation (${errors.length}):\n  ${errors.slice(0, 50).join("\n  ")}`);
  }
  return input as MediaKitData;
}
