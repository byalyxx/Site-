import Script from "next/script";

// Umami (umami.is): cookieless, so no consent banner is needed. Loads only when NEXT_PUBLIC_UMAMI_WEBSITE_ID is
// set at build time (see README), so local builds and previews never report visits.
// Affiliate and partner rows carry data-umami-event attributes, so every outbound product click is counted too.
const WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export function Analytics() {
  if (!WEBSITE_ID) return null;
  return <Script src="https://cloud.umami.is/script.js" data-website-id={WEBSITE_ID} strategy="afterInteractive" />;
}
