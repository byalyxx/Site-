"use client";

import { useId, useState } from "react";
import type { GearGroup } from "@/content/site";
import { cn } from "./cn";
import { bracketClass, tabsClass } from "./controls";
import { RowList } from "./section-block";
import { StackRow } from "./stack-row";

// One list at a time on /stack, with a bracketed tab per group (same tabs as the media kit's platform switcher). Every panel is in the HTML and the others are `hidden`,
// so the page still works as plain HTML (the preview build switches them with a small script of its own).
// With `title` (home), the heading sits on the left of the tabs, on one line.
export function GearSwitcher({ groups, title, sectionId }: { groups: GearGroup[]; title?: string; sectionId?: string }) {
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
    <section
      id={sectionId}
      aria-label={title ? undefined : "Gear"}
      aria-labelledby={title ? id(0, "title") : undefined}
      className="site-reveal flex scroll-mt-8 flex-col gap-4"
    >
      <div className={cn("flex flex-wrap items-center gap-x-4", title && "justify-between")}>
        {title && (
          <h2 id={id(0, "title")} className="text-title font-semibold text-site-fg">
            {title}
          </h2>
        )}
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
