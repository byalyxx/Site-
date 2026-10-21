# byalyxx.com

The self-hosted version of byalyxx.com, moved off Framer. Built with Next.js, Tailwind and shadcn/ui (components in `components/ui`), running as a Node.js app.

## Edit the content

Everything on the page lives in [`content/site.ts`](content/site.ts): profile, socials, videos, gear and partner (affiliate) links. Anything marked `TODO` is still a placeholder.

- Partner logos and your portrait go in `public/` (e.g. `public/partners/brand.png`, then `logo: "/partners/brand.png"`).
- Affiliate links get `rel="sponsored"` automatically, which is what Google asks for.

## Home page layout

The home page uses a single-column layout (hero, featured video, blog, products, stack, newsletter, contact). The full stack list is at `/stack`. Colours, type and spacing come from `app/tokens.css`, explained in [`DESIGN.md`](DESIGN.md). Section text lives in `content/site.ts` next to everything else; entries starting with `PLACEHOLDER` are waiting for real content.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serves it on http://localhost:3000 (or $PORT)
```

## Hosting on Hostinger

This is a Node.js app, so it needs a Hostinger plan with Node.js web apps (Business or Cloud).

In hPanel, add a Node.js web app and connect this GitHub repo. Use Node 20 or newer, build command `npm run build`, start command `npm start`. Every push to `main` redeploys.

On a shared plan without Node.js, run `npm run build:static` and upload the contents of `out/` to `public_html` instead.

Point byalyxx.com at Hostinger only once the new site looks right, since that switch takes the Framer site offline.
