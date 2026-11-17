import { useEffect, useRef } from "react";
import { getDict } from "@/lib/i18n";
import { MENUS, pageCount, pageTitle, type MenuId } from "@/lib/menu/manifest";
import type { Locale } from "@/lib/venue";
import { PageImage } from "@/components/menu/PageImage";

/** Every page of a menu with a thumbnail, number and title; the current page(s) are marked. */
export function ContentsList({
  menu,
  locale,
  current,
  onPick
}: {
  menu: MenuId;
  locale: Locale;
  current: number[];
  onPick: (page: number) => void;
}) {
  const t = getDict(locale).menu;
  const total = pageCount(menu);
  const list = useRef<HTMLUListElement>(null);

  // A thumbnail that failed before the page hydrated (offline, not cached) shows the browser's
  // broken-image icon; hide those, and any that fail later (see onError below).
  useEffect(() => {
    list.current?.querySelectorAll("img").forEach((img) => {
      if (img.complete && img.naturalWidth === 0 && img.currentSrc) img.style.visibility = "hidden";
    });
  });

  return (
    <ul className="mr-toc" ref={list}>
      {MENUS[menu].pages.map((_, i) => {
        const page = i + 1;
        const on = current.includes(page);
        return (
          <li key={page}>
            <button type="button" className="mr-toc__item" aria-current={on ? "page" : undefined} onClick={() => onPick(page)}>
              <span className="mr-toc__thumb">
                <PageImage
                  menu={menu}
                  page={page}
                  locale={locale}
                  sizes="40px"
                  widths={[450]}
                  fallbackWidth={450}
                  alt=""
                  onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                />
              </span>
              <span className="mr-toc__label">{pageTitle(menu, page, locale)}</span>
              <span className="mr-toc__num">{t.pageNumber(page, total)}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
