import { ArrowUpRight, Package } from "lucide-react";
import type { GearItem, Partner } from "@/content/site";
import { gearIcons } from "@/components/gear-tabs";
import { Row, Tile } from "./section-block";

const arrow = (
  <ArrowUpRight className="size-4 shrink-0 text-site-muted opacity-0 site-transition group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden />
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
