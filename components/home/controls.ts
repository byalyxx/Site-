// The site's two marks, styled in app/tokens.css: brackets around things you press, an underline on things that
// take you somewhere. The media kit's tabs, date control and picker buttons use the same classes.
export const bracketClass = "site-bracket";
export const linkClass = "site-link";

// A row of bracketed tabs. No outer frame: the brackets are the only mark.
export const tabsClass = "flex flex-wrap items-center gap-x-4";

// A rule under each field instead of a box, in the link underline's colour (30% of the text), red on focus.
export const fieldClass =
  "w-full rounded-none border-0 border-b border-b-site-fg/30 bg-transparent px-0 text-copy text-site-fg placeholder:text-site-muted site-transition focus-visible:border-b-site-brand focus-visible:outline-none";
