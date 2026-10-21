import { SiteNav } from "./site-nav";
import { SiteFooter } from "./site-footer";

// Page frame shared by the home page and /stack: one 448px column, nav on the side (or bottom on phones).
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site min-h-dvh bg-site-bg text-site-fg">
      <SiteNav />
      <main className="mx-auto flex w-full max-w-column flex-col gap-section px-gutter pt-page-top-sm tab:box-content tab:pt-page-top">
        {children}
      </main>
      <div className="mx-auto max-w-column px-gutter tab:box-content">
        <SiteFooter />
      </div>
    </div>
  );
}
