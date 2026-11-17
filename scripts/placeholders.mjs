#!/usr/bin/env node
// Lists every [PLACEHOLDER] still in the app source, with where it appears.
// A placeholder is bracketed upper-case text such as [PHONE] or [HOLD POLICY].
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const SCAN = ["app", "components", "lib"];
const SKIP = /\.test\.ts$/;
const MARK = /\[[A-Z][A-Z0-9 _/@.'’-]*[A-Z0-9]\]/g;

function* files(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* files(p);
    else if (/\.(ts|tsx|css)$/.test(name) && !SKIP.test(name)) yield p;
  }
}

const found = new Map();
for (const dir of SCAN) {
  for (const file of files(join(root, dir))) {
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, i) => {
        for (const m of line.match(MARK) ?? []) {
          const where = `${relative(root, file)}:${i + 1}`;
          found.set(m, [...(found.get(m) ?? []), where]);
        }
      });
  }
}

const names = [...found.keys()].sort();
console.log(`${names.length} placeholder${names.length === 1 ? "" : "s"} still to confirm with the owner:\n`);
for (const n of names) console.log(`  ${n.padEnd(26)} ${found.get(n)[0]}${found.get(n).length > 1 ? `  (+${found.get(n).length - 1} more)` : ""}`);
