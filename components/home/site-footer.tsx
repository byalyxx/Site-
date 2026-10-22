import { profile, socials } from "@/content/site";
import { ThemeToggle } from "./hero-widgets";

// Text link look shared by the footer and the back links: muted, hairline underline, both darken on hover.
export const linkClass =
  "underline decoration-site-border underline-offset-4 site-transition hover:text-site-fg hover:decoration-site-fg";

// `themeToggle` is off on pages that are always dark (/media-kit), where it would do nothing.
export function SiteFooter({ themeToggle = true }: { themeToggle?: boolean }) {
  const links = [...socials.map((s) => ({ label: `${s.label} ${s.followers}`, href: s.url })), { label: "Email", href: `mailto:${profile.email}` }];

  return (
    <footer className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 pb-16 pt-section text-small text-site-muted">
      {links.map((l, i) => (
        <span key={l.label} className="flex items-center gap-3">
          {i > 0 && <span aria-hidden>·</span>}
          <a href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={linkClass}>
            {l.label}
          </a>
        </span>
      ))}
      <span className="flex w-full items-center justify-center gap-3 pt-2">
        {profile.totalFollowers} followers in total · © {new Date().getFullYear()} byalyxx.com
        {themeToggle && <ThemeToggle />}
      </span>
    </footer>
  );
}
