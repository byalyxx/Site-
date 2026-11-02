import { ArrowUpRight } from "lucide-react";
import type { Cta, Product } from "@/content/site";
import { cn } from "./cn";
import { linkClass } from "./controls";

// One product in the home Products section: the page's offer, so it gets more space than a list row (title stays row size).
// No fill, border or radius: the hairlines above and below match every other list. CTAs come from the product's data.
export function ProductEntry({ product }: { product: Product }) {
  const ctas = [product.cta, product.secondaryCta].filter((c): c is Cta => !!c);

  const body = (
    <>
      <h3 className={cn("text-title font-medium text-site-fg", product.placeholder && "italic text-site-muted")}>{product.title}</h3>
      <p className="text-body text-site-muted">{product.type ? `${product.type} · ${product.description}` : product.description}</p>
      {ctas.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-x-6">
          {ctas.map((c) => (
            <CtaLink key={c.href} cta={c} />
          ))}
        </div>
      )}
    </>
  );

  if (!product.image) {
    return <li className="flex flex-col gap-2 border-b border-site-line py-8">{body}</li>;
  }

  // With a preview: the image sits left of the text and links to the same place as the main CTA.
  return (
    <li className="flex items-center gap-5 border-b border-site-line py-8 sm:gap-6">
      <a
        href={product.cta?.href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden
        className="shrink-0 overflow-hidden rounded-lg"
      >
        <img src={product.image} alt="" width={112} height={112} loading="lazy" decoding="async" className="size-24 object-cover sm:size-28" />
      </a>
      <div className="flex min-w-0 flex-col gap-2">{body}</div>
    </li>
  );
}

// External destinations open in a new tab and carry the ↗ used on every other outbound link.
function CtaLink({ cta }: { cta: Cta }) {
  const external = /^https?:\/\//.test(cta.href);

  return (
    <a
      href={cta.href}
      className={cn(linkClass, "inline-flex items-center gap-0.5 text-body font-medium text-site-fg")}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {cta.label}
      {external && <ArrowUpRight className="size-3.5" aria-hidden />}
    </a>
  );
}
