import { ThemeToggle } from "./hero-widgets";

// Text link look shared across the site: muted, hairline underline, both darken on hover.
export const linkClass =
  "underline decoration-site-border underline-offset-4 site-transition hover:text-site-fg hover:decoration-site-fg";

// `themeToggle` is off on pages that are always dark (/media-kit), where it would do nothing.
export function SiteFooter({ themeToggle = true }: { themeToggle?: boolean }) {
  return (
    <footer className="flex items-center justify-center gap-3 pb-16 pt-section text-small text-site-muted">
      © {new Date().getFullYear()} byalyxx.com
      {themeToggle && <ThemeToggle />}
    </footer>
  );
}
