import type { Metadata } from "next";
import { gear, profile } from "@/content/site";
import { PageTitle, SiteShell } from "@/components/home/site-shell";
import { GearSwitcher } from "@/components/home/gear-switcher";

export const metadata: Metadata = {
  title: `My Gear | ${profile.name}`,
  description: "Every product on my desk and in my PC, with links to buy them.",
};

export default function StackPage() {
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
