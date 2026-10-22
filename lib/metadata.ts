import type { Metadata } from "next";
import { profile } from "@/content/site";

export const SITE_URL = "https://byalyxx.com";

const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: `${profile.name}: ${profile.tagline}` };

// One page's title, description, canonical URL and share card. The image is app/opengraph-image.tsx
// (and twitter-image.tsx); it's named here because a page's own openGraph block replaces the inherited one.
export function pageMetadata({
  title,
  description,
  path,
  noindex,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: profile.name, locale: "en_GB", title, description, url: path, images: OG_IMAGE },
    twitter: { card: "summary_large_image", title, description, images: "/twitter-image" },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
