// Control primitives for the media kit, built from the site's own components: the class strings are imported,
// not copied, so the platform tabs can't drift from the rest of the site.
// The renderer builds HTML strings, so these return strings too. Props are unchanged from the standalone kit.

import { bracketClass, tabsClass } from "@/components/home/controls";

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Bracketed text tabs, as a tablist. Names only: `it.icon` is ignored so the brackets stay the only mark.
export function PillTabs({ id, label, value, items, controls }) {
  return `<div class="${tabsClass}" role="tablist" aria-label="${esc(label)}"${id ? ` id="${esc(id)}"` : ""}>${items
    .map((it) => {
      const on = it.value === value;
      return `<button type="button" class="${bracketClass}" role="tab" id="${esc(it.id || "")}" data-value="${esc(it.value)}" aria-selected="${on}" tabindex="${on ? 0 : -1}"${controls ? ` aria-controls="${esc(controls)}"` : ""}>${esc(it.label)}</button>`;
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
    const next = { ArrowRight: v[(i + 1) % v.length], ArrowLeft: v[(i + v.length - 1) % v.length], Home: v[0], End: v[v.length - 1] }[
      e.key
    ];
    if (next == null) return;
    e.preventDefault();
    onChange(next, true);
  });
}
export const bindPillTabs = bindTabs;
