import type { GearGroup } from "@/content/site";
import { RowList } from "./section-block";
import { StackRow } from "./stack-row";
import { TabbedSection } from "./tabbed-section";

// Gear lists, one group per tab, with the item count beside each label. Home (with `title`) and /my-gear.
export function GearSwitcher({ groups, title, sectionId }: { groups: GearGroup[]; title?: string; sectionId?: string }) {
  return (
    <TabbedSection
      title={title}
      sectionId={sectionId}
      label="Gear lists"
      tabs={groups.map((g) => ({
        label: g.label,
        count: g.items.length,
        panel: (
          <RowList>
            {g.items.map((item) => (
              <StackRow key={item.name} item={item} />
            ))}
          </RowList>
        ),
      }))}
    />
  );
}
