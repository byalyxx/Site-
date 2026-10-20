import { profile, socials } from "@/content/site";
import { SocialIcon } from "./icons";

export function Header() {
  return (
    <header className="flex flex-col items-center gap-5 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={profile.avatar}
        alt={profile.name}
        width={96}
        height={96}
        className="size-24 rounded-full border border-border bg-card object-cover"
      />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{profile.name}</h1>
        <p className="mt-1 text-muted">{profile.tagline}</p>
      </div>
      <nav className="flex gap-2" aria-label="Social links">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="grid size-10 place-items-center rounded-full bg-card transition-colors hover:bg-card-hover"
          >
            <SocialIcon name={s.icon} />
          </a>
        ))}
      </nav>
      <a
        href={profile.cta.url}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-fg px-5 py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-85"
      >
        {profile.cta.label}
      </a>
    </header>
  );
}
