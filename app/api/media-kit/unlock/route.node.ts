import { cookies } from "next/headers";
import { ADMIN_COOKIE, isAdmin, siteUrl } from "@/lib/media-kit/live/admin";

// The connect page's key form posts here. A right key sets a cookie for 12 hours.
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const key = String((await req.formData()).get("key") || "");
  if (!isAdmin(key)) return Response.redirect(`${siteUrl()}/media-kit/connect?msg=${encodeURIComponent("That key doesn't match MEDIA_KIT_ADMIN_KEY.")}`, 303);
  (await cookies()).set(ADMIN_COOKIE, key, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 12 * 3600 });
  return Response.redirect(`${siteUrl()}/media-kit/connect`, 303);
}
