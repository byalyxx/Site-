import { Eye, Globe, ImageIcon, MessageCircle, ThumbsUp } from "lucide-react";
import { contact, gear, products, stackFeatured, videos } from "@/content/site";
import { SiteShell } from "@/components/home/site-shell";
import { Hero } from "@/components/home/hero";
import { FeaturedVideo } from "@/components/home/featured-video";
import { Row, RowList, SectionBlock, Tile } from "@/components/home/section-block";
import { StackRow } from "@/components/home/stack-row";
import { linkClass } from "@/components/home/controls";

export default function Home() {
  const [latest] = videos;
  const featuredStack = (gear.find((g) => g.label === stackFeatured.group)?.items ?? []).slice(0, stackFeatured.count);

  return (
    <SiteShell>
      <Hero />

      <section id="featured" aria-label="Latest video" className="site-reveal flex scroll-mt-8 flex-col gap-3">
        <FeaturedVideo id={latest.id} title={latest.title} />
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
      </section>

      <SectionBlock id="products" title="Products">
        <RowList>
          {products.map((p, i) => (
            <Row
              key={i}
              href={p.href}
              title={p.title}
              label={p.placeholder ? p.type : p.type ? `${p.type} · ${p.description}` : p.description}
              placeholder={p.placeholder}
              leading={
                <Tile>{p.placeholder ? <ImageIcon className="size-5" aria-hidden /> : <Globe className="size-5" aria-hidden />}</Tile>
              }
            />
          ))}
        </RowList>
      </SectionBlock>

      <SectionBlock id="stack" title="My Gear" viewAll={{ href: "/stack" }}>
        <RowList>
          {featuredStack.map((item) => (
            <StackRow key={item.name} item={item} />
          ))}
        </RowList>
      </SectionBlock>

      <p id="contact" className="text-copy text-site-muted">
        {contact.line} →{" "}
        <a href={contact.link.href} className={`${linkClass} font-medium text-site-fg`}>
          {contact.link.label}
        </a>
      </p>
    </SiteShell>
  );
}
