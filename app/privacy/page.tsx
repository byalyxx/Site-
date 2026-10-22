import { profile } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { PageTitle, SiteShell } from "@/components/home/site-shell";
import { LegalSection } from "@/components/home/legal";
import { linkClass } from "@/components/home/controls";

// Needed by the TikTok and Meta developer apps behind the live media kit stats.
export const metadata = pageMetadata({
  title: `Privacy policy | ${profile.name}`,
  description: `What ${profile.name}'s website collects and why.`,
  path: "/privacy",
  noindex: true,
});

export default function PrivacyPage() {
  return (
    <SiteShell>
      <header className="flex flex-col gap-4">
        <PageTitle>Privacy policy</PageTitle>
        <p className="text-body font-medium text-site-muted">Last updated 22 October 2026.</p>
      </header>

      <div className="flex flex-col gap-section">
        <LegalSection title="Who runs this site">
          <p>
            This site is run by {profile.name}. Questions about your data go to <a className={linkClass} href={`mailto:${profile.email}`}>{profile.email}</a>.
          </p>
        </LegalSection>

        <LegalSection title="Visitor stats">
          <p>
            Page views and link clicks are counted with Umami, which doesn&rsquo;t use cookies and doesn&rsquo;t store your IP address or
            anything that identifies you. It records things like the page, the referring site, country, browser and device type.
          </p>
        </LegalSection>

        <LegalSection title="Contact form">
          <p>
            If you send a message through the contact form, your name, email and message are delivered to me through Formspree. I only
            use them to reply to you.
          </p>
        </LegalSection>

        <LegalSection title="Affiliate links">
          <p>
            Some links to products are affiliate links. When you follow one, the shop you land on (for example Amazon) may set its own
            cookies under its own privacy policy. I don&rsquo;t receive any of your details from them.
          </p>
        </LegalSection>

        <LegalSection title="Media kit stats">
          <p>
            The media kit shows stats from my own YouTube, Instagram and TikTok accounts. I connect those accounts myself, with read-only
            access, and the site only reads my own profile, follower counts, videos and their view and engagement figures. The access keys
            and the stats are stored on the site&rsquo;s server and are never shared or sold. No data about visitors or other TikTok,
            Instagram or YouTube users is collected this way.
          </p>
          <p>
            YouTube data is used under the{" "}
            <a className={linkClass} href="https://www.youtube.com/t/terms">YouTube Terms of Service</a> and the{" "}
            <a className={linkClass} href="https://policies.google.com/privacy">Google Privacy Policy</a>. Access can be removed at any time
            from each platform&rsquo;s account settings.
          </p>
        </LegalSection>

        <LegalSection title="Your choices">
          <p>You can ask me what I hold about you, or ask me to delete it, by email.</p>
        </LegalSection>
      </div>
    </SiteShell>
  );
}
