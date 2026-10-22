import { SiteNav } from "./site-nav";
import { SiteFooter } from "./site-footer";
import { cn } from "./cn";

// Page frame shared by every page: one 448px column, nav on the side (or bottom on phones).
// `forceDark` keeps a page dark whatever the visitor's theme (the media kit has no light values).
export function SiteShell({ children, forceDark }: { children: React.ReactNode; forceDark?: boolean }) {
  return (
    <div className={cn("site min-h-dvh bg-site-bg text-site-fg", forceDark && "site-force-dark")}>
      <SiteNav themeToggle={!forceDark} />
      <main className="mx-auto flex w-full max-w-column flex-col gap-section px-gutter pt-page-top-sm tab:box-content tab:pt-page-top">
        {children}
      </main>
      <div className="mx-auto max-w-column px-gutter tab:box-content">
        <SiteFooter />
      </div>
    </div>
  );
}
