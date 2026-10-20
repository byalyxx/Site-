import { ArrowUpRight } from "lucide-react";
import type { GearGroup } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function GearTabs({ gear }: { gear: GearGroup[] }) {
  return (
    <Tabs defaultValue={gear[0]?.label}>
      <TabsList className="w-full">
        {gear.map((g) => (
          <TabsTrigger key={g.label} value={g.label}>
            {g.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {/* forceMount keeps both lists in the HTML so search engines see all gear */}
      {gear.map((g) => (
        <TabsContent key={g.label} value={g.label} forceMount className="data-[state=inactive]:hidden">
          <Card className="gap-0 py-0">
            <ul className="divide-y">
              {g.items.map((item) => (
                <li key={item.type} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{item.type}</p>
                    <p className="truncate text-sm font-medium">{item.name}</p>
                  </div>
                  {item.url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={item.url} target="_blank" rel="sponsored noopener noreferrer">
                        Open <ArrowUpRight />
                      </a>
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
