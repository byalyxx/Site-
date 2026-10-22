import Script from "next/script";
import { ClickTracking } from "./click-tracking";

// Visitor analytics, cookieless either way, so no consent banner is needed. Set one of these at build time
// (see README); with neither, no script loads, so local builds and previews never report visits.
// - Plausible (plausible.io, the pick from the Notion guide): NEXT_PUBLIC_PLAUSIBLE_SRC = the script link from
//   Plausible's install snippet (https://plausible.io/js/pa-….js, or your own instance's for self-hosting).
//   Older accounts without a pa- link: NEXT_PUBLIC_PLAUSIBLE_DOMAIN=byalyxx.com instead.
// - Umami Cloud (cloud.umami.is, free tier): NEXT_PUBLIC_UMAMI_WEBSITE_ID.
// Clicks on anything with data-track (affiliate rows, Work with me) are sent as events by ClickTracking.
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const PLAUSIBLE_SRC = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || (PLAUSIBLE_DOMAIN ? "https://plausible.io/js/script.outbound-links.js" : "");
// New-style snippets (pa-….js) are set up by plausible.init(); the old script reads data-domain instead.
const PLAUSIBLE_INIT = /\/pa-[^/]+\.js$/.test(PLAUSIBLE_SRC);
// Public by design (it ships in the page anyway), so it lives here; the env var still overrides it.
const UMAMI_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || "f534f266-52db-4e52-be6f-4504ad8e76d9";

export function Analytics() {
  if (!PLAUSIBLE_SRC && !UMAMI_ID) return null;
  return (
    <>
      {PLAUSIBLE_SRC && (
        <>
          {/* Queues events fired before the script has loaded (Plausible's own install snippet) */}
          <Script id="plausible-queue" strategy="afterInteractive">
            {"window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};" +
              (PLAUSIBLE_INIT ? "plausible.init();" : "")}
          </Script>
          <Script src={PLAUSIBLE_SRC} {...(PLAUSIBLE_INIT ? {} : { "data-domain": PLAUSIBLE_DOMAIN })} strategy="afterInteractive" />
        </>
      )}
      {/* data-domains: only visits on the real site count, not local builds or Hostinger's temporary address */}
      {UMAMI_ID && <Script src="https://cloud.umami.is/script.js" data-website-id={UMAMI_ID} data-domains="byalyxx.com,www.byalyxx.com" strategy="afterInteractive" />}
      <ClickTracking />
    </>
  );
}
