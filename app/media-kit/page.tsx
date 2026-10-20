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

      <header className="flex flex-col items-center gap-4 pt-6 text-center">
        <Avatar className="size-20 border">
          <AvatarImage src={profile.avatar} alt={profile.name} className="object-cover" />
          <AvatarFallback className="text-xl font-semibold">{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Media kit</p>
          <h1 className="text-2xl font-semibold tracking-tight">{profile.name}</h1>
          <p className="text-sm text-muted-foreground">{profile.tagline}</p>
        </div>
        <Button asChild className="rounded-full">
          <a href={`mailto:${profile.email}`}>
            <Mail /> Work with me
          </a>
        </Button>
      </header>

      <Separator />

      <Section title="Audience">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          <Card className="col-span-3 gap-1 px-4 py-4 sm:col-span-1">
            <p className="text-xs text-muted-foreground">Total followers</p>
            <p className="text-2xl font-semibold tabular-nums">{mediaKit.totalFollowers}</p>
          </Card>
          {mediaKit.platforms.map((p) => (
            <a key={p.label} href={p.url} target="_blank" rel="noopener noreferrer" className="group rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
              <Card className="h-full gap-1 px-4 py-4 transition-colors group-hover:bg-accent">
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <SocialIcon name={p.icon} className="size-3.5" /> {p.label}
                </p>
                <p className="text-2xl font-semibold tabular-nums">{p.followers}</p>
              </Card>
            </a>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Stats last updated {mediaKit.statsUpdated}.</p>
      </Section>

      <Section title="What I offer">
        <div className="grid gap-2 sm:grid-cols-2">
          {mediaKit.services.map((s) => {
            const Icon = serviceIcons[s.icon as keyof typeof serviceIcons];
            return (
              <Card key={s.title} className="flex-row items-start gap-3 px-4 py-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg border bg-muted text-muted-foreground">
                  <Icon className="size-4" aria-hidden />
                </span>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">{s.title}</p>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section title="Recent partners & products">
        <div className="flex flex-col gap-2">
          {partners.map((p, i) => (
            <PartnerRow key={`${p.name}-${i}`} partner={p} />
          ))}
        </div>
      </Section>

      {latest && (
        <Section title="My latest YouTube video">
          <VideoCard id={latest.id} title={latest.title} />
        </Section>
      )}

      <Card className="items-center gap-3 px-6 py-8 text-center">
        <h2 className="text-lg font-semibold tracking-tight">Let&apos;s make something!</h2>
        <p className="text-sm text-muted-foreground">Email me with your product and timeline and I&apos;ll get back to you.</p>
        <Button asChild className="rounded-full">
          <a href={`mailto:${profile.email}`}>
            <Mail /> Get in touch
          </a>
        </Button>
        <p className="text-xs text-muted-foreground">{profile.email}</p>
      </Card>

      <footer className="pt-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} byalyxx.com</footer>
    </main>
  );
}
