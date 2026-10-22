import type { MediaKitData } from "@/content/media-kit";

// Where the media kit's numbers come from. Every adapter returns the same shape (content/media-kit.ts),
// and lib/media-kit/load.ts validates it before the page sees it.
export type MediaKitAdapter = {
  name: string;
  load: () => Promise<MediaKitData>;
};
