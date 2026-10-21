import type { Metadata } from "next";
import { gear, partners, profile } from "@/content/site";
import { SiteShell } from "@/components/home/site-shell";
import { RowList, SectionBlock } from "@/components/home/section-block";
import { PartnerStackRow, StackRow } from "@/components/home/stack-row";

export const metadata: Metadata = {
  title: `Stack | ${profile.name}`,
  description: "Every product on my desk and in my PC, with links to buy them.",
};

export default function StackPage() {
  const total = gear.reduce((n, g) => n + g.items.length, 0);
  const categories = [...gear.map((g) => ({ label: g.label, count: g.items.length })), { label: "Partners", count: partners.length }];

  return (
    <SiteShell>
      <header className="flex flex-col gap-4">
        <h1 className="text-display text-site-fg">Desk &amp; PC Stack</h1>
        <p className="text-body font-medium text-site-muted">
          All {total} things on my desk and inside my PC, plus the brands I work with.
        </p>
        {/* Jump links so a long list stays easy to get around */}
        <nav aria-label="Stack categories" className="flex flex-wrap gap-2 pt-2">
          {categories.map((c) => (
            <a
              key={c.label}
              href={`#${slug(c.label)}`}
              className="inline-flex h-control items-center gap-2 rounded-control border border-site-border bg-site-surface px-3 text-copy font-medium text-site-fg site-transition hover:border-site-muted"
            >
              {c.label} <span className="text-meta tabular-nums text-site-muted">{c.count}</span>
            </a>
          ))}
        </nav>
      </header>

      {gear.map((group) => (
        <SectionBlock key={group.label} id={slug(group.label)} title={group.label}>
          <RowList>
            {group.items.map((item) => (
              <StackRow key={item.name} item={item} />
            ))}
          </RowList>
        </SectionBlock>
      ))}

      <SectionBlock id="partners" title="Partners">
        <RowList>
          {partners.map((p, i) => (
            <PartnerStackRow key={`${p.name}-${i}`} partner={p} />
          ))}
        </RowList>
      </SectionBlock>

      <p className="text-small text-site-muted">
        Some links on this page are affiliate links. If you buy through them I may earn a commission at no extra cost to you.
      </p>
    </SiteShell>
  );
}

function slug(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
