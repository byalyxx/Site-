import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import type { PlatformId } from "@/content/media-kit";
import { ADMIN_COOKIE, isAdmin, redirectUri, STATE_COOKIE } from "@/lib/media-kit/live/admin";
import { CONNECTORS, missingEnv } from "@/lib/media-kit/live/sync";

// Step 1 of connecting an account: send you to the platform's sign-in page.
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  const connector = CONNECTORS[platform as PlatformId];
  const jar = await cookies();
  if (!connector) return new Response("Unknown platform", { status: 404 });
  if (!isAdmin(jar.get(ADMIN_COOKIE)?.value)) return new Response("Open /media-kit/connect?key=… first.", { status: 401 });
  const missing = missingEnv(connector);
  if (missing.length) return new Response(`Add these settings first: ${missing.join(", ")}`, { status: 400 });

  const state = `${platform}.${randomBytes(16).toString("hex")}`;
  jar.set(STATE_COOKIE, state, { httpOnly: true, secure: true, sameSite: "lax", path: "/api/media-kit", maxAge: 600 });
  return Response.redirect(connector.authorizeUrl(state, redirectUri(connector.id)), 302);
}
