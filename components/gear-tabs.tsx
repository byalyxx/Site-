import {
  ArrowUpRight,
  Box,
  Cable,
  CircuitBoard,
  Cpu,
  Droplet,
  Fan,
  Gpu,
  HardDrive,
  Headphones,
  Keyboard,
  Laptop,
  LaptopMinimal,
  Lightbulb,
  type LucideIcon,
  MemoryStick,
  Mic,
  MicVocal,
  Monitor,
  MonitorUp,
  Mouse,
  Package,
  PanelTop,
  PlugZap,
  RectangleHorizontal,
  Snowflake,
  Speaker,
  Usb,
} from "lucide-react";
import type { GearGroup } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Icon per gear type. Anything not listed falls back to a generic box.
const gearIcons: Record<string, LucideIcon> = {
  MacBook: Laptop,
  Monitor: Monitor,
  "Monitor arm": MonitorUp,
  "Monitor lights": Lightbulb,
  "Laptop stand": LaptopMinimal,
  "USB hub": Usb,
  "DisplayPort cable": Cable,
  "Keyboard cable": Cable,
  "Cable management": Cable,
  Keyboard: Keyboard,
  Mouse: Mouse,
  Mousemat: RectangleHorizontal,
  Mic: Mic,
  "Mic arm": MicVocal,
  Speakers: Speaker,
  Earphones: Headphones,
  Desk: PanelTop,
  GPU: Gpu,
  CPU: Cpu,
  RAM: MemoryStick,
  SSD: HardDrive,
  PSU: PlugZap,
  "CPU cooler": Snowflake,
  "Fan swap": Fan,
  "Thermal paste": Droplet,
  Motherboard: CircuitBoard,
  Case: Box,
  "Case fans": Fan,
};

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
                <li key={item.type} className="flex items-center gap-3 px-4 py-3">
                  <GearIcon type={item.type} />
                  <div className="min-w-0 flex-1">
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

function GearIcon({ type }: { type: string }) {
  const Icon = gearIcons[type] ?? Package;
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-lg border bg-muted text-muted-foreground">
      <Icon className="size-4" aria-hidden />
    </span>
  );
}
