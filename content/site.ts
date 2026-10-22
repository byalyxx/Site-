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
// `stats` on the newest video shows under the featured card; update the counts by hand.
export const videos: { id: string; title: string; stats?: { views: string; likes: string; comments: string } }[] = [
  { id: "5G1u5PJHsxs", title: "the most powerful tiny pc i’ve ever built", stats: { views: "152k", likes: "2k", comments: "106" } },
  { id: "x3XlALrMMuU", title: "do you actually need a sim rig? (Logitech RS50)" },
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

// Media kit page (/media-kit). These stats were copied from the Framer media kit; update them as they grow.
export const mediaKit = {
  // One line under the "Media kit" heading.
  intro: "Live stats, past brand work and what I offer across TikTok, Instagram and YouTube.",
  statsUpdated: "Sep 23, 2026",
  totalFollowers: "8.5k+",
  platforms: [
    { label: "TikTok", icon: "tiktok", url: "https://www.tiktok.com/@byalyxx", followers: "7k+" },
    { label: "Instagram", icon: "instagram", url: "https://www.instagram.com/byalyxx/", followers: "900+" },
    { label: "YouTube", icon: "youtube", url: "https://www.youtube.com/@byalyxx", followers: "600+" },
  ],
  services: [
    { icon: "short", title: "Short-form video", description: "Native product storytelling for social." },
    { icon: "long", title: "Long-form review", description: "Detailed, considered coverage for YouTube." },
    { icon: "photo", title: "Product photography", description: "Clean, desk-set imagery for your launch." },
    { icon: "rights", title: "Usage rights", description: "Flexible amplification and licensing options." },
  ],
};

// ---------------------------------------------------------------------------
// Home page sections (the anticode-style layout). Anything starting with
// "PLACEHOLDER" is waiting for real content and shows up styled as a placeholder.
// ---------------------------------------------------------------------------

export const hero = {
  // Display headline, one string per line.
  headline: ["@byalyxx", "Tech enthusiast & Creator"],
  intro: "I post desk and PC setup content across TikTok, Instagram and YouTube — builds, upgrades and reviews.",
  about: { label: "Media kit", href: "/media-kit" },
};

export type BlogPost = { title: string; date: string; href?: string; placeholder?: boolean };
export const blog: BlogPost[] = [
  { title: "PLACEHOLDER: first post title", date: "Jan 1, 2026", placeholder: true },
  { title: "PLACEHOLDER: second post title", date: "Jan 1, 2026", placeholder: true },
  { title: "PLACEHOLDER: third post title", date: "Jan 1, 2026", placeholder: true },
];

export type Product = { title: string; type?: string; description: string; href?: string; placeholder?: boolean };
export const products: Product[] = [
  { title: "Done-for-you creator site", description: "Your gear list, live stats, brand enquiries. One site, fully custom." },
];

// Stack = the desk and PC setup. Built from `gear` above so links stay in one place.
// The home page shows `stackFeatured`; /stack shows every group.
export type StackItem = GearItem & { category: string };
export const stack: StackItem[] = gear.flatMap((g) => g.items.map((item) => ({ ...item, category: g.label })));
export const stackFeatured = ["Monitor", "Keyboard", "GPU"];

export const newsletter = {
  title: "Newsletter",
  blurb: "PLACEHOLDER: one line on what you'd send and how often.",
};

// The home page's one line for brands; the contact form lives on the media kit.
export const contact = {
  line: "Brand and collaboration enquiries",
  link: { label: "Media kit", href: "/media-kit" },
};

// ---------------------------------------------------------------------------
// Media kit extras. Every figure below is EXAMPLE data so the charts have
// something to draw. Swap in your real numbers from Instagram / TikTok / YouTube
// insights, then set `example: false` and the "Example data" tag disappears.
// ---------------------------------------------------------------------------

export const mediaKitAnalytics = {
  example: true,
  platform: "Instagram",
  period: "Last 30 days",
  stats: [
    { label: "Views", value: "100K" },
    { label: "Accounts reached", value: "50K" },
    { label: "Profile visits", value: "1,000" },
    { label: "Link taps", value: "100" },
    { label: "Followers gained", value: "+200" },
    { label: "Saves", value: "300" },
  ],
  // One value per day, oldest first. Both lists need the same length.
  trend: {
    current: { label: "Views", values: [3, 5, 4, 6, 9, 7, 5, 6, 8, 12, 10, 7, 6, 8, 9, 11, 14, 12, 9, 8, 10, 13, 16, 14, 11, 10, 12, 15, 13, 12] },
    previous: { label: "Previous 30 days", values: [4, 4, 5, 4, 3, 4, 5, 6, 5, 4, 3, 4, 5, 5, 6, 5, 4, 5, 6, 7, 6, 5, 4, 5, 6, 8, 9, 8, 7, 7] },
  },
  // `value` sizes the bar, `display` is the text shown (defaults to the value).
  geography: [
    { label: "Country 1", value: 40, display: "40%" },
    { label: "Country 2", value: 20, display: "20%" },
    { label: "Country 3", value: 10, display: "10%" },
    { label: "Country 4", value: 5, display: "5%" },
  ],
  audience: [
    { label: "Non-followers", value: 75, display: "75%" },
    { label: "Followers", value: 25, display: "25%" },
  ],
  devices: [
    { label: "Mobile", value: 90, display: "90%", icon: "mobile" },
    { label: "Desktop", value: 10, display: "10%", icon: "desktop" },
  ],
};

// Sponsored videos and other paid work. Add `href` (the post or video link) and `thumb`
// (an image in /public) to each real one.
export type Deliverable = { title: string; brand: string; format: string; href?: string; thumb?: string; placeholder?: boolean };
export const deliverables: Deliverable[] = [
  { title: "PLACEHOLDER: sponsored video title", brand: "Brand", format: "YouTube integration", placeholder: true },
  { title: "PLACEHOLDER: sponsored short title", brand: "Brand", format: "TikTok + Instagram Reel", placeholder: true },
  { title: "PLACEHOLDER: product shoot", brand: "Brand", format: "Photo set + usage rights", placeholder: true },
];
