#!/usr/bin/env node
// Past deliverables from a link: fetches each video's thumbnail (and title, if you didn't give one) and saves
// the image in public/media-kit/deliverables/, so it never expires.
//
//   node scripts/add-deliverable.mjs --brand "Flexispot" --url "https://www.tiktok.com/@byalyxx/video/123"
//       adds that video to content/deliverables.json, then fills it in
//   node scripts/add-deliverable.mjs
//       fills in every entry in content/deliverables.json that has a url but no thumb yet
//
// Optional: --title "E7 Pro desk setup" --views 182000. Works for TikTok, YouTube (incl. Shorts) and Instagram.
// Instagram images need INSTAGRAM_APP_ID and INSTAGRAM_APP_SECRET (Meta's oEmbed); without them it tries the
// post's public preview image, which Instagram sometimes refuses.
//
// The "Add a past deliverable" GitHub Action runs this for you, from github.com or whenever
// content/deliverables.json changes.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILE = join(root, "content/deliverables.json");
const IMAGES = join(root, "public/media-kit/deliverables");
const UA = "Mozilla/5.0 (compatible; byalyxx-media-kit/1.0)";

function args() {
  const out = {};
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) if (a[i].startsWith("--")) out[a[i].slice(2)] = a[i + 1]?.startsWith("--") ? "" : a[++i];
  return out;
}

export function platformOf(url) {
  const host = new URL(url).hostname.replace(/^(www|m|vm|vt)\./, "");
  if (host.endsWith("tiktok.com")) return "tiktok";
  if (host === "youtu.be" || host.endsWith("youtube.com")) return "youtube";
  if (host.endsWith("instagram.com")) return "instagram";
  return null;
}

export function youtubeId(url) {
  const u = new URL(url);
  if (u.hostname === "youtu.be") return u.pathname.slice(1).split("/")[0];
  if (u.searchParams.get("v")) return u.searchParams.get("v");
  const m = u.pathname.match(/\/(shorts|embed|live)\/([\w-]{6,})/);
  return m ? m[2] : null;
}

const slug = (s) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .slice(0, 60) || "deliverable";

async function json(url, init) {
  const res = await fetch(url, { ...init, headers: { "User-Agent": UA, ...(init?.headers || {}) } });
  if (!res.ok) throw new Error(`${res.status} from ${new URL(url).hostname}`);
  return res.json();
}

async function image(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} for the image`);
  const type = res.headers.get("content-type") || "";
  if (!type.startsWith("image/")) throw new Error(`not an image (${type || "no type"})`);
  return { bytes: Buffer.from(await res.arrayBuffer()), ext: type.includes("png") ? "png" : type.includes("webp") ? "webp" : "jpg" };
}

// Returns { thumbUrl(s) to try, title }
async function lookup(url, platform) {
  if (platform === "tiktok") {
    const o = await json(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
    return { thumbs: [o.thumbnail_url], title: o.title };
  }
  if (platform === "youtube") {
    const id = youtubeId(url);
    if (!id) throw new Error("couldn't find the video ID in that YouTube link");
    const o = await json(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`).catch(() => ({}));
    const base = `https://i.ytimg.com/vi/${id}`;
    // Shorts have an upright frame (oardefault); regular videos use the largest 16:9 one there is.
    const shorts = /\/shorts\//.test(url);
    return { thumbs: [...(shorts ? [`${base}/oardefault.jpg`] : []), `${base}/maxresdefault.jpg`, `${base}/hqdefault.jpg`], title: o.title };
  }
  if (platform === "instagram") {
    const id = process.env.INSTAGRAM_APP_ID;
    const secret = process.env.INSTAGRAM_APP_SECRET;
    if (id && secret) {
      try {
        const o = await json(
          `https://graph.facebook.com/v23.0/instagram_oembed?fields=thumbnail_url,title&url=${encodeURIComponent(url)}&access_token=${id}|${secret}`
        );
        if (o.thumbnail_url) return { thumbs: [o.thumbnail_url], title: o.title };
      } catch (e) {
        console.warn(`  Instagram oEmbed: ${e.message}; trying the public preview instead`);
      }
    }
    const res = await fetch(url, { headers: { "User-Agent": "facebookexternalhit/1.1" } });
    const html = await res.text();
    const meta = (p) => html.match(new RegExp(`<meta[^>]+property="og:${p}"[^>]+content="([^"]+)"`))?.[1]?.replace(/&amp;/g, "&");
    if (!meta("image")) throw new Error("Instagram didn't share a preview image for that post");
    return { thumbs: [meta("image")], title: undefined };
  }
  throw new Error("only TikTok, YouTube and Instagram links are supported");
}

async function fill(entry) {
  const platform = entry.platform || platformOf(entry.url);
  if (!platform) throw new Error("only TikTok, YouTube and Instagram links are supported");
  const { thumbs, title } = await lookup(entry.url, platform);
  let img = null;
  let lastError = null;
  for (const t of thumbs.filter(Boolean)) {
    try {
      img = await image(t);
      // YouTube serves a 120×90 grey placeholder when a size doesn't exist.
      if (platform === "youtube" && img.bytes.length < 2000) {
        img = null;
        continue;
      }
      break;
    } catch (e) {
      lastError = e;
    }
  }
  if (!img) throw lastError || new Error("no thumbnail found");
  const name = `${slug(entry.brand)}-${slug(entry.title || title || platform).slice(0, 40)}.${img.ext}`;
  await mkdir(IMAGES, { recursive: true });
  await writeFile(join(IMAGES, name), img.bytes);
  return {
    ...entry,
    platform,
    ...(entry.title || !title ? {} : { title: title.length > 80 ? title.slice(0, 79).trimEnd() + "…" : title }),
    thumb: `/media-kit/deliverables/${name}`,
    alt: entry.alt || `${entry.brand} ${platform === "youtube" ? "video" : "post"} thumbnail`,
  };
}

const opts = args();
const list = JSON.parse(await readFile(FILE, "utf8"));

if (opts.url) {
  if (!opts.brand) {
    console.error("Add --brand \"Brand name\" too.");
    process.exit(1);
  }
  if (!platformOf(opts.url)) {
    console.error("Only TikTok, YouTube and Instagram links are supported.");
    process.exit(1);
  }
  if (!list.some((d) => d.url === opts.url)) {
    list.push({
      brand: opts.brand,
      ...(opts.title ? { title: opts.title } : {}),
      url: opts.url,
      ...(opts.views ? { views: Number(String(opts.views).replace(/[^\d]/g, "")) } : {}),
    });
  }
}

let failed = 0;
for (let i = 0; i < list.length; i++) {
  const d = list[i];
  if (!d.url || d.thumb) continue;
  process.stdout.write(`${d.brand}: ${d.url}\n`);
  try {
    list[i] = await fill(d);
    console.log(`  saved ${list[i].thumb}`);
  } catch (e) {
    failed++;
    console.warn(`  no thumbnail: ${e.message}. Add one by hand as public/media-kit/deliverables/… and set "thumb".`);
  }
}

// A missing thumbnail isn't fatal: the entry is kept and its card shows without an image.
await writeFile(FILE, JSON.stringify(list, null, 2) + "\n");
if (failed) console.warn(`${failed} without a thumbnail.`);
