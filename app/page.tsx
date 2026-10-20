import { Header } from "@/components/header";
import { VideoCard } from "@/components/video-card";
import { GearTabs } from "@/components/gear-tabs";
import { PartnerRow } from "@/components/partner-row";
import { Separator } from "@/components/ui/separator";
import { gear, partners, videos } from "@/content/site";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}

export default function Home() {
  return (
    <main className="mx-auto flex max-w-xl flex-col gap-8 px-4 py-12 sm:py-16">
      <Header />
      <Separator />

      <Section title="Partners">
        <div className="flex flex-col gap-2">
          {partners.map((p, i) => (
            <PartnerRow key={`${p.name}-${i}`} partner={p} />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Some links on this page are affiliate links. If you buy through them I may earn a commission at no extra cost to you.
        </p>
      </Section>

      <Section title="Latest videos">
        <div className="grid gap-4 sm:grid-cols-2">
          {videos.map((v) => (
            <VideoCard key={v.id} id={v.id} title={v.title} />
          ))}
        </div>
      </Section>

      <Section title="My gear">
        <GearTabs gear={gear} />
      </Section>

      <footer className="pt-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} alyxx.com</footer>
    </main>
  );
}
