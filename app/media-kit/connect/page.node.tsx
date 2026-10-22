import { cookies } from "next/headers";
import type { PlatformId } from "@/content/media-kit";
import { pageMetadata } from "@/lib/metadata";
import { ADMIN_COOKIE, adminKeySet, isAdmin, redirectUri } from "@/lib/media-kit/live/admin";
import { supabaseConfigured, selectAll } from "@/lib/media-kit/live/supabase";
import { CONNECTORS, missingEnv, type Account } from "@/lib/media-kit/live/sync";
import { PageTitle, SiteShell } from "@/components/home/site-shell";
import { bracketClass, fieldClass } from "@/components/home/controls";
import { cn } from "@/components/home/cn";
import { Row, RowList, SectionBlock } from "@/components/home/section-block";

// Your page for linking TikTok, Instagram and YouTube to the media kit, and checking the daily refresh.
// Locked by MEDIA_KIT_ADMIN_KEY; never linked from the site and never indexed.
export const dynamic = "force-dynamic";
export const metadata = pageMetadata({ title: "Connect accounts", description: "Media kit account connections.", path: "/media-kit/connect", noindex: true });

const ORDER: PlatformId[] = ["tiktok", "instagram", "youtube"];
const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/London" });

export default async function ConnectPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { msg, platform, refreshed } = await searchParams;
  const unlocked = isAdmin((await cookies()).get(ADMIN_COOKIE)?.value);

  const setup = [
    !adminKeySet() && "MEDIA_KIT_ADMIN_KEY (16 characters or more)",
    !supabaseConfigured && "SUPABASE_URL and SUPABASE_SECRET_KEY",
  ].filter(Boolean) as string[];

  if (!unlocked || setup.length) {
    return (
      <SiteShell>
        <PageTitle>Connect accounts</PageTitle>
        {setup.length > 0 && <p className="text-copy text-site-muted">Add these settings in Hostinger first, then redeploy: {setup.join("; ")}.</p>}
        {msg && <p className="text-copy text-site-fg">{msg}</p>}
        {adminKeySet() && (
          <form method="post" action="/api/media-kit/unlock" className="flex flex-col gap-4">
            <label htmlFor="key" className="sr-only">Admin key</label>
            <input id="key" name="key" type="password" required autoComplete="current-password" placeholder="Admin key" className={cn(fieldClass, "h-field")} />
            <div>
              <button type="submit" className={bracketClass}>Unlock</button>
            </div>
          </form>
        )}
      </SiteShell>
    );
  }

  const accounts = new Map((await selectAll<Account>("media_kit_accounts").catch(() => [] as Account[])).map((a) => [a.platform, a]));

  return (
    <SiteShell>
      <PageTitle>Connect accounts</PageTitle>
      <p className="text-copy text-site-muted">
        Connect each account once. After that the media kit refreshes itself every day, and you can refresh by hand here.
      </p>
      {msg && (
        <p className="text-copy text-site-fg" role="status">
          {platform && CONNECTORS[platform as PlatformId] ? `${CONNECTORS[platform as PlatformId].name}: ` : ""}
          {msg}
        </p>
      )}
      {refreshed && <p className="text-copy text-site-fg" role="status">Refreshed. The results are below.</p>}

      <SectionBlock id="accounts" title="Accounts">
        <RowList>
          {ORDER.map((id) => {
            const c = CONNECTORS[id];
            const a = accounts.get(id);
            const missing = missingEnv(c);
            const status = missing.length
              ? `Needs ${missing.join(", ")}`
              : !a
                ? "Not connected"
                : a.last_error
                  ? `Last refresh failed: ${a.last_error}`
                  : a.last_sync
                    ? `Refreshed ${when(a.last_sync)}`
                    : "Connected, not refreshed yet";
            return (
              <Row
                key={id}
                title={a?.handle ? `${c.name} · ${a.handle}` : c.name}
                label={status}
                trailing={
                  missing.length ? undefined : (
                    <a href={`/api/media-kit/connect/${id}`} className={cn(bracketClass, "shrink-0")}>
                      {a ? "Reconnect" : "Connect"}
                    </a>
                  )
                }
              />
            );
          })}
        </RowList>
        <form method="post" action="/api/media-kit/sync">
          <button type="submit" className={bracketClass} disabled={!accounts.size}>
            Refresh now
          </button>
        </form>
      </SectionBlock>

      <SectionBlock id="redirects" title="Addresses to register">
        <p className="text-copy text-site-muted">Each platform asks for the address it sends you back to. Paste these exactly:</p>
        <RowList>
          {ORDER.map((id) => (
            <Row key={id} title={CONNECTORS[id].name} meta={redirectUri(id)} />
          ))}
        </RowList>
      </SectionBlock>
    </SiteShell>
  );
}
