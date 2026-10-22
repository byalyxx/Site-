import { ArrowUpRight } from "lucide-react";
import type { GearItem, Partner } from "@/content/site";
import { Row } from "./section-block";

// Bare arrow on the right of each row, so it's clear the row opens a link. Muted, red on row hover, the same
// size as the arrow after Email. On touch, the press shows the same state (instantly, so a quick tap still shows it). The whole row is the link, so the arrow is only a visual cue.
const arrow = <ArrowUpRight className="size-3.5 shrink-0 text-site-muted site-transition group-hover:text-site-brand group-active:text-site-brand group-active:duration-0" aria-hidden />;

// One product in the desk/PC stack: name, category in mono. Opens the affiliate link exactly as stored.
export function StackRow({ item }: { item: GearItem }) {
  return <Row href={item.url} sponsored title={item.name} meta={item.type} trailing={item.url ? arrow : undefined} />;
}

// A partner: logo (bare, square), name, the product in mono.
export function PartnerStackRow({ partner }: { partner: Partner }) {
  return (
    <Row
      href={partner.url}
      sponsored
      leading={
        partner.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={partner.logo} alt={`${partner.name} logo`} className="size-6 shrink-0 object-cover" />
        ) : undefined
      }
      title={partner.name}
      meta={partner.description}
      trailing={arrow}
    />
  );
}
