// All site content lives here. Edit this file to change what the page shows.
// Links, partners and gear were copied from the live Framer site (byalyxx.com) on 2026-10-20.

export type Partner = {
  name: string;
  description: string;
  url: string; // your affiliate link
  logo?: string; // path under /public, e.g. "/partners/flexispot.png"
  code?: string; // optional discount code shown on the row
};

export type GearItem = { type: string; name: string; url?: string };
export type GearGroup = { label: string; items: GearItem[] };

export const profile = {
  name: "byalyxx",
  tagline: "Creator & Tech Enthusiast",
  avatar: "/avatar.svg", // TODO: replace with your portrait, e.g. public/avatar.jpg
  email: "byalyxx@gmail.com",
  totalFollowers: "11k+",
  cta: { label: "Watch on YouTube", url: "https://www.youtube.com/@byalyxx" },
};

export const socials = [
  { label: "TikTok", icon: "tiktok", url: "https://www.tiktok.com/@byalyxx", followers: "8.4k+" },
  { label: "Instagram", icon: "instagram", url: "https://www.instagram.com/byalyxx/", followers: "1.5k+" },
  { label: "YouTube", icon: "youtube", url: "https://www.youtube.com/@byalyxx", followers: "1.1k+" },
] as const;

// YouTube video IDs, newest first.
export const videos = [
  { id: "x3XlALrMMuU", title: "Latest video" },
  { id: "5G1u5PJHsxs", title: "Previous video" },
];

export const gear: GearGroup[] = [
  {
    label: "PC specs",
    items: [
      { type: "Laptop", name: "Apple MacBook Pro M5", url: "https://link.amazon/B013GjAau" },
      { type: "Monitor", name: "ASUS ROG Strix OLED XG27AQDMG", url: "https://link.amazon/B091Sj2NN" },
      { type: "Monitor arm", name: "ARCTIC X1-3D", url: "https://link.amazon/B05ZyjaBq" },
      { type: "Laptop stand", name: "UGREEN Vertical Laptop Stand", url: "https://link.amazon/B0gZhi4RB" },
      { type: "USB hub", name: "UGREEN USB C Hub 5-in-1", url: "https://link.amazon/B0cd0PXuZ" },
      { type: "DisplayPort cable", name: "UGREEN DisplayPort Cable", url: "https://link.amazon/B00IHHtHH" },
    ],
  },
  {
    label: "Peripherals",
    items: [
      { type: "Keyboard", name: "Tofu60 Redux V2", url: "https://kbdfans.com/collections/60" },
      { type: "Mouse", name: "WLMOUSE Beast X Pro", url: "https://link.amazon/B0hGKdwUq" },
      { type: "Mousemat", name: "Artisan Ninja FX Zero Mid", url: "https://link.amazon/B09Hsul7S" },
      { type: "Mic", name: "FIFINE AM8", url: "https://link.amazon/B0hCVEJ35" },
      { type: "Mic arm", name: "FIFINE BM88", url: "https://link.amazon/B00QOUeOL" },
      { type: "Speakers", name: "Creative Pebble Plus", url: "https://link.amazon/B0aaBj629" },
      { type: "Earphones", name: "Apple EarPods", url: "https://link.amazon/B0ea2NQgp" },
      { type: "Desk", name: "Flexispot E1 Plus", url: "https://link.amazon/B00piuxFB" },
      { type: "Monitor lights", name: "Govee PC Strip lights", url: "https://link.amazon/B0gyx0bJ2" },
      { type: "Keyboard cable", name: "Chubby cable", url: "https://link.amazon/B02EqsOrm" },
      { type: "Cable management", name: "200PCS Cable Management", url: "https://link.amazon/B0bHyDOSs" },
    ],
  },
];

// Recent partners and products. No discount codes are listed on the live site; add `code` to show one.
export const partners: Partner[] = [
  { name: "Flexispot", description: "The Flexispot E7 Pro", url: "https://flexispot.co.uk/e7-series" },
  { name: "Blacklyte", description: "The Kraken Pro", url: "https://blacklyte.uk/products/blacklyte-kraken-pro-gaming-chair" },
  { name: "Gravastar", description: "The V60 Pro series & more", url: "https://www.gravastar.co.uk/collections/he-keyboard" },
  // TODO: the live site points Hex Gaming at the Blacklyte chair link. Swap in the real Hex Gaming link.
  { name: "Hex Gaming", description: "The Phantom Controller", url: "https://blacklyte.uk/products/blacklyte-kraken-pro-gaming-chair" },
];
