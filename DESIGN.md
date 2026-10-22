# Design system (home page, /stack and /media-kit)

The home page follows the layout and visual language of a reference portfolio template (anticode.framer.website). Nothing from that site is copied here: these notes were written from screenshots taken at 1440, 834 and 390px wide, and the code is our own.

The tokens live in [`app/tokens.css`](app/tokens.css). Every colour, size, gap and radius on the home page, /stack and /media-kit comes from there.

## Colour

Follows the visitor's system setting, and the theme button in the footer switches it. Neutral greys only, no brand accent: the photos and logos bring the colour.

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `site-bg` | #ffffff | #161616 | Page |
| `site-surface` | #fafafa | #1a1a1a | Buttons, inputs, hovered rows |
| `site-border` | #e0e0e0 | #272727 | Outlines on surfaces |
| `site-line` | #f0f0f0 | #222222 | Hairlines between list rows |
| `site-fg` | #0a0a0a | #fafafa | Headings, titles |
| `site-muted` | #6b6b6b | #ababab | Second headline line, intros, labels, dates |
| `site-accent` / `-fg` | #0a0a0a / #fff | #fafafa / #161616 | The one solid button (Submit) |
| `site-on-media`, `site-scrim` | #fff, #000 | same | Caption over the video thumbnail |
| `site-data` | #7c3aed | #a78bfa | The series that matters in a chart (this period) |
| `site-positive` | #15803d | #4ade80 | Growth figures (+10%) |
| `site-brand` | #aa0412 | #aa0412 | The @byalyxx handle in the home hero |

Outside the greys, red appears once (the handle) and violet only inside charts. The red is 2.4:1 on the dark page, under the 3:1 large-text minimum; it was asked for as is. Comparison lines use `site-muted`, dotted.

The reference's light-mode grey is lighter than ours. It fails WCAG AA on white, so `site-muted` is darkened to #6b6b6b (5.3:1). Every text pair passes AA: lowest is light muted on surface at 5.1:1.

## Type

Inter (already loaded by `app/layout.tsx`). Small sizes, with weight doing the work. Nothing renders below 12px: the steps that would fall under it sit at 12.

| Token | Size / line height | Weight | Letter spacing | Used for |
| --- | --- | --- | --- | --- |
| `text-display` | 25 / 31 | 600 | -0.02em | Hero headline, page titles |
| `text-figure` | 20 / 25 | 600 | -0.02em | Numbers in stat tiles |
| `text-title` | 13 / 18 | 600 headings, 500 rows | -0.01em | Section headings, row titles |
| `text-body` | 13 / 21 | 500 | 0 | Hero intro |
| `text-copy` | 12 / 21 | 400, 600 buttons | 0 | Paragraphs, buttons, inputs |
| `text-meta` | 12 / 16 | 400 | 0 | Dates, category labels |
| `text-small` | 12 / 16 | 400-500 | 0 | View All, footer, notes |
| `text-tag` | 12 / 14 | 600 caps | wide | "New" badge |

The headline breaks across lines: line one in `site-fg`, line two in `site-muted`.

## Layout

- One centred column, `max-w-column` = 448px, at every width, the media kit included. 16px side gutter on phones.
- 160px above the hero from 810px up, 64px below that.
- Sections are 64px apart (`gap-section`). No dividers between sections, only space.
- Each list section: heading, then rows between 1px hairlines, then a small "View All".
- Breakpoint `tab` = 810px. It only changes the space above the hero.
- No nav. Home links out to everything; /stack, /media-kit and /partners have a `← Home` link on the right of the heading (`PageTitle`).

## Rows and cards

- List row: 16px vertical padding. Optional 44px tile on the left (7px radius, 1px border). Title over a muted label, or a date on the right.
- Hover: the row fills with `site-surface` and a 10px radius, spilling 10px past the column on each side. Stack rows also show an arrow.
- Featured card: full column width, 16:9, 10px radius, 1px border, caption bottom-left over a dark gradient. Hover: border brightens, image scales 2%.
- Buttons: 36px tall, 8px radius, 1px border, `site-surface` fill, 600 weight.
- Inputs: 40px tall, 8px radius, same fill and border.

## Media kit (/media-kit)

The analytics dashboard from the standalone media kit, moved into the site and restyled with these tokens. Code in `components/media-kit/`, numbers in `content/media-kit.ts` (read through `lib/media-kit/load.ts`, which validates them at build time).

- Always dark (`SiteShell forceDark`): the kit has no light values, so the theme toggle is hidden on this page.
- Same 448px column as every other page, so the dashboard uses its narrow layout at every width: KPIs two to a row, lists stacked, a 200px chart.
- Type is the site's scale: KPIs in `text-figure` (20px), list headings in `text-title`, rows in `text-copy`, labels and axis in `text-meta` / `text-small`.
- Controls are the site's own: platform pills use the pill group classes in `components/home/controls.ts` (`navClass`, `itemClass`, `itemActiveClass`), the date chip and list dropdowns wear `buttonClass`, the picker's Apply is `submitClass`.
- Styles in `components/media-kit/media-kit.css`, all scoped to `.media-kit`.

Kit-only tokens (dark values; the page never shows a light version):

| Token | Value | Used for |
| --- | --- | --- |
| `site-chart-line` | #a0a0a0 | The monochrome line, its dotted comparison, markers |
| `site-chart-hairline` | rgb(255 255 255 / 0.07) | Rules inside the analytics card |
| `site-chart-rule` | rgb(255 255 255 / 0.22) | Crosshair |
| `site-chart-bar` | #1f1f1f | Proportional list bars, picker hovers |
| `site-chart-muted` | #8e8e8e | Labels, axis, deltas inside the analytics card only (5.6:1 on the card) |
| `site-chart-disabled` | #4a4a4a | Future days in the date picker |
| `site-live` | #3b82f6 | The live dot |
| `site-tiktok` / `site-instagram` / `site-youtube` | #5aa7a8 / #b072a8 / #c25b4f | Tooltip breakdown dots, nowhere else |
| `site-brand-youtube` / `site-brand-instagram`, `site-on-media-muted` | #ff0000 / #e4405f, #c7c7c7 | Brand marks on platform icons, subtitles over thumbnails |

One type exception: `text-flag` (9px), the two-letter country code in 22px tiles.

## Spacing scale

4, 8, 12, 16 (row padding, gutter), 36 (control), 40 (field), 44 (tile), 64 (section), 160 (page top).

## Motion

- Colour, background and border fades: 300ms, `cubic-bezier(0.44, 0, 0.56, 1)` (`site-transition`).
- Sections fade up 12px as they scroll into view (`site-reveal`), pure CSS, so the page still shows in full without JavaScript or in browsers that don't support it.
- Both are switched off when the visitor asks for reduced motion.
