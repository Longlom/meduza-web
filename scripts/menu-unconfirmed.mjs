#!/usr/bin/env node
// Lists every menu item or marker the owner has not confirmed yet (see lib/menu/items.ts).
const { FOOD_MENUS } = await import("../lib/menu/items.ts");
const NOTE = { name: "English name is a translation", veg: "vegetarian marker", spicy: "spicy marker" };

let total = 0;
const byKind = { name: 0, veg: 0, spicy: 0 };
for (const [menu, sections] of Object.entries(FOOD_MENUS)) {
  for (const section of sections) {
    for (const item of section.items) {
      if (!item.unconfirmed?.length) continue;
      total++;
      for (const k of item.unconfirmed) byKind[k]++;
      console.log(`  ${menu}/${section.id}: ${item.name}  [${item.unconfirmed.map((k) => NOTE[k]).join(", ")}]`);
    }
  }
}
console.log(`\n${total} items have unconfirmed content: ${byKind.name} English names, ${byKind.veg} vegetarian markers, ${byKind.spicy} spicy markers.`);
