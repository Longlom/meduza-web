import { en, type Dict } from "./en";
import { ru } from "./ru";
import type { Locale } from "@/lib/venue";

export type { Dict };

const dicts: Record<Locale, Dict> = { en, ru };

export function getDict(locale: Locale): Dict {
  return dicts[locale];
}
