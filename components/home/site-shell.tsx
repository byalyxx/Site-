import { ArrowLeft } from "lucide-react";
import { linkClass } from "./controls";
import { SiteFooter } from "./site-footer";
import { cn } from "./cn";

// Page frame shared by every page: one centred 448px column and the footer. No nav: home links out to
// everything and the sub-pages have a back link.
// `forceDark` keeps a page dark whatever the visitor's theme (/partners).
export function SiteShell({ children, forceDark, footerToggle = true }: { children: React.ReactNode; forceDark?: boolean; footerToggle?: boolean }) {
  return (
    <div className={cn("site min-h-dvh bg-site-bg text-site-fg", forceDark && "site-force-dark")}>
      <main className="mx-auto flex w-full max-w-column flex-col gap-section px-gutter pt-page-top-sm tab:box-content tab:pt-page-top">
        {children}
      </main>
      <div className="mx-auto max-w-column px-gutter tab:box-content">
        <SiteFooter themeToggle={footerToggle && !forceDark} />
      </div>
    </div>
  );
}

// A sub-page's heading with a Home link on the right, level with it. A real link, so it works for someone who
// arrived from a shared link or a search result.
// `brand` colours the heading like the @byalyxx handle on home.
export function PageTitle({ children, brand }: { children: React.ReactNode; brand?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className={cn("text-display text-site-fg", brand && "text-site-brand")}>{children}</h1>
      <a href="/" className={cn(linkClass, "inline-flex shrink-0 items-center gap-1 text-body font-medium text-site-fg")}>
        <ArrowLeft className="size-3.5" aria-hidden />
        Home
      </a>
    </div>
  );
}
