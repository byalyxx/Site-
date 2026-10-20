"use client";

import { useState } from "react";
import type { GearItem } from "@/content/site";
import { ArrowIcon } from "./icons";

const tabs = [
  { key: "pcSpecs", label: "PC specs" },
  { key: "peripherals", label: "Peripherals" },
] as const;

export function GearTabs({ gear }: { gear: { pcSpecs: GearItem[]; peripherals: GearItem[] } }) {
  const [active, setActive] = useState<(typeof tabs)[number]["key"]>("pcSpecs");

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">My gear</h2>
      <div role="tablist" className="flex gap-1 rounded-full bg-card p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            data-tab={t.key}
            aria-selected={active === t.key}
            onClick={() => setActive(t.key)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active === t.key ? "bg-bg shadow-sm" : "text-muted hover:text-fg"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* Both lists are in the HTML so search engines see all gear; the inactive one is hidden */}
      {tabs.map((t) => (
        <ul
          key={t.key}
          role="tabpanel"
          data-tab={t.key}
          hidden={active !== t.key}
          className="divide-y divide-border rounded-2xl border border-border"
        >
          {gear[t.key].map((item) => (
            <li key={item.type} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <p className="text-xs text-muted">{item.type}</p>
                <p className="truncate font-medium">{item.name}</p>
              </div>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="flex shrink-0 items-center gap-1 rounded-full bg-card px-3 py-1.5 text-xs font-medium hover:bg-card-hover"
                >
                  Open <ArrowIcon className="size-3" />
                </a>
              )}
            </li>
          ))}
        </ul>
      ))}
    </section>
  );
}
