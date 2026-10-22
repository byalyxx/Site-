"use client";

import { useState } from "react";
import type { GearGroup } from "@/content/site";
import { cn } from "./cn";
import { itemActiveClass, itemClass, navClass } from "./controls";
import { RowList } from "./section-block";
import { StackRow } from "./stack-row";

// Same pill tabs as the media kit's platform switcher.
const groupClass = cn(navClass, "h-control gap-0.5 rounded-control p-0.5");
const tabClass = cn(itemClass, "inline-flex h-full w-auto gap-1.5 whitespace-nowrap rounded-tile px-2.5 text-small font-medium");

// One list at a time on /stack, with a tab per group. Every panel is in the HTML and the others are `hidden`,
// so the page still works as plain HTML (the preview build switches them with a small script of its own).
export function GearSwitcher({ groups }: { groups: GearGroup[] }) {
  const [active, setActive] = useState(0);
  const id = (i: number, part: string) => `gear-${part}-${i}`;

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowRight" ? 1 : groups.length - 1)) % groups.length;
    setActive(next);
    document.getElementById(id(next, "tab"))?.focus();
  }

  return (
    <section aria-label="Gear" className="site-reveal flex flex-col gap-4">
      <div role="tablist" aria-label="Gear lists" className={groupClass} onKeyDown={onKeyDown}>
        {groups.map((g, i) => (
          <button
            key={g.label}
            type="button"
            role="tab"
            id={id(i, "tab")}
            aria-selected={i === active}
            aria-controls={id(i, "panel")}
            tabIndex={i === active ? 0 : -1}
            data-gear-tab={i}
            onClick={() => setActive(i)}
            className={cn(tabClass, i === active && itemActiveClass)}
          >
            {g.label}
            <span className="tabular-nums text-site-muted">{g.items.length}</span>
          </button>
        ))}
      </div>
      {groups.map((g, i) => (
        <div key={g.label} role="tabpanel" id={id(i, "panel")} aria-labelledby={id(i, "tab")} data-gear-panel={i} hidden={i !== active}>
          <RowList>
            {g.items.map((item) => (
              <StackRow key={item.name} item={item} />
            ))}
          </RowList>
        </div>
      ))}
    </section>
  );
}
