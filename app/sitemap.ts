import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

export const dynamic = "force-static";

// Public pages only. /media-kit and /partners are unlisted on purpose.
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/my-gear"].map((path) => ({ url: `${SITE_URL}${path}` }));
}
