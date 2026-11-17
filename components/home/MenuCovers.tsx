import Image from "next/image";
import Link from "next/link";
import { getDict } from "@/lib/i18n";
import type { Locale } from "@/lib/venue";

const MENUS = [
  { id: "brunch", pages: 7, src: "/photos/cover-brunch.jpg" },
  { id: "cocktails", pages: 12, src: "/photos/cover-cocktails.jpg" },
  { id: "dinner", pages: 14, src: "/photos/cover-dinner.jpg" }
] as const;

/** "Our menus": the three printed covers, each opening that menu in the reader. */
export function MenuCovers({ locale }: { locale: Locale }) {
  const t = getDict(locale).home;
  return (
    <section aria-labelledby="hm-menus" className="hm-section">
      <div className="hm-menus">
        <div className="hm-menus__intro">
          <div className="hm-menus__head">
            <h2 id="hm-menus" className="hm-h2">
              <span className="hm-phone-only">{t.menusTitle}</span>
              <span className="hm-desktop-only">{t.menusDesktopTitle}</span>
            </h2>
            <span className="hm-menus__note hm-phone-only">{t.menusNote}</span>
          </div>
          <p className="hm-menus__text hm-desktop-only">{t.menusDesktopText}</p>
          <Link className="mz-btn mz-btn--inverse mz-btn--lg hm-desktop-only" href={`/${locale}/menu`}>
            {t.openMenu}
          </Link>
        </div>
        <div className="hm-covers">
          {MENUS.map((m) => (
            <Link key={m.id} href={`/${locale}/menu/${m.id}`} className="hm-cover">
              <Image className="hm-cover__img" src={m.src} alt="" width={910} height={1287} sizes="(min-width: 900px) 20vw, 30vw" quality={70} />
              <span className="hm-cover__name">{t.menuNames[m.id]}</span>
              <span className="hm-cover__pages">{t.pages(m.pages)}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
