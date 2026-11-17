import Image from "next/image";
import Link from "next/link";
import { getDict } from "@/lib/i18n";
import { formatPrice, formatPriceCompact } from "@meduza/ui";
import { HOOKAH_FROM_VND, VENUE } from "@/lib/venue-info";
import { OPEN_TO, type Locale } from "@/lib/venue";

type Card = {
  key: string;
  href: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  eyebrow: string;
  title: React.ReactNode;
  desc: string;
  lantern?: boolean;
  focus?: string;
};

/** "Brunch to last call": Brunch, Dinner and Lounge. Brunch and Dinner lead with the Lantern accent. */
export function ExperienceCards({ locale }: { locale: Locale }) {
  const t = getDict(locale).home;
  const cards: Card[] = [
    {
      key: "brunch",
      href: `/${locale}/menu/brunch`,
      src: "/photos/brunch.jpg",
      width: 910,
      height: 1287,
      alt: t.brunch.alt,
      eyebrow: `${t.brunch.eyebrow} · ${VENUE.brunchHours.value}`,
      title: t.brunch.title,
      desc: t.brunch.desc,
      lantern: true,
      focus: "50% 62%"
    },
    {
      key: "dinner",
      href: `/${locale}/menu/dinner`,
      src: "/photos/dinner.jpg",
      width: 910,
      height: 1287,
      alt: t.dinner.alt,
      eyebrow: `${t.dinner.eyebrow} · ${VENUE.dinnerHours.value}`,
      title: t.dinner.title,
      desc: t.dinner.desc,
      lantern: true,
      focus: "50% 78%"
    },
    {
      key: "lounge",
      href: `/${locale}/menu/cocktails`,
      src: "/photos/lounge.jpg",
      width: 1050,
      height: 1400,
      alt: t.lounge.alt,
      eyebrow: t.lounge.eyebrow(OPEN_TO),
      title: (
        <>
          <span className="hm-phone-only">{t.lounge.title(formatPriceCompact(HOOKAH_FROM_VND, locale))}</span>
          <span className="hm-desktop-only">{t.lounge.titleDesktop}</span>
        </>
      ),
      desc: t.lounge.desc(formatPrice(HOOKAH_FROM_VND, locale))
    }
  ];

  return (
    <section aria-labelledby="hm-exp" className="hm-section">
      <h2 id="hm-exp" className="hm-h2">
        {t.expTitle}
        <span className="hm-h2__muted hm-desktop-only"> {t.expTitleMuted}</span>
      </h2>
      <div className="hm-cards">
        {cards.map((c) => (
          <Link key={c.key} href={c.href} className="hm-card" data-mood={c.lantern ? "lantern" : undefined}>
            <Image
              className="hm-card__img"
              src={c.src}
              alt={c.alt}
              width={c.width}
              height={c.height}
              sizes="(min-width: 900px) 33vw, 100vw"
              quality={70}
              style={c.focus ? { objectPosition: c.focus } : undefined}
            />
            <div className="hm-card__scrim" aria-hidden="true" />
            <div className="hm-card__body">
              <span className="mz-eyebrow">{c.eyebrow}</span>
              <span className="hm-card__title">{c.title}</span>
              <span className="hm-card__desc hm-desktop-only">{c.desc}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
