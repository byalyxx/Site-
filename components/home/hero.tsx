import { ArrowUpRight } from "lucide-react";
import { hero, profile } from "@/content/site";
import type { Social } from "@/lib/followers";
import { cn } from "./cn";
import { bracketClass, linkClass } from "./controls";
import { ThemeToggle } from "./hero-widgets";

export function Hero({ socials }: { socials: Social[] }) {
  return (
    <header className="flex flex-col gap-4">
      <HeroHeading socials={socials} />
      <div className="flex flex-wrap items-center gap-x-6">
        <a href={hero.about.href} className={bracketClass}>
          {hero.about.label}
        </a>
        <a href={`mailto:${profile.email}`} data-track="Work with me" className={cn(linkClass, "inline-flex items-center gap-0.5 text-body font-medium text-site-fg")}>
          Email <ArrowUpRight className="size-3.5" aria-hidden />
        </a>
      </div>
    </header>
  );
}

// Name, tagline, follower counts and intro at the top of the home hero.
export function HeroHeading({ socials }: { socials: Social[] }) {
  const [first, ...rest] = hero.headline;

  return (
    <>
      <div className="flex items-center gap-3">
        <h1 className="text-display text-site-fg">
          <span className="block text-site-brand">{first}</span>
          {rest.map((line) => (
            <span key={line} className="block text-site-muted">
              {line}
            </span>
          ))}
        </h1>
        <ThemeToggle className={cn(bracketClass, "-my-1.5")} />
      </div>
      <FollowerLine socials={socials} />
      <p className="text-body font-medium text-site-muted">{hero.intro}</p>
    </>
  );
}

// TikTok · Instagram · YouTube follower counts, each linking to the profile. Home hero and media kit header.
// The counts come from lib/followers.ts (the latest refresh).
export function FollowerLine({ socials }: { socials: Social[] }) {
  return (
    <p className="-mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-copy font-medium tab:text-body text-site-muted">
      {socials.map((s, i) => (
        <span key={s.label} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden>·</span>}
          <a href={s.url} target="_blank" rel="noopener noreferrer" className={cn(linkClass, "text-site-fg")}>
            {s.label} {s.followers}
          </a>
        </span>
      ))}
    </p>
  );
}
