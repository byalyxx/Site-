import type { Partner } from "@/content/site";
import { ArrowIcon } from "./icons";

export function PartnerRow({ partner }: { partner: Partner }) {
  return (
    <a
      href={partner.url}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className="group flex items-center gap-4 rounded-2xl bg-card p-3 transition-colors hover:bg-card-hover"
    >
      {partner.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={partner.logo} alt="" className="size-12 shrink-0 rounded-xl object-cover" />
      ) : (
        <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-bg text-lg font-bold">
          {partner.name.charAt(0)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{partner.name}</p>
        <p className="line-clamp-2 text-sm text-muted">{partner.description}</p>
        {partner.code && (
          <p className="mt-1 text-xs">
            Code: <span className="font-mono font-semibold">{partner.code}</span>
          </p>
        )}
      </div>
      <ArrowIcon className="size-4 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}
