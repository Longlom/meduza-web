#!/usr/bin/env node
// Turns the menu PDFs in info/menu into the page images the reader uses.
//   1. renders every page at 1800 px wide with macOS PDFKit (scripts/render-pdf.swift)
//   2. writes AVIF + WebP at 450, 900 and 1800 px:  public/menu/<menu>/<nn>-<hash>-<w>.<ext>
//   3. writes a 1200x630 share image per page:        public/og/menu/<menu>-<nn>.jpg
//   4. writes lib/menu/image-hashes.json (content hash per page, so a changed page gets a new URL)
//      and public/sw-menu-version.js (cache version for the offline worker)
// Output is committed, so deployment needs neither Swift nor the PDFs. Run: npm run menu:images
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const root = new URL("..", import.meta.url).pathname;
const MENUS = [
  { id: "brunch", pdf: "info/menu/BRUNCH MENU.pdf" },
  { id: "cocktails", pdf: "info/menu/COCKTAIL MENU.pdf" },
  { id: "dinner", pdf: "info/menu/DINNER MENU.pdf" }
];
const WIDTHS = [450, 900, 1800];
const ABYSS = { r: 5, g: 7, b: 14, alpha: 1 }; // #05070E: the Abyss page ground, for share images
const cache = join(root, ".menu-render");
const hashes = {};
const report = [];

rmSync(cache, { recursive: true, force: true });
for (const menu of MENUS) {
  const renderDir = join(cache, menu.id);
  execFileSync("swift", [join(root, "scripts/render-pdf.swift"), join(root, menu.pdf), renderDir, "1800"], { stdio: "inherit" });

  const outDir = join(root, "public/menu", menu.id);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  mkdirSync(join(root, "public/og/menu"), { recursive: true });
  hashes[menu.id] = [];

  for (const file of readdirSync(renderDir).filter((f) => f.endsWith(".png")).sort()) {
    const nn = file.slice(0, 2);
    const png = readFileSync(join(renderDir, file));
    const hash = createHash("sha1").update(png).digest("hex").slice(0, 8);
    hashes[menu.id].push(hash);

    for (const w of WIDTHS) {
      const base = sharp(png).resize({ width: w });
      await base.clone().avif({ quality: 55, effort: 4 }).toFile(join(outDir, `${nn}-${hash}-${w}.avif`));
      await base.clone().webp({ quality: 75 }).toFile(join(outDir, `${nn}-${hash}-${w}.webp`));
    }

    const page = await sharp(png).resize({ height: 630 }).toBuffer();
    await sharp({ create: { width: 1200, height: 630, channels: 3, background: ABYSS } })
      .composite([{ input: page, gravity: "center" }])
      .jpeg({ quality: 82 })
      .toFile(join(root, "public/og/menu", `${menu.id}-${nn}.jpg`));

    report.push({
      page: `${menu.id}/${nn}`,
      avif450: statSync(join(outDir, `${nn}-${hash}-450.avif`)).size,
      avif900: statSync(join(outDir, `${nn}-${hash}-900.avif`)).size,
      avif1800: statSync(join(outDir, `${nn}-${hash}-1800.avif`)).size
    });
  }
}

// The service worker imports this file: when any page image changes, the cache name changes and the
// old menu cache is deleted (the worker is re-installed because an imported script changed).
const version = createHash("sha1").update(JSON.stringify(hashes)).digest("hex").slice(0, 8);
writeFileSync(join(root, "public/sw-menu-version.js"), `self.MENU_VERSION = "${version}";\n`);

mkdirSync(join(root, "lib/menu"), { recursive: true });
writeFileSync(join(root, "lib/menu/image-hashes.json"), JSON.stringify(hashes, null, 2) + "\n");
rmSync(cache, { recursive: true, force: true });

const kb = (n) => `${Math.round(n / 1024)} KB`;
const max900 = Math.max(...report.map((r) => r.avif900));
console.log(`\n${report.length} pages. Largest 900 px AVIF: ${kb(max900)} (limit 150 KB).`);
for (const r of report) console.log(`  ${r.page.padEnd(14)} 450: ${kb(r.avif450).padStart(7)}   900: ${kb(r.avif900).padStart(7)}   1800: ${kb(r.avif1800).padStart(7)}`);
