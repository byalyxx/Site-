"use client";

import { Clapperboard, FileText, House, Layers, Moon, Send, Sun, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { nav } from "@/content/site";
import { cn } from "./cn";

const icons: Record<(typeof nav)[number]["icon"], LucideIcon> = {
  home: House,
  video: Clapperboard,
  stack: Layers,
  kit: FileText,
  contact: Send,
};

export const itemClass =
  "group/item relative grid size-control place-items-center rounded-pill text-site-muted site-transition hover:bg-site-bg hover:text-site-fg focus-visible:outline-2 focus-visible:outline-site-fg";

// The pill group around the items, and an item's selected state. The media kit's platform tabs use all three.
export const navClass = "flex w-fit gap-1 rounded-pill border border-site-border bg-site-surface p-1.5 shadow-sm";
export const itemActiveClass = "border border-site-border bg-site-bg text-site-fg";

// The same five links render once: a pill on the left edge from 810px up, a floating bar at the bottom below that.
// Pages that are always dark (/media-kit) leave out the theme toggle, which would do nothing there.
export function SiteNav({ themeToggle = true }: { themeToggle?: boolean }) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <nav
      aria-label="Main"
      className={cn(
        navClass,
        "fixed inset-x-0 bottom-4 z-50 mx-auto tab:inset-x-auto tab:bottom-auto tab:left-3 tab:top-1/2 tab:-translate-y-1/2 tab:flex-col"
      )}
    >
      {nav.map((item) => {
        const Icon = icons[item.icon];
        const active = item.href === pathname || (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <a
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={active ? "page" : undefined}
            className={cn(itemClass, active && itemActiveClass)}
          >
            <Icon className="size-4" aria-hidden />
            <Tooltip>{item.label}</Tooltip>
          </a>
        );
      })}
      {themeToggle && (
        <button
          type="button"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Toggle dark mode"
          className={itemClass}
        >
          <Sun className="size-4 dark:hidden" aria-hidden />
          <Moon className="hidden size-4 dark:block" aria-hidden />
          <Tooltip>Theme</Tooltip>
        </button>
      )}
    </nav>
  );
}

function Tooltip({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-control border border-site-border bg-site-surface px-2 py-1 text-small font-medium text-site-fg opacity-0 site-transition tab:block group-hover/item:opacity-100">
      {children}
    </span>
  );
}
