"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavBar } from "@meduza/ui";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { renderLink } from "@/components/renderLink";
import { getDict } from "@/lib/i18n";
import { sectionOf } from "@/lib/sections";
import type { Locale } from "@/lib/venue";

/** Floating glass navigation for desktop (hidden below 900 px, where the tab bar is used). */
export function SiteNav({ locale }: { locale: Locale }) {
  const t = getDict(locale).nav;
  const section = sectionOf(usePathname());
  const links = [
    { href: `/${locale}/menu`, label: t.menu, current: section === "menu" },
    { href: `/${locale}/book`, label: t.book, current: section === "book" },
    { href: `/${locale}/visit`, label: t.visit, current: section === "visit" }
  ];

  return (
    <div className="site-nav">
      <NavBar
        label={t.main}
        renderLink={renderLink}
        links={links}
        brand={
          <Link href={`/${locale}`} aria-label={t.home} className="site-logo">
            <img src="/logo/logo-white-sm.png" width={192} height={135} alt="" loading="lazy" />
          </Link>
        }
        actions={
          <>
            <span className="mz-footnote mz-secondary">{t.vietnamTime}</span>
            <LanguageSwitch locale={locale} />
            {section !== "book" ? (
              <Link className="mz-btn mz-btn--primary mz-btn--sm" href={`/${locale}/book`}>
                {t.bookCta}
              </Link>
            ) : null}
          </>
        }
      />
    </div>
  );
}
