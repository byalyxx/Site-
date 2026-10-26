import { ArrowUpRight } from "lucide-react";
import type { GearItem, Partner } from "@/content/site";
import { cn } from "./cn";
import { linkClass } from "./controls";
import { Row } from "./section-block";

// Bare arrow on the right of each row, so it's clear the row opens a link. Muted, red on row hover, the same
// size as the arrow after Email. On touch, the press shows the same state (instantly, so a quick tap still shows it). The whole row is the link, so the arrow is only a visual cue.
const arrow = (
  <ArrowUpRight
    className="size-3.5 shrink-0 text-site-muted site-transition group-hover:text-site-brand group-active:text-site-brand group-active:duration-0"
    aria-hidden
  />
);

// "Open ↗" on gear rows: the word wears the link underline (red with the arrow on row hover or press). The row
// is the link, so it's a span, hidden from screen readers to keep the row's name to the product.
const open = (
  <span className="flex shrink-0 items-center gap-1" aria-hidden>
    <span
      className={cn(
        linkClass,
        "text-body font-medium text-site-fg group-hover:decoration-site-brand group-active:decoration-site-brand group-active:duration-0",
      )}
    >
      Open
    </span>
    {arrow}
  </span>
);

// One product in the desk/PC stack: photo, name, category beneath. Opens the affiliate link exactly as stored.
// The photo sits where a partner's logo does, a little larger (as tall as the name and category) since it's a
// product shot on white rather than a mark: square, 4px corners, white behind it so it reads the same in dark mode.
export function StackRow({ item }: { item: GearItem }) {
  return (
    <Row
      href={item.url}
      sponsored
      leading={
        item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt="" width={40} height={40} loading="lazy" decoding="async" className="size-10 shrink-0 rounded-[4px] bg-white object-contain" />
        ) : undefined
      }
      title={item.name}
      meta={item.type}
      trailing={item.url ? open : undefined}
    />
  );
}

// A partner: logo (bare, 4px corners), name, the product.
export function PartnerStackRow({ partner }: { partner: Partner }) {
  return (
    <Row
      href={partner.url}
      sponsored
      leading={
        partner.logo ? (
          // The name sits right beside it, so the logo is decorative (empty alt) rather than read out twice.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={partner.logo} alt="" width={24} height={24} loading="lazy" decoding="async" className="size-6 shrink-0 rounded-[4px] object-cover" />
        ) : undefined
      }
      title={partner.name}
      meta={partner.description}
      trailing={arrow}
    />
  );
}
