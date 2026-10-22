import { ArrowUpRight } from "lucide-react";
import type { Cta, Product } from "@/content/site";
import { cn } from "./cn";
import { bracketClass } from "./controls";

// One product in the home Products section: the page's offer, so it gets more space than a list row (title stays row size).
// No fill, border or radius: the hairlines above and below match every other list. CTAs come from the product's data;
// -mb-3.5 lets the 44px tap target overlap the bottom padding so the space under the label matches the space above the title.
export function ProductEntry({ product }: { product: Product }) {
  const ctas = [product.cta, product.secondaryCta].filter((c): c is Cta => !!c);

  return (
    <li className="flex flex-col gap-2 border-b border-site-line py-8">
      <h3 className={cn("text-title font-medium text-site-fg", product.placeholder && "italic text-site-muted")}>{product.title}</h3>
      <p className="text-body text-site-muted">{product.type ? `${product.type} · ${product.description}` : product.description}</p>
      {ctas.length > 0 && (
        <div className="-mb-3.5 mt-2 flex flex-wrap items-center gap-x-6">
          {ctas.map((c) => (
            <CtaLink key={c.href} cta={c} />
          ))}
        </div>
      )}
    </li>
  );
}

// External destinations open in a new tab and carry the ↗ used on every other outbound link.
function CtaLink({ cta }: { cta: Cta }) {
  const external = /^https?:\/\//.test(cta.href);

  return (
    <a href={cta.href} className={bracketClass} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      <span className="inline-flex items-center gap-0.5">
        {cta.label}
        {external && <ArrowUpRight className="size-3.5" aria-hidden />}
      </span>
    </a>
  );
}
