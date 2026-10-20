# alyxx.com

The self-hosted version of alyxx.com, moved off Framer. Built with Next.js, Tailwind and shadcn/ui (components in `components/ui`), exported as a plain static site.

## Edit the content

Everything on the page lives in [`content/site.ts`](content/site.ts): profile, socials, videos, gear and partner (affiliate) links. Anything marked `TODO` is still a placeholder.

- Partner logos and your portrait go in `public/` (e.g. `public/partners/brand.png`, then `logo: "/partners/brand.png"`).
- Affiliate links get `rel="sponsored"` automatically, which is what Google asks for.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # writes the finished site to ./out
```

## Hosting on Hostinger

`npm run build` produces a folder of static files (`out/`), so it runs on any Hostinger plan.

**Option A, Node.js app with GitHub auto-deploy** (Business / Cloud plans): in hPanel, add a Node.js web app, connect this GitHub repo, set the build command to `npm run build` and the output directory to `out`. Every push to `main` redeploys.

**Option B, shared hosting:** run `npm run build` and upload the contents of `out/` to `public_html` with the File Manager or FTP.

Point alyxx.com at Hostinger only once the new site looks right, since that switch takes the Framer site offline.
