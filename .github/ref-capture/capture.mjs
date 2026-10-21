import { chromium } from "playwright";
import fs from "fs";
const BASE = "https://anticode.framer.website";
const sizes = { desktop: [1440, 900], tablet: [834, 1112], mobile: [390, 844] };
fs.mkdirSync("out", { recursive: true });
const browser = await chromium.launch();
async function settle(page) {
  await page.waitForTimeout(2500);
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 300) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(150); }
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
}
for (const scheme of ["dark", "light"]) {
  for (const [name, [w, h]] of Object.entries(sizes)) {
    if (scheme === "light" && name !== "desktop") continue;
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: "networkidle", timeout: 60000 });
    await settle(page);
    await page.screenshot({ path: `out/home-${name}-${scheme}.png`, fullPage: true });
    if (scheme === "dark") {
      const total = await page.evaluate(() => document.body.scrollHeight);
      let i = 0;
      for (let y = 0; y < total; y += h) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(600); await page.screenshot({ path: `out/vp-${name}-${String(i++).padStart(2, "0")}.png` }); }
    }
    if (name === "desktop" && scheme === "dark") {
      const data = await page.evaluate(() => {
        const pick = (el) => { const s = getComputedStyle(el); const r = el.getBoundingClientRect();
          return { tag: el.tagName, text: (el.innerText || "").slice(0, 80), font: s.fontFamily, size: s.fontSize, weight: s.fontWeight, lh: s.lineHeight, ls: s.letterSpacing, color: s.color, bg: s.backgroundColor, radius: s.borderRadius, border: s.border, pad: s.padding, transition: s.transition, x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height) }; };
        const els = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,a,button,input,nav,header,footer,section")].filter(e => e.getBoundingClientRect().width > 0);
        const boxes = [...document.querySelectorAll("div")].filter(e => { const s = getComputedStyle(e); return (s.borderRadius !== "0px" || s.borderTopWidth !== "0px") && e.getBoundingClientRect().width > 40; }).slice(0, 120);
        const media = [...document.styleSheets].flatMap(ss => { try { return [...ss.cssRules].filter(r => r.media).map(r => r.media.mediaText); } catch { return []; } });
        const fonts = [...document.fonts].map(f => `${f.family} ${f.weight} ${f.style}`);
        return { bodyBg: getComputedStyle(document.body).backgroundColor, htmlBg: getComputedStyle(document.documentElement).backgroundColor, title: document.title, els: els.map(pick), boxes: boxes.map(pick), media: [...new Set(media)], fonts: [...new Set(fonts)], links: [...document.querySelectorAll("a")].map(a => [a.innerText.trim().slice(0, 40), a.getAttribute("href")]), text: document.body.innerText };
      });
      fs.writeFileSync("out/styles.json", JSON.stringify(data, null, 1));
      // hover samples
      const targets = await page.$$("main a, a");
      let k = 0;
      for (const t of targets.slice(0, 40)) {
        const box = await t.boundingBox(); if (!box || box.width < 150) continue;
        await t.scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
        const b2 = await t.boundingBox();
        await page.mouse.move(b2.x + b2.width / 2, b2.y + b2.height / 2); await page.waitForTimeout(700);
        await page.screenshot({ path: `out/hover-${k++}.png`, clip: { x: Math.max(0, b2.x - 20), y: Math.max(0, b2.y - 20), width: Math.min(1400, b2.width + 40), height: Math.min(600, b2.height + 40) } });
        if (k > 8) break;
      }
    }
    await ctx.close();
  }
}
// sub pages (dark desktop + mobile)
for (const path of ["/stack", "/products", "/blog", "/about"]) {
  for (const name of ["desktop", "mobile"]) {
    const [w, h] = sizes[name];
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: "dark" });
    const page = await ctx.newPage();
    try { const r = await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 45000 }); if (r && r.status() < 400) { await settle(page); await page.screenshot({ path: `out/page${path.replace("/", "-")}-${name}.png`, fullPage: true }); } } catch (e) { console.log(path, e.message); }
    await ctx.close();
  }
}
await browser.close();
