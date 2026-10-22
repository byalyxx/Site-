// One highlighted card: the newest YouTube video, opening on YouTube.
export function FeaturedVideo({ id, title }: { id: string; title: string }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-video overflow-hidden border border-site-border bg-site-surface site-transition hover:border-site-muted focus-visible:outline-2 focus-visible:outline-site-fg"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/videos/${id}.jpg`}
        alt={`Thumbnail for the video “${title}”`}
        className="absolute inset-0 size-full object-cover site-transition group-hover:scale-[1.02]"
      />
      {/* Fixed dark scrim so the white caption reads on any thumbnail, in either theme */}
      <span className="absolute inset-0 bg-gradient-to-t from-site-scrim/85 via-site-scrim/30 to-transparent" aria-hidden />
      <span className="absolute left-4 top-4 font-mono text-tag font-medium text-site-on-media text-shadow-sm">[NEW]</span>
      <span className="absolute inset-x-4 bottom-4 flex flex-col gap-1">
        <span className="text-title font-medium text-site-on-media">{title}</span>
        <span className="text-small font-medium text-site-on-media/80">Latest video · YouTube</span>
      </span>
    </a>
  );
}
