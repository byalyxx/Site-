"use client";

import { useId, useState } from "react";
import { cn } from "./cn";
import { bracketClass, tabsClass } from "./controls";

export type Tab = { label: string; count?: number; panel: React.ReactNode };

// One panel at a time, with a bracketed tab per panel (same tabs as the media kit's platform switcher). Every panel is in the HTML and the others are `hidden`,
// so the page still works as plain HTML (the preview build switches them with a small script of its own).
// With `title`, the heading sits on the left of the tabs, on one line.
export function TabbedSection({
  tabs,
  title,
  sectionId,
  label,
  initial = 0,
}: {
  tabs: Tab[];
  title?: string;
  sectionId?: string;
  label: string;
  initial?: number;
}) {
  const [active, setActive] = useState(initial);
  const uid = useId();
  const id = (i: number, part: string) => `${uid}tab-${part}-${i}`;

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
    setActive(next);
    document.getElementById(id(next, "tab"))?.focus();
  }

  return (
    <section
      id={sectionId}
      aria-label={title ? undefined : label}
      aria-labelledby={title ? id(0, "title") : undefined}
      className="flex scroll-mt-8 flex-col gap-4"
    >
      <div className={cn("flex flex-wrap items-center gap-x-4", title && "justify-between")}>
        {title && (
          <h2 id={id(0, "title")} className="text-title font-semibold text-site-fg">
            {title}
          </h2>
        )}
        <div role="tablist" aria-label={label} className={tabsClass} onKeyDown={onKeyDown}>
          {tabs.map((t, i) => (
            <button
              key={t.label}
              type="button"
              role="tab"
              id={id(i, "tab")}
              aria-selected={i === active}
              aria-controls={id(i, "panel")}
              tabIndex={i === active ? 0 : -1}
              data-tab={i}
              onClick={() => setActive(i)}
              className={bracketClass}
            >
              <span>
                {t.label}
                {t.count !== undefined && <> <span className="tabular-nums text-site-muted">{t.count}</span></>}
              </span>
            </button>
          ))}
        </div>
      </div>
      {tabs.map((t, i) => (
        <div key={t.label} role="tabpanel" id={id(i, "panel")} aria-labelledby={id(i, "tab")} data-tab-panel={i} hidden={i !== active}>
          {t.panel}
        </div>
      ))}
    </section>
  );
}
