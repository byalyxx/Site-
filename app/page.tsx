import { Header } from "@/components/header";
import { VideoCard } from "@/components/video-card";
import { GearTabs } from "@/components/gear-tabs";
import { PartnerRow } from "@/components/partner-row";
import { gear, partners, videos } from "@/content/site";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-xl flex-col gap-10 px-4 py-12 sm:py-16">
      <Header />

      <section className="flex flex-col gap-4">
        {videos.map((v, i) => (
          <VideoCard key={v.id} id={v.id} title={i === 0 ? "Latest Video" : v.title} />
        ))}
      </section>

      <GearTabs gear={gear} />

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Partners</h2>
        <div className="flex flex-col gap-2">
          {partners.map((p, i) => (
            <PartnerRow key={`${p.name}-${i}`} partner={p} />
          ))}
        </div>
        <p className="text-xs text-muted">
          Some links on this page are affiliate links. If you buy through them I may earn a commission at no extra cost to you.
        </p>
      </section>

      <footer className="pt-4 text-center text-xs text-muted">© {new Date().getFullYear()} alyxx.com</footer>
    </main>
  );
}
