import { hero, profile } from "@/content/site";
import { CopyEmail, LocalTime } from "./hero-widgets";

export const buttonClass =
  "inline-flex h-control items-center gap-2 rounded-control border border-site-border bg-site-surface px-4 text-copy font-semibold text-site-fg site-transition hover:border-site-muted focus-visible:outline-2 focus-visible:outline-site-fg";

export function Hero() {
  const [first, ...rest] = hero.headline;

  return (
    <header className="flex flex-col gap-4">
      <h1 className="text-display text-site-fg">
        <span className="block">{first}</span>
        {rest.map((line) => (
          <span key={line} className="text-site-muted">
            {line}{" "}
          </span>
        ))}
        {/* The small widget: where I am, with the local time there */}
        <span className="inline-flex items-start gap-0.5 rounded-control border border-site-border bg-site-surface py-0.5 pl-1.5 pr-2 align-middle">
          {hero.place}
          <LocalTime timeZone={hero.timeZone} />
        </span>
      </h1>
      <p className="text-body font-medium text-site-muted">{hero.intro}</p>
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
