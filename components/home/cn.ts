import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Like lib/utils `cn`, but knows the font-size tokens from app/tokens.css,
// so `text-title` and `text-site-fg` aren't treated as two colours and merged away.
const twMerge = extendTailwindMerge({
  extend: { theme: { text: ["display", "title", "body", "copy", "meta", "small", "tag"] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
