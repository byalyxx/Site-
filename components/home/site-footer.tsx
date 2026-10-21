import { profile, socials } from "@/content/site";

export function SiteFooter() {
  const links = [...socials.map((s) => ({ label: `${s.label} ${s.followers}`, href: s.url })), { label: "Email", href: `mailto:${profile.email}` }];

  return (
    <footer className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 pb-28 pt-section text-small text-site-muted tab:pb-16">
      {links.map((l, i) => (
        <span key={l.label} className="flex items-center gap-3">
          {i > 0 && <span aria-hidden>·</span>}
          <a
            href={l.href}
            {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="underline decoration-site-border underline-offset-4 site-transition hover:text-site-fg hover:decoration-site-fg"
          >
            {l.label}
          </a>
        </span>
      ))}
      <span className="flex w-full justify-center pt-2">{profile.totalFollowers} followers in total · © {new Date().getFullYear()} byalyxx.com</span>
    </footer>
  );
}
