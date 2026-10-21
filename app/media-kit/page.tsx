import type { Metadata } from "next";
import { BadgeCheck, Camera, Clapperboard, ImageIcon, Smartphone } from "lucide-react";
import { deliverables, hero, mediaKit, mediaKitAnalytics, partners, profile, videos } from "@/content/site";
import { SiteShell } from "@/components/home/site-shell";
import { buttonClass } from "@/components/home/hero";
import { CopyEmail, LocalTime } from "@/components/home/hero-widgets";
import { FeaturedVideo } from "@/components/home/featured-video";
import { Row, RowList, SectionBlock, Tile } from "@/components/home/section-block";
import { PartnerStackRow } from "@/components/home/stack-row";
import { ContactForm } from "@/components/home/forms";
import { Breakdown, ExampleTag, StatRow, TrendChart } from "@/components/home/analytics";
import { SocialIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: `Media kit | ${profile.name}`,
  description: `Audience stats, services and recent partners for ${profile.name}. Get in touch to work together.`,
};

const serviceIcons = { short: Smartphone, long: Clapperboard, photo: Camera, rights: BadgeCheck };

export default function MediaKit() {
  const [latest] = videos;
  const ig = mediaKitAnalytics;

  return (
    <SiteShell>
      <header className="flex flex-col gap-4">
        <h1 className="text-display text-site-fg">
          <span className="block">Media kit.</span>
          <span className="text-site-muted">Tech &amp; setup creator from </span>
          <span className="inline-flex items-start gap-0.5 rounded-control border border-site-border bg-site-surface py-0.5 pl-1.5 pr-2 align-middle">
            {hero.place}
            <LocalTime timeZone={hero.timeZone} />
          </span>
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

      <SectionBlock id="audience" title="Audience" footnote={`Follower counts last updated ${mediaKit.statsUpdated}.`}>
        <RowList>
          {mediaKit.platforms.map((p) => (
            <Row
              key={p.label}
              href={p.url}
              external
              leading={
                <Tile>
                  <SocialIcon name={p.icon} className="size-5" />
                </Tile>
              }
              title={`@${profile.name}`}
              label={p.label}
              trailing={<span className="text-title font-semibold tabular-nums text-site-fg">{p.followers}</span>}
            />
          ))}
        </RowList>
      </SectionBlock>

      <SectionBlock id="analytics" title="Analytics">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-copy font-medium text-site-fg">
            <SocialIcon name="instagram" className="size-4" />
            {ig.platform}
            {ig.example && <ExampleTag />}
          </span>
          <span className="rounded-control border border-site-border bg-site-surface px-3 py-1.5 text-meta font-medium text-site-fg">{ig.period}</span>
        </div>
        <StatRow stats={ig.stats} />
        <TrendChart current={ig.trend.current} previous={ig.trend.previous} pointLabel="Day" />
        <Breakdown title="Audience" unit="Share of views" rows={ig.audience} example={ig.example} />
        <Breakdown title="Geography" unit="Countries" rows={ig.geography} example={ig.example} />
        <Breakdown title="Devices" unit="Type" rows={ig.devices} example={ig.example} />
      </SectionBlock>

      <SectionBlock id="sponsors" title="Recent sponsors">
        <RowList>
          {partners.map((p, i) => (
            <PartnerStackRow key={`${p.name}-${i}`} partner={p} />
          ))}
        </RowList>
      </SectionBlock>

      <SectionBlock id="deliverables" title="Sponsored videos & deliverables">
        <RowList>
          {deliverables.map((d, i) => (
            <Row
              key={i}
              href={d.href}
              external
              placeholder={d.placeholder}
              leading={
                <Tile>
                  {d.thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={d.thumb} alt={`Still from ${d.title}`} className="size-full object-cover" />
                  ) : (
                    <ImageIcon className="size-5" aria-hidden />
                  )}
                </Tile>
              }
              title={d.title}
              label={`${d.brand} · ${d.format}`}
            />
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

      {latest && (
        <SectionBlock id="latest" title="Latest video">
          <FeaturedVideo id={latest.id} title={latest.title} />
        </SectionBlock>
      )}

      <SectionBlock id="contact" title="Let’s make something">
        <p className="text-copy text-site-muted">
          Send your product and timeline to <span className="font-medium text-site-fg">{profile.email}</span>, or use the form.
        </p>
        <ContactForm email={profile.email} />
      </SectionBlock>
    </SiteShell>
  );
}

