"use client";

import { usePathname } from "next/navigation";
import { CalendarIcon, JellyfishIcon, LocationIcon, MenuBookIcon, TabBar } from "@meduza/ui";
import { renderLink } from "@/components/renderLink";
import { getDict } from "@/lib/i18n";
import { sectionOf } from "@/lib/sections";
import type { Locale } from "@/lib/venue";

/** Phone tab bar: exactly four tabs, Book always one tap away (hidden from 900 px). */
export function SiteTabBar({ locale }: { locale: Locale }) {
  const t = getDict(locale).nav;
  const section = sectionOf(usePathname());
  const items = [
    { href: `/${locale}`, label: t.home, icon: <JellyfishIcon size={22} />, current: section === "home" },
    { href: `/${locale}/menu`, label: t.menu, icon: <MenuBookIcon size={22} />, current: section === "menu" },
    { href: `/${locale}/book`, label: t.book, icon: <CalendarIcon size={22} />, current: section === "book" },
    { href: `/${locale}/visit`, label: t.visit, icon: <LocationIcon size={22} />, current: section === "visit" }
  ];
  return <TabBar className="site-tabbar" label={t.tabs} items={items} renderLink={renderLink} />;
}
