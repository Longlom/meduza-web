#!/usr/bin/env node
// Guards the design rules in app code:
//  - no hardcoded colours (hex, rgb(), hsl()): use --mz-* tokens
//  - mobile first: layout media queries must be min-width, never max-width
// Allow-listed: browser/manifest colour fields (themeColor, theme_color, background_color).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const SCAN = ["app", "components"];
const COLOR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla)\(/;
const MAX_WIDTH_QUERY = /@media[^{]*\bmax-width\b/;
const ALLOW = /themeColor|theme_color|background_color/;

function* files(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* files(p);
    else if (/\.(css|tsx?)$/.test(name) && !/\.test\.tsx?$/.test(name)) yield p;
  }
}

const problems = [];
for (const dir of SCAN) {
  for (const file of files(join(root, dir))) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      const where = `${relative(root, file)}:${i + 1}`;
      if (COLOR.test(line) && !ALLOW.test(line)) problems.push(`${where}  hardcoded colour: ${line.trim()}`);
      if (file.endsWith(".css") && MAX_WIDTH_QUERY.test(line)) problems.push(`${where}  max-width media query (use min-width): ${line.trim()}`);
    });
  }
}

if (problems.length) {
  console.error(`check:tokens found ${problems.length} problem${problems.length === 1 ? "" : "s"}:\n`);
  for (const p of problems) console.error("  " + p);
  process.exit(1);
}
console.log("check:tokens ok: no hardcoded colours, no max-width media queries.");
