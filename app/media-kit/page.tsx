import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { mediaKit, partners, profile } from "@/content/site";
import { loadMediaKit } from "@/lib/media-kit/load";
import { PageTitle, SiteShell } from "@/components/home/site-shell";
import { bracketClass, linkClass } from "@/components/home/controls";
import { cn } from "@/components/home/cn";
import { FollowerLine } from "@/components/home/hero";
import { CopyEmail } from "@/components/home/hero-widgets";
import { Row, RowList, SectionBlock } from "@/components/home/section-block";
import { PartnerStackRow } from "@/components/home/stack-row";
import { ContactForm } from "@/components/home/forms";
import { MediaKit } from "@/components/media-kit/media-kit";

const description = `Live audience stats, brand deliverables and partners for ${profile.name}. Get in touch to work together.`;

// Unlisted: the link is sent to brands on purpose, so it stays out of search engines and the main nav.
export const metadata: Metadata = {
  title: `Media kit | ${profile.name}`,
  description,
  robots: { index: false, follow: false },
  alternates: { canonical: "/media-kit" },
  openGraph: {
    title: `${profile.name} · Media kit`,
    description,
    url: "/media-kit",
    images: ["/og.jpg"],
  },
};


export default async function MediaKitPage() {
  // Numbers from the active adapter (content/media-kit.ts), validated before anything renders.
  const data = await loadMediaKit();

  return (
    <SiteShell>
      <header className="flex flex-col gap-4">
        <PageTitle brand>Media kit</PageTitle>
        <FollowerLine />
        <p className="text-body font-medium text-site-muted">{mediaKit.intro}</p>
        <div className="flex flex-wrap items-center gap-x-6">
          <a href={`mailto:${profile.email}`} className={cn(linkClass, "inline-flex items-center gap-0.5 text-body font-medium text-site-fg")}>
            Work with me <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
          <CopyEmail email={profile.email} className={bracketClass} />
        </div>
      </header>

      <SectionBlock id="services" title="What I offer">
        <RowList>
          {mediaKit.services.map((s) => (
            <Row key={s.title} title={s.title} label={s.description} />
          ))}
        </RowList>
      </SectionBlock>

      <MediaKit data={data} />

      <SectionBlock id="partners" title="Partners">
        <RowList>
          {partners.map((p, i) => (
            <PartnerStackRow key={`${p.name}-${i}`} partner={p} />
          ))}
        </RowList>
      </SectionBlock>

      <SectionBlock id="contact" title="Let’s make something">
        <p className="text-copy text-site-muted">
          Send your product and timeline to <span className="font-medium text-site-fg">{profile.email}</span>, or use the form.
        </p>
        <ContactForm email={profile.email} />
      </SectionBlock>
    </SiteShell>
  );
}
