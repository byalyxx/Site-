import { SiteNav } from "./site-nav";
import { SiteFooter } from "./site-footer";
import { cn } from "./cn";

// Page frame shared by every page: one 448px column, nav on the side (or bottom on phones).
// `wide` gives the media kit's 1120px dashboard width, padded clear of the side nav; `forceDark` keeps a page dark
// whatever the visitor's theme (the media kit has no light values).
export function SiteShell({ children, wide, forceDark }: { children: React.ReactNode; wide?: boolean; forceDark?: boolean }) {
  const width = wide ? "w-auto max-w-kit tab:px-nav-clear" : "max-w-column";
  return (
    <div className={cn("site min-h-dvh bg-site-bg text-site-fg", forceDark && "site-force-dark")}>
      <SiteNav themeToggle={!forceDark} />
      <main className={cn("mx-auto flex w-full flex-col gap-section px-gutter pt-page-top-sm tab:box-content tab:pt-page-top", width)}>
        {children}
      </main>
      <div className={cn("mx-auto px-gutter tab:box-content", width)}>
        <SiteFooter />
      </div>
    </div>
  );
}
