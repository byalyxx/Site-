import { profile } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { PageTitle, SiteShell } from "@/components/home/site-shell";
import { LegalSection } from "@/components/home/legal";
import { linkClass } from "@/components/home/controls";

// Needed by the TikTok and Meta developer apps behind the live media kit stats.
export const metadata = pageMetadata({
  title: `Terms of service | ${profile.name}`,
  description: `The terms for using ${profile.name}'s website.`,
  path: "/terms",
  noindex: true,
});

export default function TermsPage() {
  return (
    <SiteShell>
      <header className="flex flex-col gap-4">
        <PageTitle>Terms of service</PageTitle>
        <p className="text-body font-medium text-site-muted">Last updated 22 October 2026.</p>
      </header>

      <div className="flex flex-col gap-section">
        <LegalSection title="Using this site">
          <p>
            This is the personal website of {profile.name}. By using it you agree to these terms. Everything here is for information only,
            and product recommendations are my own opinion.
          </p>
        </LegalSection>

        <LegalSection title="Affiliate links">
          <p>
            Some product links are affiliate links, so I may earn a commission if you buy through them, at no extra cost to you. Purchases
            are made with the shop, under its own terms.
          </p>
        </LegalSection>

        <LegalSection title="Media kit">
          <p>
            The media kit shows stats from my own social accounts, read through each platform&rsquo;s official tools. Figures are provided
            as they are and may differ slightly from what each app shows.
          </p>
        </LegalSection>

        <LegalSection title="Content">
          <p>The text, images and videos on this site belong to me or their owners. Please don&rsquo;t reuse them without asking.</p>
        </LegalSection>

        <LegalSection title="No warranty">
          <p>
            The site is provided as it is. I&rsquo;m not responsible for anything that happens from using it or the sites it links to.
          </p>
        </LegalSection>

        <LegalSection title="Contact">
          <p>
            Questions about these terms: <a className={linkClass} href={`mailto:${profile.email}`}>{profile.email}</a>.
          </p>
        </LegalSection>
      </div>
    </SiteShell>
  );
}
