// TikTok video IDs from any link: a full one (tiktok.com/@user/video/123) is read directly, and a short one
// (vm.tiktok.com/…, vt.tiktok.com/…) is followed to where it redirects. Short links are looked up once per
// server process; null when the link can't be read.
const resolved = new Map<string, Promise<string | null>>();

const idIn = (url: string) => url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/)?.[1] ?? null;

export function tiktokVideoId(url: string | undefined | null): Promise<string | null> {
  if (!url || !/tiktok\.com/.test(url)) return Promise.resolve(null);
  const direct = idIn(url);
  if (direct) return Promise.resolve(direct);
  if (!resolved.has(url)) {
    resolved.set(
      url,
      (async () => {
        let next = url;
        // A few hops at most: vm.tiktok.com → www.tiktok.com/@user/video/… (sometimes via a /t/ link).
        for (let hop = 0; hop < 4; hop++) {
          const res = await fetch(next, { redirect: "manual", headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(8000) });
          const to = res.headers.get("location");
          if (!to) return null;
          next = new URL(to, next).toString();
          const id = idIn(next);
          if (id) return id;
        }
        return null;
      })().catch(() => null)
    );
  }
  return resolved.get(url)!;
}
