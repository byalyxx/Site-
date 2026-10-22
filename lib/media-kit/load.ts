import type { MediaKitData } from "@/content/media-kit";
import { fileAdapter } from "./adapters/file";
import { liveAdapter } from "./adapters/live";
import type { MediaKitAdapter } from "./adapters/types";
import { supabaseConfigured } from "./live/supabase";
import { assertValidMediaKit } from "./validate";

const adapters: Record<string, MediaKitAdapter> = { file: fileAdapter, live: liveAdapter };

// Live data once Supabase is set up, the file otherwise. MEDIA_KIT_SOURCE=file|live forces one.
// If the live data can't be read or fails the check, the page falls back to the file and logs why, so a
// platform outage never takes the media kit down.
export async function loadMediaKit(source = process.env.MEDIA_KIT_SOURCE || (supabaseConfigured ? "live" : "file")): Promise<MediaKitData> {
  const adapter = adapters[source];
  if (!adapter) throw new Error(`Unknown MEDIA_KIT_SOURCE "${source}" (use ${Object.keys(adapters).join(" or ")})`);
  if (adapter === fileAdapter) return assertValidMediaKit(await adapter.load(), adapter.name);
  try {
    return assertValidMediaKit(await adapter.load(), adapter.name);
  } catch (e) {
    console.error(`Media kit: live data unavailable, showing content/media-kit.ts instead.\n${e}`);
    return assertValidMediaKit(await fileAdapter.load(), fileAdapter.name);
  }
}
