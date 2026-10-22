import { createHash, timingSafeEqual } from "node:crypto";
import type { PlatformId } from "@/content/media-kit";
import { SITE_URL } from "@/lib/metadata";

// The connect page and the refresh endpoint are for you only. They're unlocked by MEDIA_KIT_ADMIN_KEY: in the
// URL (?key=…), as a Bearer token (the scheduled refresh), or by the cookie the connect page sets.
export const ADMIN_COOKIE = "mk_admin";
export const STATE_COOKIE = "mk_oauth_state";

const KEY = process.env.MEDIA_KIT_ADMIN_KEY || "";
const digest = (s: string) => createHash("sha256").update(s).digest();

export function isAdmin(given: string | null | undefined): boolean {
  if (!KEY || KEY.length < 16 || !given) return false;
  return timingSafeEqual(digest(given), digest(KEY));
}

export const adminKeySet = () => KEY.length >= 16;

// The address the platforms send you back to after you sign in. It has to match what you registered with
// each platform exactly. SITE_URL overrides it (e.g. while the site is on Hostinger's temporary address).
export const siteUrl = () => (process.env.SITE_URL || SITE_URL).replace(/\/$/, "");
export const redirectUri = (platform: PlatformId) => `${siteUrl()}/api/media-kit/callback/${platform}`;
