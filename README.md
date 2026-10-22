# byalyxx.com

The self-hosted version of byalyxx.com, moved off Framer. Built with Next.js, Tailwind and shadcn/ui (components in `components/ui`), running as a Node.js app.

## Edit the content

Everything on the page lives in [`content/site.ts`](content/site.ts): profile, socials, videos, gear and partner (affiliate) links. Anything marked `TODO` is still a placeholder.

- Partner logos and your portrait go in `public/` (e.g. `public/partners/brand.png`, then `logo: "/partners/brand.png"`).
- Affiliate links get `rel="sponsored"` automatically, which is what Google asks for.

### Media kit numbers

The `/media-kit` analytics read [`content/media-kit.ts`](content/media-kit.ts) (daily figures per platform, posts, deliverables). The build checks that file and stops with a list of problems if a date, key or number is wrong, naming each one by its path, for example:

```
Media kit data from the file adapter failed validation (2):
  updated: expected a YYYY-MM-DD date
  platforms.tiktok.days[0].m.veiws: unknown key (known: followers, views, profileViews, likes, comments, shares)
```

How the file is laid out:

| Field | What goes in it |
| --- | --- |
| `updated` | The date the numbers were last brought up to date (`YYYY-MM-DD`). |
| `platforms.<tiktok\|instagram\|youtube>.snapshot` | Figures you only have as one total, e.g. `{ followers: "7k+" }`. Shown as written. |
| `platforms.<id>.days` | One entry per day, oldest first: `{ date, m: { metric: number }, l: { list: { "Row": number } }, hours?: [24 numbers] }`. The metric and list keys each platform accepts are in [`lib/media-kit/platforms.ts`](lib/media-kit/platforms.ts). |
| `platforms.<id>.posts` | What went up, for the chart tooltip: `{ date, time?, title, thumbnail, url, views, engagementRate }`. |
| `all.days` | Only what the platforms can't give alone: views by country (`l.countries`), per-platform view overrides, hourly views. |
| `deliverables` | Brand work, best first: `{ brand, title?, platform?, url?, thumb?, alt?, views? }`. Thumbnails are 9:16 images in `public/media-kit/deliverables/`. |

A metric with no data is left out of the page, never shown as zero. Nothing is copied from one platform to another. To preview the layout with made-up numbers, run `npm run dev` and open `/media-kit?sample`. The page is unlisted: it has `noindex` and isn't in the main nav, so send brands the link directly.

### Live media kit stats

Once it's set up, the media kit fills itself in: every morning the site pulls the latest numbers from TikTok, Instagram and YouTube, stores them in Supabase, and rebuilds `/media-kit`. Nothing is estimated. Each platform shows only what its API actually reports:

| Platform | What refreshes | Notes |
| --- | --- | --- |
| YouTube | Daily views, watch time, likes, comments, shares, impressions and click-through rate, top videos, traffic sources, countries, devices, subscribers, latest 50 uploads | Back-fills the last year on the first refresh (lists: last 4 weeks). |
| Instagram | Daily reach, views, accounts engaged, profile visits, likes, comments, shares, reach by content type, followers, recent posts | Back-fills 30 days. Top posts builds up from the first refresh on. Needs a Business or Creator account. |
| TikTok | Followers, and from the second refresh on, daily views, likes, comments, shares and top videos | TikTok only gives running totals, so each day is the change since the day before. No back-fill. |

Followers and subscribers are recorded on the day of each refresh, so their history starts the day you connect. How it fits together:

- `lib/media-kit/live/` has one connector per platform (`youtube.ts`, `instagram.ts`, `tiktok.ts`) and the refresh itself (`sync.ts`).
- Supabase stores the daily rows, posts, sign-in tokens and post thumbnails. Create them once with [`supabase/media-kit.sql`](supabase/media-kit.sql).
- `/media-kit/connect` (unlocked with `MEDIA_KIT_ADMIN_KEY`) is where you sign in to each platform, see when each last refreshed, and refresh by hand.
- [`.github/workflows/media-kit-refresh.yml`](.github/workflows/media-kit-refresh.yml) calls `POST /api/media-kit/sync` every day at 05:20 UTC.
- The page reads Supabase on top of `content/media-kit.ts`. If Supabase can't be reached or a platform sends something unexpected, the page shows the file's numbers and logs why, so it never goes down. `MEDIA_KIT_SOURCE=file` turns live data off.

These run only in the Node.js build. A static copy (`npm run build:static`) shows whatever was stored when it was built.

### Past deliverables

Deliverables live in [`content/deliverables.json`](content/deliverables.json). Give a brand and a video link and the thumbnail and title are fetched for you and saved in `public/media-kit/deliverables/`:

- **On GitHub:** Actions → "Add a past deliverable" → Run workflow, then fill in the brand and link. (This button appears once the workflow is on `main`.)
- **Or** add `{ "brand": "Flexispot", "url": "https://www.tiktok.com/@byalyxx/video/…" }` to the JSON file and push: the same Action fills in the rest and commits it.
- **Locally:** `node scripts/add-deliverable.mjs --brand "Flexispot" --url "https://…"` (add `--title` or `--views` if you like).

TikTok and YouTube links work with nothing set up. Instagram images come from Meta's oEmbed, which needs `INSTAGRAM_APP_ID` and `INSTAGRAM_APP_SECRET` as GitHub secrets (and the oEmbed Read feature on the Meta app); without them it tries the post's public preview, which Instagram sometimes blocks.

## Home page layout

The home page uses a single-column layout (hero, featured video, products, my gear, contact). The full gear list is also at `/my-gear` (the old `/stack` address redirects there). Colours, type and spacing come from `app/tokens.css`, explained in [`DESIGN.md`](DESIGN.md). Section text lives in `content/site.ts` next to everything else; entries starting with `PLACEHOLDER` are waiting for real content.

## Settings (environment variables)

Copy [`.env.example`](.env.example) to `.env.local`, or set the same names in Hostinger's Node.js app settings. `NEXT_PUBLIC_` values are read when the site builds, so redeploy after changing one.

- **Contact form** (`NEXT_PUBLIC_FORMSPREE_FORM_ID`). The media kit's form sends through [Formspree](https://formspree.io), which emails each enquiry to you. Make a free account with the address you want enquiries at, create a form, and paste its ID (the part after `/f/` in the endpoint). Until it's set, the form opens the visitor's email app with the message filled in instead, so nothing is lost.
- **Visitor analytics** (`NEXT_PUBLIC_PLAUSIBLE_SRC`). [Plausible](https://plausible.io), the analytics tool from the YouTube video: cookieless, so there's no consent banner. Add the site, copy the script link from its install snippet (`https://plausible.io/js/pa-….js`) and paste it here. Older Plausible accounts use `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=byalyxx.com` instead. [Umami Cloud](https://cloud.umami.is) also works (`NEXT_PUBLIC_UMAMI_WEBSITE_ID`) if you'd rather use its free tier.
- **Click tracking.** Every affiliate and partner click is sent as an "Affiliate click" event with the product name as `item`; "Work with me" clicks and sent contact forms are events too. In Plausible, add each as a custom event goal (Site settings → Goals) and `item` as a custom property to see them.
- **Live media kit stats**: `MEDIA_KIT_ADMIN_KEY`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and each platform's app keys. See "Live media kit stats" above and `.env.example`.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serves it on http://localhost:3000 (or $PORT)
```

## Hosting on Hostinger

This is a Node.js app, so it needs a Hostinger plan with Node.js web apps (Business or Cloud).

In hPanel, add a Node.js web app and connect this GitHub repo. Use Node 22 (pinned in `.nvmrc` and `package.json`), build command `npm run build`, start command `npm start`. Every push to `main` redeploys.

On a shared plan without Node.js, run `npm run build:static` and upload the contents of `out/` to `public_html` instead.

Point byalyxx.com at Hostinger only once the new site looks right, since that switch takes the Framer site offline.
