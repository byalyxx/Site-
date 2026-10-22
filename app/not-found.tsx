import { PageTitle, SiteShell } from "@/components/home/site-shell";
import { linkClass } from "@/components/home/controls";
import { cn } from "@/components/home/cn";

export const metadata = { title: "Page not found | byalyxx" };

export default function NotFound() {
  return (
    <SiteShell>
      <header className="flex flex-col gap-4">
        <PageTitle>Page not found</PageTitle>
        <p className="text-body font-medium text-site-muted">That link doesn&rsquo;t go anywhere any more. The gear list and the media kit are still here.</p>
        <div className="flex flex-wrap items-center gap-x-6">
          <a href="/my-gear" className={cn(linkClass, "text-body font-medium text-site-fg")}>
            My Gear
          </a>
          <a href="/media-kit" className={cn(linkClass, "text-body font-medium text-site-fg")}>
            Media kit
          </a>
        </div>
      </header>
    </SiteShell>
  );
}
