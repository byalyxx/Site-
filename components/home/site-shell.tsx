import { linkClass, SiteFooter } from "./site-footer";
import { cn } from "./cn";

// Page frame shared by every page: one centred 448px column and the footer. No nav: home links out to
// everything and the sub-pages have a back link.
// `forceDark` keeps a page dark whatever the visitor's theme (the media kit has no light values).
export function SiteShell({ children, forceDark }: { children: React.ReactNode; forceDark?: boolean }) {
  return (
    <div className={cn("site min-h-dvh bg-site-bg text-site-fg", forceDark && "site-force-dark")}>
      <main className="mx-auto flex w-full max-w-column flex-col gap-section px-gutter pt-page-top-sm tab:box-content tab:pt-page-top">
        {children}
      </main>
      <div className="mx-auto max-w-column px-gutter tab:box-content">
        <SiteFooter themeToggle={!forceDark} />
      </div>
    </div>
  );
}

// "← Home" at the top of a sub-page. A real link, so it works for someone who arrived from a shared link.
export function BackLink() {
  return (
    <a href="/" className={cn("mb-6 w-fit text-meta font-medium text-site-muted", linkClass)}>
      ← Home
    </a>
  );
}
