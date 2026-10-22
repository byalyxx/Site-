import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { PlatformId } from "@/content/media-kit";
import { ADMIN_COOKIE, isAdmin, redirectUri, siteUrl, STATE_COOKIE } from "@/lib/media-kit/live/admin";
import { CONNECTORS, saveAccount, syncAll } from "@/lib/media-kit/live/sync";

// Step 2: the platform sends you back here with a one-time code. Swap it for a token, save it, and run a
// first refresh for that platform so the media kit fills in straight away.
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(req: Request, { params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  const connector = CONNECTORS[platform as PlatformId];
  const url = new URL(req.url);
  const jar = await cookies();
  const back = (msg: string) => Response.redirect(`${siteUrl()}/media-kit/connect?${new URLSearchParams({ platform, msg })}`, 303);

  if (!connector) return new Response("Unknown platform", { status: 404 });
  if (!isAdmin(jar.get(ADMIN_COOKIE)?.value)) return new Response("Not allowed", { status: 401 });
  const state = url.searchParams.get("state");
  if (!state || state !== jar.get(STATE_COOKIE)?.value) return back("Sign-in expired or came from somewhere else. Try Connect again.");
  jar.delete({ name: STATE_COOKIE, path: "/api/media-kit" });

  const code = url.searchParams.get("code");
  if (!code) return back(url.searchParams.get("error_description") || url.searchParams.get("error") || "Sign-in was cancelled.");

  try {
    const { token, handle } = await connector.exchange(code, redirectUri(connector.id));
    await saveAccount(connector.id, token, handle);
  } catch (e) {
    return back(`Couldn't connect: ${e instanceof Error ? e.message : e}`);
  }
  const [result] = await syncAll(connector.id);
  revalidatePath("/media-kit");
  return back(result?.ok ? `Connected. First refresh: ${result.message}.` : `Connected, but the first refresh failed: ${result?.message}`);
}
