import type { NextConfig } from "next";

// Static export: `npm run build` writes plain HTML/CSS/JS to ./out,
// which Hostinger (or any static host) can serve as-is.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
