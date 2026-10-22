import { partners, profile } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { PageTitle, SiteShell } from "@/components/home/site-shell";
import { RowList, SectionBlock } from "@/components/home/section-block";
import { PartnerStackRow } from "@/components/home/stack-row";

// Linked from the media kit, which is unlisted, so this page stays out of search engines too.
export const metadata = pageMetadata({
  title: `Previous partners | ${profile.name}`,
  description: `Brands ${profile.name} has partnered with, and the products made for them.`,
  path: "/partners",
  noindex: true,
});

export default function PartnersPage() {
  return (
    <SiteShell forceDark>
      <header className="flex flex-col gap-4">
        <PageTitle>Previous partners</PageTitle>
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
