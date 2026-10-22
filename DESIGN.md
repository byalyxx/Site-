# Design system (home page, /stack and /media-kit)

The home page follows the layout and visual language of a reference portfolio template (anticode.framer.website). Nothing from that site is copied here: these notes were written from screenshots taken at 1440, 834 and 390px wide, and the code is our own.

The tokens live in [`app/tokens.css`](app/tokens.css). Every colour, size, gap and radius on the home page, /stack and /media-kit comes from there.

## Colour

Follows the visitor's system setting, and the theme button in the footer switches it. Neutral greys only, no brand accent: the photos and logos bring the colour. The dark greys are taken from digitalcreator.club's dark theme.

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `site-bg` | #ffffff | #000000 | Page |
| `site-surface` | #fafafa | #111111 | Hovered rows |
| `site-border` | #e0e0e0 | #262626 | Outlines on surfaces |
| `site-line` | #f0f0f0 | #1c1c1c | Hairlines between list rows |
| `site-fg` | #0a0a0a | #fafafa | Headings, titles |
| `site-muted` | #6b6b6b | #a3a3a3 | Second headline line, intros, labels, dates |
| `site-accent` / `-fg` | #0a0a0a / #fff | #fafafa / #0a0a0a | The one solid button (Submit) |
| `site-on-media`, `site-scrim` | #fff, #000 | same | Caption over the video thumbnail |
| `site-data` | #7c3aed | #a78bfa | The series that matters in a chart (this period) |
| `site-positive` | #15803d | #4ade80 | Growth figures (+10%) |
| `site-brand` | #aa0412 | #aa0412 | The @byalyxx handle in the home hero, the "Media kit" heading |

Outside the greys, red appears on the handle and the media kit heading and violet only inside charts. The red is 2.6:1 on the dark page, under the 3:1 large-text minimum; it was asked for as is. Comparison lines use `site-muted`, dotted.

The reference's light-mode grey is lighter than ours. It fails WCAG AA on white, so `site-muted` is darkened to #6b6b6b (5.3:1). Every text pair passes AA: lowest is light muted on surface at 5.1:1.

## Type

Geist for everything, loaded by `app/layout.tsx` (same face as digitalcreator.club). No monospace anywhere. Small sizes, with weight doing the work. Nothing renders below 12px: the steps that would fall under it sit at 12.

| Token | Size / line height | Weight | Letter spacing | Used for |
| --- | --- | --- | --- | --- |
| `text-display` | 25 / 31 | 600 | -0.02em | Hero headline, page titles |
| `text-figure` | 20 / 25 | 600 | -0.02em | Numbers in stat tiles |
| `text-title` | 13 / 18 | 600 headings, 500 rows | -0.01em | Section headings, row titles |
| `text-body` | 13 / 21 | 500 | 0 | Hero intro |
| `text-copy` | 12 / 21 | 400, 600 buttons | 0 | Paragraphs, buttons, inputs |
| `text-meta` | 12 / 16 | 400 | 0 | Dates, category labels |
| `text-small` | 12 / 16 | 400-500 | 0 | View All, footer, notes |
| `text-tag` | 12 / 14 | 500 | 0 | `[NEW]` on the featured card |

The headline breaks across lines: line one in `site-fg`, line two in `site-muted`.

## Layout

- One centred column, `max-w-column` = 448px, at every width, the media kit included. 16px side gutter on phones.
- 160px above the hero from 810px up, 64px below that.
- Sections are 64px apart (`gap-section`). No dividers between sections, only space.
- Each list section: heading, then rows between 1px hairlines, then a small "View All".
- /stack shows one gear list at a time, switched by bracketed tabs (`GearSwitcher`, the same classes as the media kit's platform tabs).
- Breakpoint `tab` = 810px. It only changes the space above the hero.
- No nav. Home links out to everything; /stack, /media-kit and /partners have a ← Home link (`linkClass`) on the right of the heading (`PageTitle`).

## Rows and cards

- List row: 16px vertical padding, at least 44px tall. No icon tiles: only icons that identify something (partner logos, platform icons, flags), bare and square. Name in the site face; category or product beneath, muted, `text-small`; prose descriptions stay in the site face.
- Hover: the row tints with `site-surface` (no radius), spilling 10px past the column on each side, and the bare ↗ on the right turns `site-brand`.
- Featured card: full column width, 16:9, square corners, 1px border, `[NEW]` top-left, caption bottom-left over a dark gradient. Hover: border brightens, image scales 2%.
- Inputs: 40px tall, no box: a 1px rule underneath at 30% of the text colour (like the link underline), `site-brand` on focus.

## Media kit (/media-kit)

The analytics dashboard from the standalone media kit, moved into the site and restyled with these tokens. Code in `components/media-kit/`, numbers in `content/media-kit.ts` (read through `lib/media-kit/load.ts`, which validates them at build time).

- Follows the site theme like every other page, with the theme toggle in the footer. The analytics have their own light and dark `site-chart-*` values.
- Same 448px column as every other page, so the dashboard uses its narrow layout at every width: KPIs two to a row, lists stacked, a 200px chart.
- Type is the site's scale: KPIs in `text-figure` (20px), list headings in `text-title`, rows in `text-copy`, labels and axis in `text-meta` / `text-small`.
- Controls are the site's own: platform tabs, the date control and the picker's Cancel and Apply use `bracketClass` and `tabsClass` from `components/home/controls.ts`.
- Styles in `components/media-kit/media-kit.css`, all scoped to `.media-kit`.

Kit-only tokens (dark values; the page never shows a light version):

| Token | Value | Used for |
| --- | --- | --- |
| `site-chart-line` | #a0a0a0 | The monochrome line, its dotted comparison, markers |
| `site-chart-hairline` | rgb(255 255 255 / 0.07) | Rules inside the analytics section |
| `site-chart-rule` | rgb(255 255 255 / 0.22) | Crosshair |
| `site-chart-bar` | #1f1f1f | Proportional list bars, picker hovers |
| `site-chart-muted` | #8e8e8e | Labels, axis, deltas in the analytics section only |
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

## Brackets and underlines

One rule for every control and link: a dimmed secondary mark turns `site-brand` red on hover, and the label never changes colour or weight. Styles live in `app/tokens.css` (`.site-bracket`, `.site-link`); components use `bracketClass` and `linkClass` from `components/home/controls.ts`.

- Brackets `[ ]`: things you press (buttons, tabs, toggles, the copy-email control) and a page's primary action even when it navigates ([Media kit] on home, [Work with me] on the media kit). Label in the site face, brackets at 45% of the label colour, solid red when selected, unselected tabs muted. 44px tall.
- Underline: things that take you somewhere (follower links, Email, View All, ← Home, the media kit line on home). 1px, 4px offset, 30% of the text colour. A 44px hit area from `::after`.
- Neither: list rows, form inputs, anything inside the analytics that isn't a tab or toggle.
- Never nest the two, never bracket anything that isn't interactive, no frame around a group of tabs, and keep to about 4–5 bracketed controls per screen.
