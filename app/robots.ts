import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

export const dynamic = "force-static";

// The media kit and /partners are unlisted: they carry noindex and stay out of the sitemap.
// They are not disallowed here, because a crawler has to be able to fetch a page to see its noindex.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
