import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import type { Locale } from "@/lib/venue";

/** Public site address, used to turn relative metadata URLs into absolute ones. */
export const SITE_URL = process.env.SITE_URL ?? "https://meduza-nt.com";

/** Title, description and language alternates for a page. `path` is the part after the locale, e.g. "/visit". */
export function pageMetadata(locale: Locale, path: string, title: string): Metadata {
  const t = getDict(locale);
  return {
    title,
    description: t.meta.description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { en: `/en${path}`, ru: `/ru${path}`, "x-default": `/en${path}` }
    }
  };
}
