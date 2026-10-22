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

// Rows sit between hairlines. On hover the row's background fills, spilling 10px past the column like the reference.
export function RowList({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-col border-t border-site-line">{children}</ul>;
}

export function Row({
  href,
  sponsored,
  external,
  leading,
  title,
  label,
  trailing,
  placeholder,
}: {
  href?: string;
  sponsored?: boolean;
  external?: boolean;
  leading?: React.ReactNode;
  title: string;
  label?: string;
  trailing?: React.ReactNode;
  placeholder?: boolean;
}) {
  const body = (
    <>
      {leading}
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className={cn("text-title font-medium text-site-fg", placeholder && "italic text-site-muted")}>{title}</span>
        {label && <span className="text-meta text-site-muted">{label}</span>}
      </span>
      {trailing}
    </>
  );
  const rowClass = "-mx-2.5 flex items-center gap-4 rounded-card px-2.5 py-row";

  return (
    <li className="border-b border-site-line">
      {href ? (
        <a
          href={href}
          {...(external || sponsored ? { target: "_blank", rel: sponsored ? "sponsored noopener noreferrer" : "noopener noreferrer" } : {})}
          className={cn(rowClass, "group site-transition hover:bg-site-surface focus-visible:outline-2 focus-visible:outline-site-fg")}
        >
          {body}
        </a>
      ) : (
        <div className={rowClass}>{body}</div>
      )}
    </li>
  );
}

export function Tile({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "grid size-tile shrink-0 place-items-center overflow-hidden rounded-tile border border-site-border bg-site-thumb text-site-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
