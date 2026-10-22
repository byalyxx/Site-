import type { NextConfig } from "next";

// Runs as a Node.js app: `npm run build` then `npm start` (Hostinger Node.js web apps).
// STATIC_EXPORT=1 npm run build still writes a plain static copy to ./out if you ever need one
// (redirects don't apply there: a static host has to set them up itself).
//
// Files named *.node.ts / *.node.tsx (the media kit's connect page and API routes) only exist in the Node.js
// build: a static copy has no server to run them.
const nextConfig: NextConfig = {
  pageExtensions: process.env.STATIC_EXPORT ? ["tsx", "ts"] : ["tsx", "ts", "node.tsx", "node.ts"],
  ...(process.env.STATIC_EXPORT
    ? { output: "export" as const, trailingSlash: true }
    : { redirects: async () => [{ source: "/stack", destination: "/my-gear", permanent: true }] }),
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
