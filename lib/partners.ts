import { partners as listed, type Partner } from "@/content/site";
import { selectAll, supabaseConfigured } from "./media-kit/live/supabase";

// Partners for /partners and the media kit: the ones in content/site.ts, plus any brand the daily refresh found
// in a sponsored TikTok (a caption that @mentions it, or a deal added to content/deliverables.json). Ranked by
// their latest deal, newest first; partners with no tracked deal keep their order after those. A brand found
// this way links to its latest video with the creator, since there's no affiliate link for it yet.
const key = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const month = (date: string) => new Date(date + "T00:00:00Z").toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });

export async function loadPartners(): Promise<Partner[]> {
  if (!supabaseConfigured) return listed;
  try {
    const deals = await selectAll<{ sponsor: string; date: string; url: string | null }>(
      "media_kit_posts",
      "&sponsor=not.is.null&order=date.desc"
    );
    const latest = new Map<string, { sponsor: string; date: string; url: string | null }>();
    for (const d of deals) if (!latest.has(key(d.sponsor))) latest.set(key(d.sponsor), d);

    const found: Partner[] = [...latest.entries()]
      .filter(([k, d]) => !listed.some((p) => key(p.name) === k) && d.url)
      .map(([, d]) => ({ name: d.sponsor, description: `Sponsored TikTok, ${month(d.date)}`, url: d.url! }));
    const dateOf = (p: Partner) => latest.get(key(p.name))?.date ?? "";
    return [...listed, ...found]
      .map((p, i) => ({ p, i }))
      .sort((a, b) => dateOf(b.p).localeCompare(dateOf(a.p)) || a.i - b.i)
      .map((x) => x.p);
  } catch (e) {
    console.warn(`Partners: using content/site.ts only (${e instanceof Error ? e.message : e})`);
    return listed;
  }
}
