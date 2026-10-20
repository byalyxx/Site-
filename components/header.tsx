import { FileText, Mail, Play } from "lucide-react";
import { profile, socials } from "@/content/site";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SocialIcon } from "./icons";

export function Header() {
  return (
    <header className="flex flex-col items-center gap-4 text-center">
      <Avatar className="size-24 border">
        <AvatarImage src={profile.avatar} alt={profile.name} className="object-cover" />
        <AvatarFallback className="text-2xl font-semibold">{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{profile.name}</h1>
        <p className="text-sm text-muted-foreground">{profile.tagline}</p>
        <p className="text-xs text-muted-foreground">{profile.totalFollowers} total followers</p>
      </div>
      <nav className="flex flex-wrap justify-center gap-2" aria-label="Social links">
        {socials.map((s) => (
          <Button key={s.label} variant="outline" size="sm" className="rounded-full" asChild>
            <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`${s.label}, ${s.followers} followers`}>
              <SocialIcon name={s.icon} className="size-4" />
              <span className="tabular-nums">{s.followers}</span>
            </a>
          </Button>
        ))}
      </nav>
      <div className="flex flex-wrap justify-center gap-2">
        <Button asChild className="rounded-full">
          <a href={profile.cta.url} target="_blank" rel="noopener noreferrer">
            <Play /> {profile.cta.label}
          </a>
        </Button>
        <Button asChild variant="secondary" className="rounded-full">
          <a href={`mailto:${profile.email}`}>
            <Mail /> Work with me
          </a>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <a href="/media-kit">
            <FileText /> Media kit
          </a>
        </Button>
      </div>
    </header>
  );
}
