import type { MediaKitData } from "@/content/media-kit";
import { apiAdapter } from "./adapters/api";
import { fileAdapter } from "./adapters/file";
import type { MediaKitAdapter } from "./adapters/types";
import { assertValidMediaKit } from "./validate";

const adapters: Record<string, MediaKitAdapter> = { file: fileAdapter, api: apiAdapter };

// The file adapter is active. Set MEDIA_KIT_SOURCE=api to switch once the API adapter is built.
export async function loadMediaKit(source = process.env.MEDIA_KIT_SOURCE || "file"): Promise<MediaKitData> {
  const adapter = adapters[source];
  if (!adapter) throw new Error(`Unknown MEDIA_KIT_SOURCE "${source}" (use ${Object.keys(adapters).join(" or ")})`);
  return assertValidMediaKit(await adapter.load(), adapter.name);
}
