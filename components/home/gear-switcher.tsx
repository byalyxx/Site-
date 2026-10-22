"use client";

import { useId, useState } from "react";
import type { GearGroup } from "@/content/site";
import { bracketClass, tabsClass } from "./controls";
import { RowList } from "./section-block";
import { StackRow } from "./stack-row";

// One list at a time on /stack, with a bracketed tab per group (same tabs as the media kit's platform switcher). Every panel is in the HTML and the others are `hidden`,
// so the page still works as plain HTML (the preview build switches them with a small script of its own).
// `limit` shows only the first few items of each list (home); the tab counts stay the full totals.
export function GearSwitcher({ groups, limit }: { groups: GearGroup[]; limit?: number }) {
  const [active, setActive] = useState(0);
  const uid = useId();
  const id = (i: number, part: string) => `${uid}gear-${part}-${i}`;

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowRight" ? 1 : groups.length - 1)) % groups.length;
    setActive(next);
    document.getElementById(id(next, "tab"))?.focus();
  }

  return (
    <section aria-label="Gear" className="site-reveal flex flex-col gap-4">
      <div role="tablist" aria-label="Gear lists" className={tabsClass} onKeyDown={onKeyDown}>
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
            className={bracketClass}
          >
            <span>
              {g.label} <span className="tabular-nums text-site-muted">{g.items.length}</span>
            </span>
          </button>
        ))}
      </div>
      {groups.map((g, i) => (
        <div key={g.label} role="tabpanel" id={id(i, "panel")} aria-labelledby={id(i, "tab")} data-gear-panel={i} hidden={i !== active}>
          <RowList>
            {g.items.slice(0, limit).map((item) => (
              <StackRow key={item.name} item={item} />
            ))}
          </RowList>
        </div>
      ))}
    </section>
  );
}
