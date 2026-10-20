// All site content lives here. Edit this file to change what the page shows.
// Links, partners and gear were copied from the live Framer site (byalyxx.com) on 2026-10-20.

export type Partner = {
  name: string;
  description: string;
  url: string; // your affiliate link
  logo?: string; // path under /public, e.g. "/partners/flexispot.jpg"
  code?: string; // optional discount code shown on the row
};

export type GearItem = { type: string; name: string; url?: string };
export type GearGroup = { label: string; items: GearItem[] };

export const profile = {
  name: "byalyxx",
  tagline: "Creator & Tech Enthusiast",
  avatar: "/avatar.jpg",
  email: "byalyxx@gmail.com",
  totalFollowers: "11k+",
  cta: { label: "Watch on YouTube", url: "https://www.youtube.com/@byalyxx" },
};

export const socials = [
  { label: "TikTok", icon: "tiktok", url: "https://www.tiktok.com/@byalyxx", followers: "8.4k+" },
  { label: "Instagram", icon: "instagram", url: "https://www.instagram.com/byalyxx/", followers: "1.5k+" },
  { label: "YouTube", icon: "youtube", url: "https://www.youtube.com/@byalyxx", followers: "1.1k+" },
] as const;

// YouTube video IDs, newest first. Thumbnails live in public/videos/<id>.jpg.
export const videos = [
  { id: "x3XlALrMMuU", title: "do you actually need a sim rig? (Logitech RS50)" },
  { id: "5G1u5PJHsxs", title: "the most powerful tiny pc i’ve ever built" },
];

export const gear: GearGroup[] = [
  {
    label: "Peripherals",
    items: [
      { type: "Monitor", name: "ASUS ROG Strix OLED XG27AQDMG", url: "https://link.amazon/B091Sj2NN" },
      { type: "Monitor arm", name: "ARCTIC X1-3D", url: "https://link.amazon/B05ZyjaBq" },
      { type: "Monitor lights", name: "Govee PC Strip lights", url: "https://link.amazon/B0gyx0bJ2" },
      { type: "Mic", name: "FIFINE AM8", url: "https://link.amazon/B0hCVEJ35" },
      { type: "Mic arm", name: "FIFINE BM88", url: "https://link.amazon/B00QOUeOL" },
      { type: "Desk", name: "Flexispot E1 Plus", url: "https://link.amazon/B00piuxFB" },
      { type: "Mousemat", name: "Artisan Ninja FX Zero Mid", url: "https://link.amazon/B09Hsul7S" },
      { type: "Mouse", name: "WLMOUSE Beast X Pro", url: "https://link.amazon/B0hGKdwUq" },
      { type: "Keyboard", name: "Tofu60 Redux V2", url: "https://kbdfans.com/collections/60" },
      { type: "Earphones", name: "Apple EarPods", url: "https://link.amazon/B0ea2NQgp" },
      { type: "Speakers", name: "Creative Pebble Plus", url: "https://link.amazon/B0aaBj629" },
      { type: "Laptop stand", name: "UGREEN Vertical Laptop Stand", url: "https://link.amazon/B0gZhi4RB" },
      { type: "Keyboard cable", name: "Chubby cable", url: "https://link.amazon/B02EqsOrm" },
      { type: "DisplayPort cable", name: "UGREEN DisplayPort Cable", url: "https://link.amazon/B00IHHtHH" },
      { type: "USB hub", name: "UGREEN USB C Hub 5-in-1", url: "https://link.amazon/B0cd0PXuZ" },
      { type: "Cable management", name: "200PCS Cable Management", url: "https://link.amazon/B0bHyDOSs" },
      { type: "MacBook", name: "Apple MacBook Pro M5", url: "https://link.amazon/B013GjAau" },
    ],
  },
  {
    label: "PC specs",
    items: [
      { type: "GPU", name: "Gigabyte AORUS MASTER RTX 5070", url: "https://link.amazon/B00a2aJT7" },
      { type: "CPU", name: "AMD Ryzen 7 7800X3D", url: "https://link.amazon/B0aukC55g" },
      { type: "RAM", name: "CORSAIR VENGEANCE RGB DDR5 32GB", url: "https://link.amazon/B0bemzEpJ" },
      { type: "SSD", name: "Acer Predator GM7 2TB SSD", url: "https://link.amazon/B07E1fAO9" },
      { type: "PSU", name: "CORSAIR SF750 Platinum", url: "https://link.amazon/B0cgGCi8i" },
      { type: "CPU cooler", name: "Thermalright AXP90-X47", url: "https://link.amazon/B0chRLRuR" },
      { type: "Fan swap", name: "Noctua NF-A9x14 HS-PWM", url: "https://link.amazon/B0if6EABn" },
      { type: "Thermal paste", name: "ARCTIC MX-6", url: "https://link.amazon/B03YpPKl9" },
      { type: "Motherboard", name: "ASUS ROG Strix B650E-I", url: "https://link.amazon/B0ch4BTTT" },
      { type: "Case", name: "NCASE Formd T1", url: "https://ncased.com/collections/t-series" },
      { type: "Case fans", name: "Phanteks T30", url: "https://link.amazon/B06YlQgjl" },
    ],
  },
];

// Recent partners and products. No discount codes are listed on the live site; add `code` to show one.
export const partners: Partner[] = [
  { name: "Flexispot", description: "The Flexispot E7 Pro", url: "https://flexispot.co.uk/e7-series", logo: "/partners/flexispot.jpg" },
  { name: "Blacklyte", description: "The Kraken Pro", url: "https://blacklyte.uk/products/blacklyte-kraken-pro-gaming-chair", logo: "/partners/blacklyte.jpg" },
  { name: "Gravastar", description: "The V60 Pro series & more", url: "https://www.gravastar.co.uk/collections/he-keyboard", logo: "/partners/gravastar.jpg" },
  // TODO: the live site points Hex Gaming at the Blacklyte chair link. Swap in the real Hex Gaming link.
  { name: "Hex Gaming", description: "The Phantom Controller", url: "https://blacklyte.uk/products/blacklyte-kraken-pro-gaming-chair", logo: "/partners/hex-gaming.jpg" },
];
