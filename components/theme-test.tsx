"use client";

import { useEffect } from "react";
import { track } from "./click-tracking";

// Light vs dark A/B test. Each first-time visitor is put in "light" or "dark" (50/50) and keeps it on every
// later visit. Their theme starts in that mode; the toggle still works and their own choice is kept.
// Every analytics event then carries theme_test=light|dark, so Umami can split clicks by group (see README).
// To end the test: delete THEME_TEST_SCRIPT from app/layout.tsx and <ThemeTest /> from analytics.tsx.
export const THEME_TEST_KEY = "theme-test";

// Runs in <head> before next-themes reads localStorage "theme", so the first paint is already in the
// visitor's group. Visitors who picked a theme before the test started are left out ("none").
export const THEME_TEST_SCRIPT = `try{var k="${THEME_TEST_KEY}",s=localStorage;if(!s.getItem(k)){if(s.getItem("theme")){s.setItem(k,"none")}else{var v=Math.random()<0.5?"light":"dark";s.setItem(k,v);s.setItem("theme",v)}}}catch(e){}`;

// "light" or "dark" for visitors in the test, otherwise null.
export function themeTestGroup(): string | null {
  try {
    const v = localStorage.getItem(THEME_TEST_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

// Sends one "Theme test" event per visit, so each group's visit count is known (clicks ÷ visits = conversion
// rate), and saves the group on the Umami session so any report can be filtered by it.
export function ThemeTest() {
  useEffect(() => {
    const group = themeTestGroup();
    if (!group) return;
    try {
      if (sessionStorage.getItem(THEME_TEST_KEY)) return;
    } catch {
      return;
    }
    // The analytics scripts load after the page, so wait for one to be ready (up to 15s)
    let tries = 0;
    const timer = setInterval(() => {
      if (!window.umami && !window.plausible && ++tries < 30) return;
      clearInterval(timer);
      if (!window.umami && !window.plausible) return;
      try {
        window.umami?.identify?.({ theme_test: group });
        sessionStorage.setItem(THEME_TEST_KEY, "1");
      } catch {
        // analytics must never break the page
      }
      track("Theme test");
    }, 500);
    return () => clearInterval(timer);
  }, []);
  return null;
}
