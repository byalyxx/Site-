import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isAdmin, siteUrl } from "@/lib/media-kit/live/admin";
import { syncAll } from "@/lib/media-kit/live/sync";

// The daily refresh. Called by the GitHub Actions schedule (.github/workflows/media-kit-refresh.yml) with
// `Authorization: Bearer <MEDIA_KIT_ADMIN_KEY>`, or by the "Refresh now" button on /media-kit/connect.
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request) {
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const fromPage = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!isAdmin(bearer) && !isAdmin(fromPage)) return Response.json({ error: "Not allowed" }, { status: 401 });

  const report = await syncAll();
  revalidatePath("/media-kit");

  // The button on the connect page posts a form: send it back there. The schedule gets JSON.
  if (req.headers.get("content-type")?.includes("form")) return Response.redirect(`${siteUrl()}/media-kit/connect?refreshed=1`, 303);
  const failed = report.filter((r) => !r.ok);
  return Response.json({ report }, { status: failed.length && failed.length === report.length ? 502 : 200 });
}
