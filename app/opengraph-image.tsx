import { ImageResponse } from "next/og";
import { profile, socials } from "@/content/site";

// The card a link to any page shows when it's pasted into a DM or a post. Built at build time from the site's
// own colours and type (next/og's default face is Geist), so it stays in step with the content.
export const alt = `${profile.name}: ${profile.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

// Hex values mirror the dark theme in app/tokens.css: next/og draws outside the page, so it can't read the tokens.
const BG = "#000000";
const FG = "#fafafa";
const MUTED = "#a3a3a3";
const BRAND = "#aa0412";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: BG }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 120, letterSpacing: "-0.03em", color: BRAND }}>{`@${profile.name}`}</div>
          <div style={{ fontSize: 44, color: FG }}>{profile.tagline}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, color: MUTED }}>
          <div style={{ display: "flex", gap: 36 }}>
            {socials.map((s) => (
              <span key={s.label}>{s.label}</span>
            ))}
          </div>
          <span>byalyxx.com</span>
        </div>
      </div>
    ),
    size,
  );
}
