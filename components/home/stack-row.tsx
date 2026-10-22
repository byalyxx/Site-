import { ArrowUpRight, Package } from "lucide-react";
import type { GearItem, Partner } from "@/content/site";
import { gearIcons } from "@/components/gear-tabs";
import { Row, Tile } from "./section-block";

// Always-visible link chip on the right of each row, so it's clear the row opens a link. The whole row is
// the link, so the chip is only a visual cue.
const arrow = (
  <span
    className="grid size-8 shrink-0 place-items-center rounded-control border border-site-border bg-site-surface text-site-muted site-transition group-hover:border-site-muted group-hover:bg-site-bg group-hover:text-site-fg"
    aria-hidden
  >
    <ArrowUpRight className="size-4" />
  </span>
);

// One product in the desk/PC stack: icon tile, name, category label. Opens the affiliate link exactly as stored.
export function StackRow({ item }: { item: GearItem }) {
  const Icon = gearIcons[item.type] ?? Package;
  return (
    <Row
      href={item.url}
      sponsored
      leading={
        <Tile>
          <Icon className="size-5" aria-hidden />
        </Tile>
      }
      title={item.name}
      label={item.type}
      trailing={item.url ? arrow : undefined}
    />
  );
}

export function PartnerStackRow({ partner }: { partner: Partner }) {
  return (
    <Row
      href={partner.url}
      sponsored
      leading={
        <Tile>
          {partner.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={partner.logo} alt={`${partner.name} logo`} className="size-full object-cover" />
          ) : (
            <span className="text-title font-semibold">{partner.name.charAt(0)}</span>
          )}
        </Tile>
      }
      title={partner.name}
      label={`Partner · ${partner.description}`}
      trailing={arrow}
    />
  );
}
