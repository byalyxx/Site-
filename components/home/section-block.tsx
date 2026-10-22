import { ChevronRight } from "lucide-react";
import { cn } from "./cn";
import { linkClass } from "./controls";

type ViewAll = { href: string } | { placeholder: true };

export function SectionBlock({
  id,
  title,
  viewAll,
  footnote,
  children,
  className,
}: {
  id?: string;
  title: string;
  viewAll?: ViewAll;
  footnote?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={id && `${id}-title`} className={cn("site-reveal flex scroll-mt-8 flex-col gap-4", className)}>
      <h2 id={id && `${id}-title`} className="text-title font-semibold text-site-fg">
        {title}
      </h2>
      {children}
      {viewAll && "href" in viewAll && (
        <a
          href={viewAll.href}
          className={cn(linkClass, "mt-2 inline-flex w-fit items-center gap-0.5 text-small font-medium text-site-muted")}
        >
          View All <ChevronRight className="size-3" aria-hidden />
        </a>
      )}
      {viewAll && "placeholder" in viewAll && (
        <span className="inline-flex w-fit items-center gap-0.5 pt-2 text-small font-medium text-site-muted" aria-disabled>
          View All (page not built yet) <ChevronRight className="size-3" aria-hidden />
        </span>
      )}
      {footnote && <p className="text-small text-site-muted">{footnote}</p>}
    </section>
  );
}

// Rows sit between hairlines. On hover the row tints, spilling 10px past the column so the text keeps its inset.
export function RowList({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-col border-t border-site-line">{children}</ul>;
}

export function Row({
  href,
  sponsored,
  external,
  leading,
  title,
  meta,
  label,
  trailing,
  placeholder,
}: {
  href?: string;
  sponsored?: boolean;
  external?: boolean;
  leading?: React.ReactNode;
  title: string;
  meta?: string; // metadata (a category, a product): muted, small
  label?: string; // prose (a description): the site face
  trailing?: React.ReactNode;
  placeholder?: boolean;
}) {
  const body = (
    <>
      {leading}
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className={cn("text-title font-medium text-site-fg", placeholder && "italic text-site-muted")}>{title}</span>
        {meta && <span className="text-small text-site-muted">{meta}</span>}
        {label && <span className="text-meta text-site-muted">{label}</span>}
      </span>
      {trailing}
    </>
  );
  // No fill, border or radius: the hairlines carry the list. min-h-11 keeps every row a 44px tap target.
  const rowClass = "-mx-2.5 flex min-h-11 items-center gap-4 px-2.5 py-row";

  return (
    <li className="border-b border-site-line">
      {href ? (
        <a
          href={href}
          {...(external || sponsored ? { target: "_blank", rel: sponsored ? "sponsored noopener noreferrer" : "noopener noreferrer" } : {})}
          className={cn(rowClass, "group site-transition hover:bg-site-surface active:bg-site-surface active:duration-0 focus-visible:outline-2 focus-visible:outline-site-fg")}
        >
          {body}
        </a>
      ) : (
        <div className={rowClass}>{body}</div>
      )}
    </li>
  );
}
