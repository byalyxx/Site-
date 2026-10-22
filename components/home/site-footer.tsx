import { bracketClass } from "./controls";
import { ThemeToggle } from "./hero-widgets";

// `themeToggle` is off on pages that are always dark (/media-kit), where it would do nothing.
export function SiteFooter({ themeToggle = true }: { themeToggle?: boolean }) {
  return (
    <footer className="flex items-center justify-center gap-3 pb-16 pt-section text-small text-site-muted">
      © {new Date().getFullYear()} byalyxx.com
      {themeToggle && <ThemeToggle className={bracketClass} />}
    </footer>
  );
}
