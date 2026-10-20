import { ArrowUpRight } from "lucide-react";
import type { GearItem } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  { key: "pcSpecs", label: "PC specs" },
  { key: "peripherals", label: "Peripherals" },
] as const;

export function GearTabs({ gear }: { gear: { pcSpecs: GearItem[]; peripherals: GearItem[] } }) {
  return (
    <Tabs defaultValue="pcSpecs">
      <TabsList className="w-full">
        {tabs.map((t) => (
          <TabsTrigger key={t.key} value={t.key}>
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {/* forceMount keeps both lists in the HTML so search engines see all gear */}
      {tabs.map((t) => (
        <TabsContent key={t.key} value={t.key} forceMount className="data-[state=inactive]:hidden">
          <Card className="gap-0 py-0">
            <ul className="divide-y">
              {gear[t.key].map((item) => (
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
