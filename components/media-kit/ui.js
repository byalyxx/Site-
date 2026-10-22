// Control primitives for the media kit, built from the site's own components: the class strings are imported,
// not copied, so the platform pills, date chip, selects and picker buttons can't drift from the rest of the site.
// The renderer builds HTML strings, so these return strings too. Props are unchanged from the standalone kit.

import { buttonClass } from "@/components/home/hero";
import { itemActiveClass, itemClass, navClass } from "@/components/home/controls";
import { submitClass } from "@/components/home/forms";
import { cn } from "@/components/home/cn";

export { buttonClass, itemClass, submitClass };

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// The nav's group and items with the buttons' corners instead of the nav's pill shape, so the tabs sit with the
// site's buttons and cards. Items are sized by their label, and the group is the date chip's height so the two line up.
const groupClass = cn(navClass, "h-control gap-0.5 rounded-control p-0.5");
const tabClass = cn(itemClass, "inline-flex h-full w-auto gap-1.5 whitespace-nowrap rounded-tile px-2.5 text-small font-medium");

// The SiteNav group holding text items, as a tablist. Props follow the shadcn Tabs used on the site.
export function PillTabs({ id, label, value, items, controls }) {
  return `<div class="${groupClass}" role="tablist" aria-label="${esc(label)}"${id ? ` id="${esc(id)}"` : ""}>${items
    .map((it) => {
      const on = it.value === value;
      return `<button type="button" class="${on ? cn(tabClass, itemActiveClass) : tabClass}" role="tab" id="${esc(it.id || "")}" data-value="${esc(it.value)}" aria-selected="${on}" tabindex="${on ? 0 : -1}"${controls ? ` aria-controls="${esc(controls)}"` : ""}>${it.icon || ""}<span>${esc(it.label)}</span></button>`;
    })
    .join("")}</div>`;
}

// Arrow keys, Home and End move between tabs (the same keys Radix Tabs uses on the site).
export function bindTabs(el, onChange) {
  const values = () => [...el.querySelectorAll("[role=tab]")].map((b) => b.dataset.value);
  el.addEventListener("click", (e) => {
    const b = e.target.closest("[role=tab]");
    if (b) onChange(b.dataset.value, false);
  });
  el.addEventListener("keydown", (e) => {
    const v = values();
    const cur = el.querySelector('[aria-selected="true"]');
    const i = v.indexOf(cur && cur.dataset.value);
    const next = { ArrowRight: v[(i + 1) % v.length], ArrowLeft: v[(i + v.length - 1) % v.length], Home: v[0], End: v[v.length - 1] }[e.key];
    if (next == null) return;
    e.preventDefault();
    onChange(next, true);
  });
}
export const bindPillTabs = bindTabs;
