import { ArrowUpRight } from "lucide-react";
import type { Partner } from "@/content/site";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function PartnerRow({ partner }: { partner: Partner }) {
  return (
    <a
      href={partner.url}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className="group rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <Card className="flex-row items-center gap-4 px-4 py-3 transition-colors group-hover:bg-accent">
        <Avatar className="size-11 rounded-lg border">
          {partner.logo && <AvatarImage src={partner.logo} alt="" className="object-contain p-1.5" />}
          <AvatarFallback className="rounded-lg font-semibold">{partner.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold">{partner.name}</p>
            {partner.code && <Badge variant="secondary">Code: {partner.code}</Badge>}
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">{partner.description}</p>
        </div>
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Card>
    </a>
  );
}
