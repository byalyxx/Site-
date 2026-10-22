import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Like lib/utils `cn`, but knows the font-size tokens from app/tokens.css,
// so `text-title` and `text-site-fg` aren't treated as two colours and merged away,
// and the radius tokens, so a later `rounded-card` replaces `rounded-pill`.
const twMerge = extendTailwindMerge({
  extend: { theme: { text: ["display", "figure", "title", "body", "copy", "meta", "small", "tag"], radius: ["control", "tile", "card", "pill"] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
