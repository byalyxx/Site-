import { gear, profile } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { PageTitle, SiteShell } from "@/components/home/site-shell";
import { GearSwitcher } from "@/components/home/gear-switcher";

export const metadata = pageMetadata({
  title: `My Gear | ${profile.name}`,
  description: "Every product on my desk and inside my PC, from the monitor to the case fans, with links to buy them.",
  path: "/my-gear",
});

export default function MyGearPage() {
  const total = gear.reduce((n, g) => n + g.items.length, 0);

  return (
    <SiteShell>
      <header className="flex flex-col gap-4">
        <PageTitle>My Gear</PageTitle>
        <p className="text-body font-medium text-site-muted">
          All {total} things on my desk and inside my PC.
        </p>
      </header>

      <GearSwitcher groups={gear} />

      <p className="text-small text-site-muted">
        Some links on this page are affiliate links. If you buy through them I may earn a commission at no extra cost to you.
      </p>
    </SiteShell>
  );
}
