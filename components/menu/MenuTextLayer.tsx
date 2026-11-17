import { formatPrice } from "@meduza/ui";
import { COCKTAILS, STRENGTH_WORDS } from "@/lib/menu/cocktails";
import { FOOD_MENUS, type MenuItem } from "@/lib/menu/items";
import { menuTitle, type MenuId } from "@/lib/menu/manifest";
import { getDict } from "@/lib/i18n";
import type { Locale } from "@/lib/venue";

const other = (l: Locale): Locale => (l === "en" ? "ru" : "en");

/** A dietary marker is only published once the owner has confirmed it. */
const confirmed = (item: MenuItem, marker: "veg" | "spicy") => item[marker] && !item.unconfirmed?.includes(marker);

/**
 * The whole menu as plain text for search engines and screen readers. It is visually hidden (not
 * display:none), and it is never shown as a second, list-style menu. Only what the printed
 * menus contain is listed: wine, spirits and the rest of the bar are not here until supplied.
 */
export function MenuTextLayer({ menu, locale }: { menu: MenuId; locale: Locale }) {
  const t = getDict(locale).menu;
  const title = menuTitle(menu, locale);
  const alt = other(locale);

  return (
    <section className="mz-visually-hidden mr-text" aria-labelledby="menu-text-title">
      <h2 id="menu-text-title">{t.textLayerTitle(title)}</h2>

      {menu === "cocktails" ? (
        <>
          <p>{t.vatDrinks}</p>
          <ul>
            {COCKTAILS.map((c) => (
              <li key={c.page}>
                <h3>{c.name}</h3>
                <p>{c.ingredients.join(", ")}</p>
                <p>
                  {t.strength}: {STRENGTH_WORDS[locale][c.strength]}
                </p>
                <p>{formatPrice(c.price, locale)}</p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <p>{t.vatFood}</p>
          {FOOD_MENUS[menu].map((section) => (
            <section key={section.id}>
              <h3>{section.title[locale]}</h3>
              <ul>
                {section.items.map((item) => {
                  const names = locale === "en" ? [item.name, item.ru] : [item.ru, item.name];
                  return (
                    <li key={item.name}>
                      <span lang={locale}>{names[0]}</span> / <span lang={alt}>{names[1]}</span>
                      {item.price ? <> — {formatPrice(item.price, locale)}</> : null}
                      {confirmed(item, "veg") ? <> ({t.vegetarian})</> : null}
                      {confirmed(item, "spicy") ? <> ({t.spicy})</> : null}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </>
      )}
    </section>
  );
}
