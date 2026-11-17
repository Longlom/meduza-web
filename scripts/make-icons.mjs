#!/usr/bin/env node
// Builds the app icons from the logo onto the Abyss background (--mz-bg).
// NOTE: the logo PNG is traced from a photo (514 px). Re-run this when the vector master arrives.
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const root = new URL("..", import.meta.url).pathname;
const src = `${root}public/logo/logo-white.png`;
const out = `${root}public/icons`;
const ABYSS = { r: 5, g: 7, b: 14, alpha: 1 }; // #05070E, the Abyss page ground
mkdirSync(out, { recursive: true });

async function icon(file, size, fraction) {
  const logo = await sharp(src).resize({ width: Math.round(size * fraction) }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: ABYSS } })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(`${out}/${file}`);
  console.log(`wrote public/icons/${file} (${size}x${size})`);
}

// Small logo for the nav and the Home hero (shown about 48 px wide, so 192 px covers a 4x screen).
await sharp(src).resize({ width: 192 }).png({ compressionLevel: 9, palette: true }).toFile(`${root}public/logo/logo-white-sm.png`);
console.log("wrote public/logo/logo-white-sm.png (192 px wide)");

await icon("icon-192.png", 192, 0.78);
await icon("icon-512.png", 512, 0.78);
// Maskable icons are cropped by the OS: keep the logo inside the central safe zone.
await icon("icon-maskable-512.png", 512, 0.56);
await icon("apple-touch-icon.png", 180, 0.78);
