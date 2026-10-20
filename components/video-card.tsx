"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Card } from "@/components/ui/card";

// Shows the thumbnail first and only loads YouTube's player on click (keeps the page light).
export function VideoCard({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="relative aspect-video bg-muted">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            data-video-id={id}
            className="group absolute inset-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            aria-label={`Play ${title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/videos/${id}.jpg`} alt="" loading="lazy" className="size-full object-cover" />
            <span className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-foreground shadow-sm transition-transform group-hover:scale-105">
              <Play className="ml-0.5 size-5 fill-current" />
            </span>
          </button>
        )}
      </div>
      <div className="px-4 py-3 text-sm font-medium">{title}</div>
    </Card>
  );
}
