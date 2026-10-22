import { hero, profile, socials } from "@/content/site";
import { CopyEmail } from "./hero-widgets";

export const buttonClass =
  "inline-flex h-control items-center gap-2 rounded-control border border-site-border bg-site-surface px-4 text-copy font-semibold text-site-fg site-transition hover:border-site-muted focus-visible:outline-2 focus-visible:outline-site-fg";

export function Hero() {
  return (
    <header className="flex flex-col gap-4">
      <HeroHeading />
      <div className="flex flex-wrap gap-3 pt-2">
        <a href={hero.about.href} className={buttonClass}>
          {hero.about.label}
        </a>
        <div className="flex">
          <a href={`mailto:${profile.email}`} className={`${buttonClass} rounded-r-none`}>
            Email
          </a>
          <CopyEmail email={profile.email} className={`${buttonClass} -ml-px rounded-l-none px-3`} />
        </div>
      </div>
    </header>
  );
}

// Name, tagline, follower counts and intro at the top of the home hero.
export function HeroHeading() {
  const [first, ...rest] = hero.headline;

  return (
    <>
      <h1 className="text-display text-site-fg">
        <span className="block text-site-brand">{first}</span>
        {rest.map((line) => (
          <span key={line} className="block text-site-muted">
            {line}
          </span>
        ))}
      </h1>
      <FollowerLine />
      <p className="text-body font-medium text-site-muted">{hero.intro}</p>
    </>
  );
}

// TikTok · Instagram · YouTube follower counts, each linking to the profile. Home hero and media kit header.
export function FollowerLine() {
  return (
    <p className="-mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-copy font-medium tab:text-body text-site-muted">
      {socials.map((s, i) => (
        <span key={s.label} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden>·</span>}
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-site-fg underline decoration-site-border underline-offset-4 site-transition hover:decoration-site-fg"
          >
            {s.label} {s.followers}
          </a>
        </span>
      ))}
    </p>
  );
}
