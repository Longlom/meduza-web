import hashes from "./image-hashes.json";
import type { Locale } from "@/lib/venue";

/** The three printed menus. Page numbers in URLs (`?page=N`) are 1-based and never change meaning. */
export const MENU_IDS = ["brunch", "cocktails", "dinner"] as const;
export type MenuId = (typeof MENU_IDS)[number];

export function isMenuId(v: string | undefined | null): v is MenuId {
  return MENU_IDS.includes(v as MenuId);
}

type Titles = { en: string; ru: string };
const t = (en: string, ru: string): Titles => ({ en, ru });

const COVER = t("Cover", "Обложка");
const BACK = t("Back cover", "Задняя обложка");

export const MENUS: Record<MenuId, { title: Titles; pages: Titles[] }> = {
  brunch: {
    title: t("Brunch menu", "Меню бранча"),
    pages: [
      COVER,
      t("Pasta Club", "Pasta Club"),
      t("Pasta Club, continued", "Pasta Club, продолжение"),
      t("Vietnamese brunch", "Вьетнамский бранч"),
      t("Classic brunch", "Классический бранч"),
      t("Toasts and benedict", "Тосты и бенедикт"),
      t("Sweet dessert", "Сладкий десерт")
    ]
  },
  cocktails: {
    title: t("Signature cocktails", "Авторские коктейли"),
    pages: [
      COVER,
      t("Eyes of Meduza", "Eyes of Meduza"),
      t("Frozen Gaze", "Frozen Gaze"),
      t("The Siren Secret", "The Siren Secret"),
      t("Pearl Venom", "Pearl Venom"),
      t("Abyss Whisper", "Abyss Whisper"),
      t("Lush by Meduza", "Lush by Meduza"),
      t("Neptune’s Kiss", "Neptune’s Kiss"),
      t("The Oasis", "The Oasis"),
      t("Eden Above", "Eden Above"),
      t("Coastal Bloom", "Coastal Bloom"),
      BACK
    ]
  },
  dinner: {
    title: t("Dinner menu", "Меню ужина"),
    pages: [
      COVER,
      t("Starters & snacks", "Закуски"),
      t("Starters & snacks, continued", "Закуски, продолжение"),
      t("Salads", "Салаты"),
      t("Salads, continued", "Салаты, продолжение"),
      t("Mexican starters", "Мексиканские закуски"),
      t("Soup", "Суп"),
      t("Pasta", "Паста"),
      t("Pasta, continued", "Паста, продолжение"),
      t("Main courses", "Основные блюда"),
      t("Main courses, continued", "Основные блюда, продолжение"),
      t("Desserts", "Десерты"),
      t("Seasonal fruit", "Сезонные фрукты"),
      BACK
    ]
  }
};

/** Menus open on their first content page (page 2), as in the design; the cover is one step back. */
export const DEFAULT_PAGE = 2;

export function pageCount(menu: MenuId) {
  return MENUS[menu].pages.length;
}

export function pageTitle(menu: MenuId, page: number, locale: Locale) {
  return MENUS[menu].pages[page - 1][locale];
}

export function menuTitle(menu: MenuId, locale: Locale) {
  return MENUS[menu].title[locale];
}

/**
 * Reads `?page=N`: a number outside the range is clamped to the first or last page, anything
 * that is not a number opens the default page.
 */
export function clampPage(menu: MenuId, raw: string | string[] | undefined | null): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === undefined || value === null || !/^-?\d+$/.test(value.trim())) return DEFAULT_PAGE;
  return Math.min(pageCount(menu), Math.max(1, parseInt(value, 10)));
}

const nn = (page: number) => String(page).padStart(2, "0");

export type ImageWidth = 450 | 900 | 1800;

/** URL of a page image. The content hash is part of the name, so a changed page gets a new URL. */
export function pageImage(menu: MenuId, page: number, width: ImageWidth, ext: "avif" | "webp") {
  const hash = (hashes as Record<MenuId, string[]>)[menu][page - 1];
  return `/menu/${menu}/${nn(page)}-${hash}-${width}.${ext}`;
}

/** `srcset` for the fitted view. */
export function pageSrcSet(menu: MenuId, page: number, ext: "avif" | "webp", widths: ImageWidth[] = [450, 900]) {
  return widths.map((w) => `${pageImage(menu, page, w, ext)} ${w}w`).join(", ");
}

/** 1200×630 share image for a page. */
export function ogImage(menu: MenuId, page: number) {
  return `/og/menu/${menu}-${nn(page)}.jpg`;
}

/** "Dinner menu, page 4: Salads" */
export function pageAlt(menu: MenuId, page: number, locale: Locale) {
  const word = locale === "ru" ? "страница" : "page";
  return `${menuTitle(menu, locale)}, ${word} ${page}: ${pageTitle(menu, page, locale)}`;
}
