import type { Metadata } from "next";
import { ArrowLeft, Camera, Clapperboard, Mail, Smartphone, BadgeCheck } from "lucide-react";
import { mediaKit, partners, profile, videos } from "@/content/site";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import { PartnerRow } from "@/components/partner-row";
import { Section } from "@/components/section";
import { SocialIcon } from "@/components/icons";
import { VideoCard } from "@/components/video-card";

export const metadata: Metadata = {
  title: `Media kit | ${profile.name}`,
  description: `Audience stats, services and recent partners for ${profile.name}. Get in touch to work together.`,
};

const serviceIcons = { short: Smartphone, long: Clapperboard, photo: Camera, rights: BadgeCheck };

export default function MediaKit() {
  const latest = videos[0];

  return (
    <main className="relative mx-auto flex max-w-xl flex-col gap-8 px-4 py-12 sm:py-16">
      <div className="absolute inset-x-4 top-4 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="rounded-full">
          <a href="/">
            <ArrowLeft /> Back
          </a>
        </Button>
        <ModeToggle />
      </div>

      <header className="flex flex-col items-center gap-4 text-center">
        <Avatar className="size-24 border">
          <AvatarImage src={profile.avatar} alt={profile.name} className="object-cover" />
          <AvatarFallback className="text-2xl font-semibold">{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{profile.name}</h1>
          <p className="text-sm text-muted-foreground">Media kit · {profile.tagline}</p>
          <p className="text-xs text-muted-foreground">{mediaKit.totalFollowers} total followers</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button asChild className="rounded-full">
            <a href={`mailto:${profile.email}`}>
              <Mail /> Work with me
            </a>
          </Button>
        </div>
      </header>

      <Separator />

      <Section title="Audience">
        <Card className="gap-0 py-0">
          <ul className="divide-y">
            {mediaKit.platforms.map((p) => (
              <li key={p.label}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 outline-none transition-colors hover:bg-accent focus-visible:bg-accent"
                >
                  <IconTile>
                    <SocialIcon name={p.icon} className="size-4" />
                  </IconTile>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">{p.label}</p>
                    <p className="text-sm font-medium">@{profile.name}</p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums">{p.followers}</p>
                </a>
              </li>
            ))}
          </ul>
        </Card>
        <p className="text-xs text-muted-foreground">Stats last updated {mediaKit.statsUpdated}.</p>
      </Section>

      <Section title="What I offer">
        <Card className="gap-0 py-0">
          <ul className="divide-y">
            {mediaKit.services.map((item) => {
              const Icon = serviceIcons[item.icon as keyof typeof serviceIcons];
              return (
                <li key={item.title} className="flex items-center gap-3 px-4 py-3">
                  <IconTile>
                    <Icon className="size-4" aria-hidden />
                  </IconTile>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </Section>

      <Section title="Recent partners">
        <div className="flex flex-col gap-2">
          {partners.map((p, i) => (
            <PartnerRow key={`${p.name}-${i}`} partner={p} />
          ))}
        </div>
      </Section>

      {latest && (
        <Section title="Latest video">
          <VideoCard id={latest.id} title={latest.title} />
        </Section>
      )}

      <Section title="Let's make something">
        <Card className="flex-row items-center gap-3 px-4 py-3">
          <IconTile>
            <Mail className="size-4" aria-hidden />
          </IconTile>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Send your product and timeline</p>
            <p className="truncate text-sm font-medium">{profile.email}</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={`mailto:${profile.email}`}>Get in touch</a>
          </Button>
        </Card>
      </Section>

      <footer className="pt-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} byalyxx.com</footer>
    </main>
  );
}

function IconTile({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-lg border bg-muted text-muted-foreground">{children}</span>
  );
}
