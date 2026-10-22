import type { Metadata } from "next";
import { BadgeCheck, Camera, Clapperboard, Smartphone } from "lucide-react";
import { mediaKit, partners, profile } from "@/content/site";
import { loadMediaKit } from "@/lib/media-kit/load";
import { SiteShell } from "@/components/home/site-shell";
import { buttonClass } from "@/components/home/hero";
import { CopyEmail } from "@/components/home/hero-widgets";
import { Row, RowList, SectionBlock, Tile } from "@/components/home/section-block";
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

const serviceIcons = { short: Smartphone, long: Clapperboard, photo: Camera, rights: BadgeCheck };

export default async function MediaKitPage() {
  // Numbers from the active adapter (content/media-kit.ts), validated before anything renders.
  const data = await loadMediaKit();

  return (
    <SiteShell forceDark>
      <header className="flex flex-col gap-4">
        <h1 className="text-display text-site-fg">
          <span className="block">Media kit.</span>
        </h1>
        <p className="text-body font-medium text-site-muted">
          {mediaKit.totalFollowers} followers across TikTok, Instagram and YouTube. {profile.tagline}, making desk and PC setup content as @
          {profile.name}.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <div className="flex">
            <a href={`mailto:${profile.email}`} className={`${buttonClass} rounded-r-none`}>
              Work with me
            </a>
            <CopyEmail email={profile.email} className={`${buttonClass} -ml-px rounded-l-none px-3`} />
          </div>
          <a href="/stack" className={buttonClass}>
            My setup
          </a>
        </div>
      </header>

      <MediaKit data={data} />

      <SectionBlock id="partners" title="Partners">
        <RowList>
          {partners.map((p, i) => (
            <PartnerStackRow key={`${p.name}-${i}`} partner={p} />
          ))}
        </RowList>
      </SectionBlock>

      <SectionBlock id="services" title="What I offer">
        <RowList>
          {mediaKit.services.map((s) => {
            const Icon = serviceIcons[s.icon as keyof typeof serviceIcons];
            return (
              <Row
                key={s.title}
                leading={
                  <Tile>
                    <Icon className="size-5" aria-hidden />
                  </Tile>
                }
                title={s.title}
                label={s.description}
              />
            );
          })}
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
