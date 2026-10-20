// All site content lives here. Edit this file to change what the page shows.
// Anything marked TODO is a placeholder: the Framer export didn't include the real value.

export type Partner = {
  name: string;
  description: string;
  url: string; // your affiliate link
  logo?: string; // path under /public, e.g. "/partners/hostinger.png"
  code?: string; // optional discount code shown on the row
};

export type GearItem = { type: string; name: string; url?: string };

export const profile = {
  name: "byalyxx",
  tagline: "Creator & Tech Enthusiast",
  avatar: "/avatar.svg", // TODO: replace with your portrait, e.g. public/avatar.jpg
  cta: { label: "Watch on YouTube", url: "https://www.youtube.com/@byalyxx" }, // TODO: confirm
};

// TODO: confirm handles
export const socials = [
  { label: "YouTube", icon: "youtube", url: "https://www.youtube.com/@byalyxx" },
  { label: "TikTok", icon: "tiktok", url: "https://www.tiktok.com/@byalyxx" },
  { label: "Instagram", icon: "instagram", url: "https://www.instagram.com/byalyxx" },
] as const;

// YouTube video IDs, newest first. These two came from the Framer export.
export const videos = [
  { id: "8AHPXm9Y6mI", title: "Latest Video" },
  { id: "6aioEoCdBJw", title: "Previous Video" },
];

// TODO: real gear list
export const gear: { pcSpecs: GearItem[]; peripherals: GearItem[] } = {
  pcSpecs: [
    { type: "CPU", name: "Add your CPU" },
    { type: "GPU", name: "Add your GPU" },
    { type: "RAM", name: "Add your RAM" },
    { type: "Storage", name: "Add your SSD" },
    { type: "Case", name: "Add your case" },
  ],
  peripherals: [
    { type: "Monitor", name: "Add your monitor" },
    { type: "Keyboard", name: "Add your keyboard" },
    { type: "Mouse", name: "Add your mouse" },
    { type: "Mic", name: "Add your mic" },
    { type: "Camera", name: "Add your camera" },
  ],
};

// TODO: real partners. The Framer page had 13 partner rows.
export const partners: Partner[] = [
  { name: "Partner Brand", description: "Add a short description for this brand.", url: "#" },
  { name: "Partner Brand", description: "Add a short description for this brand.", url: "#" },
  { name: "Partner Brand", description: "Add a short description for this brand.", url: "#" },
  { name: "Partner Brand", description: "Add a short description for this brand.", url: "#" },
];
