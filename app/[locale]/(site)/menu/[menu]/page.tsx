import "../../../../menu.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MenuReader } from "@/components/menu/MenuReader";
import { MenuTextLayer } from "@/components/menu/MenuTextLayer";
import { getDict } from "@/lib/i18n";
import { clampPage, isMenuId, menuTitle, ogImage, pageTitle } from "@/lib/menu/manifest";
import { pageMetadata } from "@/lib/metadata";
import { isLocale } from "@/lib/venue";

type Props = {
  params: Promise<{ locale: string; menu: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale, menu } = await params;
  if (!isLocale(locale) || !isMenuId(menu)) return {};
  const page = clampPage(menu, (await searchParams).page);
  const t = getDict(locale);
  const title = `${menuTitle(menu, locale)}${page > 1 ? ` · ${pageTitle(menu, page, locale)}` : ""} — ${t.brand}`;
  const base = pageMetadata(locale, `/menu/${menu}?page=${page}`, title);
  return {
    ...base,
    openGraph: {
      type: "website",
      title,
      description: t.meta.description,
      siteName: t.brand,
      images: [{ url: ogImage(menu, page), width: 1200, height: 630, alt: title }]
    },
    twitter: { card: "summary_large_image", title, description: t.meta.description, images: [ogImage(menu, page)] }
  };
}

/** The printed-menu reader. `?page=N` opens that page (clamped); no number opens page 2. */
export default async function MenuPage({ params, searchParams }: Props) {
  const { locale, menu } = await params;
  if (!isLocale(locale) || !isMenuId(menu)) notFound();
  const page = clampPage(menu, (await searchParams).page);
  return (
    <>
      <MenuReader key={menu} locale={locale} menu={menu} initialPage={page} />
      <MenuTextLayer menu={menu} locale={locale} />
    </>
  );
}
