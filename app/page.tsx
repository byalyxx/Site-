import { ArrowUpRight, Eye, MessageCircle, ThumbsUp } from "lucide-react";
import { contact, gear, productGroups, profile, videos } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { loadFollowers } from "@/lib/followers";
import { SiteShell } from "@/components/home/site-shell";
import { Hero } from "@/components/home/hero";
import { FeaturedVideo } from "@/components/home/featured-video";
import { RowList } from "@/components/home/section-block";
import { ProductEntry } from "@/components/home/product-entry";
import { GearSwitcher } from "@/components/home/gear-switcher";
import { TabbedSection } from "@/components/home/tabbed-section";
import { cn } from "@/components/home/cn";
import { linkClass } from "@/components/home/controls";

export const metadata = pageMetadata({
  title: `${profile.name} | ${profile.tagline}`,
  description: "Desk and PC setup videos across TikTok, Instagram and YouTube, and every piece of gear I use, with links.",
  path: "/",
});

// Rebuilt at most once an hour, and straight after each refresh, so the follower counts stay current.
export const revalidate = 3600;

export default async function Home() {
  const [latest] = videos;
  const socials = await loadFollowers();

  return (
    <SiteShell footerToggle={false}>
      <Hero socials={socials} />

      <section id="featured" aria-label="Latest video" className="site-reveal flex scroll-mt-8 flex-col gap-3">
        <FeaturedVideo id={latest.id} title={latest.title} />
        <div className="flex items-center justify-between gap-4">
          {latest.stats && (
            <p className="flex items-center gap-2 text-small text-site-muted" aria-label="Video stats">
              <span className="inline-flex items-center gap-1">
                <Eye className="size-3.5" aria-hidden="true" />
                {latest.stats.views}
                <span className="sr-only"> views</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <ThumbsUp className="size-3.5" aria-hidden="true" />
                {latest.stats.likes}
                <span className="sr-only"> likes</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <MessageCircle className="size-3.5" aria-hidden="true" />
                {latest.stats.comments}
                <span className="sr-only"> comments</span>
              </span>
            </p>
          )}
          <a
            href={`https://www.youtube.com/watch?v=${latest.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(linkClass, "ml-auto inline-flex items-center gap-0.5 text-body font-medium text-site-fg")}
          >
            YouTube <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
        </div>
      </section>

      <TabbedSection
        title="Products"
        sectionId="products"
        label="Product groups"
        initial={productGroups.findIndex((g) => g.label === "Creators")}
        tabs={productGroups.map((g) => ({
          label: g.label,
          panel: (
            <RowList>
              {g.items.map((p) => (
                <ProductEntry key={p.title} product={p} />
              ))}
            </RowList>
          ),
        }))}
      />

      <GearSwitcher groups={gear} title="My Gear" sectionId="stack" />

      <p id="contact" className="text-copy text-site-muted">
        {contact.line} →{" "}
        <a href={contact.link.href} className={`${linkClass} font-medium text-site-fg`}>
          {contact.link.label}
        </a>
      </p>
    </SiteShell>
  );
}
