import type { NextConfig } from "next";

// Runs as a Node.js app: `npm run build` then `npm start` (Hostinger Node.js web apps).
// STATIC_EXPORT=1 npm run build still writes a plain static copy to ./out if you ever need one.
const nextConfig: NextConfig = {
  ...(process.env.STATIC_EXPORT ? { output: "export" as const, trailingSlash: true } : {}),
  images: { unoptimized: true },
};

export default nextConfig;
