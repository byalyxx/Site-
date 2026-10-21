import { FileText, ImageIcon } from "lucide-react";
import { blog, contact, newsletter, products, profile, stack, stackFeatured, videos } from "@/content/site";
import { SiteShell } from "@/components/home/site-shell";
import { Hero } from "@/components/home/hero";
import { FeaturedVideo } from "@/components/home/featured-video";
import { Row, RowList, SectionBlock, Tile } from "@/components/home/section-block";
import { StackRow } from "@/components/home/stack-row";
import { ContactForm, NewsletterForm } from "@/components/home/forms";

export default function Home() {
  const [latest, ...older] = videos;
  const featuredStack = stackFeatured.map((type) => stack.find((item) => item.type === type)).filter((item) => item !== undefined);

  return (
    <SiteShell>
      <Hero />

      <section id="featured" aria-label="Latest video" className="site-reveal flex scroll-mt-8 flex-col gap-3">
        <FeaturedVideo id={latest.id} title={latest.title} />
        {older.map((v) => (
          <a
            key={v.id}
            href={`https://www.youtube.com/watch?v=${v.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit text-small text-site-muted site-transition hover:text-site-fg"
          >
            Previous video: <span className="font-medium">{v.title}</span>
          </a>
        ))}
      </section>

      <SectionBlock id="blog" title="Blog" viewAll={{ placeholder: true }}>
        <RowList>
          {blog.map((post, i) => (
            <Row
              key={i}
              href={post.href}
              title={post.title}
              placeholder={post.placeholder}
              trailing={<span className="shrink-0 text-meta text-site-muted">{post.date}</span>}
            />
          ))}
        </RowList>
      </SectionBlock>

      <SectionBlock id="products" title="Products" viewAll={{ placeholder: true }}>
        <RowList>
          {products.map((p, i) => (
            <Row
              key={i}
              href={p.href}
              title={p.title}
              label={p.placeholder ? p.type : `${p.type} · ${p.description}`}
              placeholder={p.placeholder}
              leading={<Tile>{p.placeholder ? <ImageIcon className="size-5" aria-hidden /> : <FileText className="size-5" aria-hidden />}</Tile>}
            />
          ))}
        </RowList>
      </SectionBlock>

      <SectionBlock
        id="stack"
        title="Stack"
        viewAll={{ href: "/stack" }}
        footnote="Some links here are affiliate links. If you buy through them I may earn a commission at no extra cost to you."
      >
        <RowList>
          {featuredStack.map((item) => (
            <StackRow key={item.name} item={item} />
          ))}
        </RowList>
      </SectionBlock>

      <SectionBlock id="newsletter" title={newsletter.title}>
        <p className="text-copy italic text-site-muted">{newsletter.blurb}</p>
        <NewsletterForm />
      </SectionBlock>

      <SectionBlock id="contact" title="Contact">
        <p className="text-copy text-site-muted">{contact.line}</p>
        <ContactForm email={profile.email} />
      </SectionBlock>
    </SiteShell>
  );
}
