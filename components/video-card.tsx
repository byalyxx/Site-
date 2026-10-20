"use client";

import { useState } from "react";

// Shows the thumbnail first and only loads YouTube's player on click (keeps the page light).
export function VideoCard({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-card">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <button onClick={() => setPlaying(true)} data-video-id={id} className="group absolute inset-0" aria-label={`Play ${title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="size-full object-cover"
            />
            <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/70 text-white transition-transform group-hover:scale-110">
              <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 size-7" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
