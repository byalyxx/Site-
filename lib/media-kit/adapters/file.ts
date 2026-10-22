import { mediaKitData } from "@/content/media-kit";
import type { MediaKitAdapter } from "./types";

// Active adapter: the numbers in content/media-kit.ts, read when the page builds.
export const fileAdapter: MediaKitAdapter = {
  name: "file",
  load: async () => mediaKitData,
};
