"use client";

import { useEffect, useRef } from "react";
import type { MediaKitData } from "@/content/media-kit";
import { bracketClass } from "@/components/home/controls";
import { mountMediaKit } from "./renderer.js";
import "./media-kit.css";

// Sample data is a layout preview. It ships only in development, or in a build made with
// NEXT_PUBLIC_MEDIA_KIT_SAMPLE=1; then `?sample` on the URL turns it on.
const SAMPLE_ALLOWED = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_MEDIA_KIT_SAMPLE === "1";

// The markup the renderer fills in, from the standalone kit's index.html. It is written into the page on mount
// (and cleared on unmount), so every visit starts from fresh elements and the renderer's listeners go with them.
const markup = `
  <div class="mk-analytics-block">
    <div class="controls">
      <div class="platform-tabs" id="platform-tabs"></div>
      <button type="button" class="${bracketClass}" id="date-chip" aria-haspopup="dialog">
        <span id="date-label">Last 30 days</span>
      </button>
    </div>
    <section class="analytics" id="analytics" role="tabpanel" aria-live="polite"></section>
  </div>

  <section class="mk-block" aria-labelledby="deliverables-title">
    <h2 class="text-title font-semibold text-site-fg" id="deliverables-title">Past deliverables</h2>
    <div class="scroller" id="deliverables" tabindex="0" role="region" aria-label="Past deliverables, scrolls sideways"></div>
  </section>

  <dialog class="picker" id="picker" aria-labelledby="picker-title">
    <form method="dialog" class="picker-inner">
      <h2 class="sr-only" id="picker-title">Choose a date range</h2>
      <ul class="presets" id="presets"></ul>
      <div class="calendars">
        <div class="cal-nav">
          <button type="button" class="icon-btn" id="cal-prev" aria-label="Previous month">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <button type="button" class="icon-btn" id="cal-next" aria-label="Next month">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
        <div class="months" id="months"></div>
      </div>
      <div class="picker-foot">
        <p class="picker-range" id="picker-range"></p>
        <div class="picker-actions">
          <button type="button" class="${bracketClass}" id="picker-cancel">Cancel</button>
          <button type="button" class="${bracketClass}" id="picker-apply">Apply</button>
        </div>
      </div>
    </form>
  </dialog>`;

export function MediaKit({ data }: { data: MediaKitData }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      let shown = data;
      if (SAMPLE_ALLOWED && new URLSearchParams(location.search).has("sample")) {
        const { makeSampleData } = await import("@/lib/media-kit/sample.js");
        shown = makeSampleData(data);
      }
      if (cancelled) return;
      el.innerHTML = markup;
      mountMediaKit(shown, { signal: controller.signal });
    })();

    return () => {
      cancelled = true;
      controller.abort();
      el.innerHTML = "";
    };
  }, [data]);

  return <div ref={host} className="media-kit" />;
}
