import type { MetadataRoute } from "next";
import { profile } from "@/content/site";

export const dynamic = "force-static";

// Lets phones save the site to the home screen with the right name and icon.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: profile.name,
    short_name: profile.name,
    description: `${profile.name}: desk and PC setup videos and gear.`,
    start_url: "/",
    display: "browser",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
