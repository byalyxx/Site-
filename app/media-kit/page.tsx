import type { Metadata } from "next";
import { BadgeCheck, Camera, Clapperboard, ImageIcon, Smartphone } from "lucide-react";
import { deliverables, hero, mediaKit, mediaKitAnalytics, mediaKitGrowth, partners, profile, videos } from "@/content/site";
import { SiteShell } from "@/components/home/site-shell";
import { buttonClass } from "@/components/home/hero";
import { CopyEmail, LocalTime } from "@/components/home/hero-widgets";
import { FeaturedVideo } from "@/components/home/featured-video";
import { Row, RowList, SectionBlock, Tile } from "@/components/home/section-block";
import { PartnerStackRow } from "@/components/home/stack-row";
import { ContactForm } from "@/components/home/forms";
import { AudienceRing, ChangeBadge, ExampleTag, GrowthChart, Panel, StatTile } from "@/components/home/analytics";
import { SocialIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: `Media kit | ${profile.name}`,
  description: `Audience stats, services and recent partners for ${profile.name}. Get in touch to work together.`,
};

const serviceIcons = { short: Smartphone, long: Clapperboard, photo: Camera, rights: BadgeCheck };

export default function MediaKit() {
  const [latest] = videos;
  const ig = mediaKitAnalytics;
  const growth = mediaKitGrowth;
  const [topCountry] = ig.topCountries;

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
        <Panel
          title={
            <>
              <SocialIcon name="instagram" className="size-4 text-site-fg" />
              {ig.platform}
            </>
          }
          aside={
            <>
              {ig.example && <ExampleTag />}
              {ig.period}
            </>
          }
        >
          <AudienceRing label="Views" value={ig.views} note={ig.viewsNote} split={ig.split} />
          <div className="grid grid-cols-3 gap-2">
            {ig.stats.slice(0, 3).map((s) => (
              <StatTile key={s.label} {...s} />
            ))}
          </div>
          <div className="-mt-4 grid grid-cols-2 gap-2">
            {ig.stats.slice(3).map((s) => (
              <StatTile key={s.label} {...s} />
            ))}
            {topCountry && <StatTile icon="country" value={topCountry.name} label="Top country" change={topCountry.share} />}
          </div>
          <div className="flex flex-col gap-3 border-t border-site-line pt-4">
            <span className="text-small font-semibold uppercase tracking-wide text-site-muted">Top countries</span>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-copy font-medium text-site-fg">
              {ig.topCountries.map((c) => (
                <li key={c.name}>
                  {c.name} <span className="tabular-nums text-site-muted">{c.share}</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <Panel title={growth.title} aside={growth.example && <ExampleTag />}>
          <div className="-mt-2 flex items-baseline gap-3">
            <span className="text-display tabular-nums text-site-fg">{growth.total}</span>
            <ChangeBadge>{growth.change}</ChangeBadge>
          </div>
          <GrowthChart current={growth.current} previous={growth.previous} xLabels={growth.xLabels} />
        </Panel>
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
