import type { Metadata } from "next";
import { partners, profile } from "@/content/site";
import { BackLink, SiteShell } from "@/components/home/site-shell";
import { RowList, SectionBlock } from "@/components/home/section-block";
import { PartnerStackRow } from "@/components/home/stack-row";

// Linked from the media kit, which is unlisted, so this page stays out of search engines too.
export const metadata: Metadata = {
  title: `Previous partners | ${profile.name}`,
  description: `Brands ${profile.name} has partnered with.`,
  robots: { index: false, follow: false },
  alternates: { canonical: "/partners" },
};

export default function PartnersPage() {
  return (
    <SiteShell forceDark>
      <header className="flex flex-col gap-4">
        <BackLink />
        <h1 className="text-display text-site-fg">Previous partners</h1>
        <p className="text-body font-medium text-site-muted">Brands I&rsquo;ve worked with, and the products I made content for.</p>
      </header>

      <SectionBlock id="partners" title="Partners">
        <RowList>
          {partners.map((p, i) => (
            <PartnerStackRow key={`${p.name}-${i}`} partner={p} />
          ))}
        </RowList>
      </SectionBlock>
    </SiteShell>
  );
}
