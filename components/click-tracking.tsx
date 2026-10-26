"use client";

import { useEffect } from "react";
import { themeTestGroup } from "./theme-test";

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
    umami?: {
      track: (event: string, data?: Record<string, string>) => void;
      identify?: (data: Record<string, string>) => void;
    };
  }
}

// Sends a named event to whichever analytics is loaded. Safe to call when none is.
// Visitors in the light/dark test also send their group as theme_test.
export function track(event: string, props: Record<string, string> = {}) {
  const group = themeTestGroup();
  if (group) props = { ...props, theme_test: group };
  try {
    window.plausible?.(event, { props });
    window.umami?.track(event, props);
  } catch {
    // analytics must never break the page
  }
  // The test's main number: the first affiliate click of each visit, so a visit that clicks 5 links counts once
  if (group && event === "Affiliate click") {
    try {
      if (sessionStorage.getItem("theme-test-clicked")) return;
      sessionStorage.setItem("theme-test-clicked", "1");
    } catch {
      return;
    }
    track("Visit with affiliate click");
  }
}

// One listener for the whole site: a click on an element with data-track="Event name" sends that event,
// with data-track-item as its "item" property (e.g. the product name on an affiliate row).
export function ClickTracking() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.("[data-track]");
      if (!el) return;
      const item = el.getAttribute("data-track-item");
      track(el.getAttribute("data-track")!, item ? { item } : {});
    };
    document.addEventListener("click", onClick, { capture: true });
    // Middle-click opens affiliate links in a new tab without a click event
    document.addEventListener("auxclick", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("auxclick", onClick, { capture: true });
    };
  }, []);
  return null;
}
