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

`MEDIA_KIT_SOURCE=api` switches to the API adapter in `lib/media-kit/adapters/api.ts`, which is a stub for now (see its TODOs).

## Home page layout

The home page uses a single-column layout (hero, featured video, products, my gear, contact). The full gear list is also at `/my-gear` (the old `/stack` address redirects there). Colours, type and spacing come from `app/tokens.css`, explained in [`DESIGN.md`](DESIGN.md). Section text lives in `content/site.ts` next to everything else; entries starting with `PLACEHOLDER` are waiting for real content.

## Settings (environment variables)

Copy [`.env.example`](.env.example) to `.env.local`, or set the same names in Hostinger's Node.js app settings. `NEXT_PUBLIC_` values are read when the site builds, so redeploy after changing one.

- **Contact form** (`NEXT_PUBLIC_FORMSPREE_FORM_ID`). The media kit's form sends through [Formspree](https://formspree.io), which emails each enquiry to you. Make a free account with the address you want enquiries at, create a form, and paste its ID (the part after `/f/` in the endpoint). Until it's set, the form opens the visitor's email app with the message filled in instead, so nothing is lost.
- **Analytics** (`NEXT_PUBLIC_UMAMI_WEBSITE_ID`). [Umami Cloud](https://cloud.umami.is) counts visits without cookies, so there's no consent banner to add. Add the site there and paste its website ID. Every affiliate and partner click is recorded as an "Affiliate click" event with the product name.
- **Media kit source** (`MEDIA_KIT_SOURCE`): `file` (the default) or `api`, which is a stub for now.

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
