"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, IconButton, JellyfishIcon, formatPrice } from "@meduza/ui";
import { PageImage } from "@/components/menu/PageImage";
import { daypart, type Daypart } from "@/lib/daypart";
import { dayCards, eveningCards, type FeaturedCard } from "@/lib/featured";
import { getDict } from "@/lib/i18n";
import { STRENGTH_WORDS } from "@/lib/menu/cocktails";
import { pageTitle } from "@/lib/menu/manifest";
import type { Locale } from "@/lib/venue";
import { VENUE } from "@/lib/venue-info";

/**
 * Cocktails in the evening, brunch by day. The server picks the set for its own clock and passes it as
 * `initialDaypart`; the first browser render uses that same set (so hydration matches) and then
 * follows the real time, checking once a minute.
 */
export function FeaturedCarousel({ locale, initialDaypart }: { locale: Locale; initialDaypart: Daypart }) {
  const t = getDict(locale).home;
  const f = t.featured;
  const [part, setPart] = useState<Daypart>(initialDaypart);
  const track = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const tick = () => setPart(daypart(new Date()));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const evening = part === "evening";
  const cards = evening ? eveningCards() : dayCards();
  const seeAll = `/${locale}/menu/${evening ? "cocktails" : "brunch"}`;

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };

  const detail = (c: FeaturedCard) =>
    c.price ? formatPrice(c.price, locale) : c.from ? f.from(formatPrice(c.from, locale)) : c.note ? f.notes[c.note] : "";

  return (
    <section aria-labelledby="hm-feat" className="hm-section hm-feat" data-mood={evening ? undefined : "lantern"}>
      <div className="hm-feat__head">
        <div className="hm-feat__titles">
          <span className="mz-eyebrow">
            {evening ? f.eveningEyebrow : `${f.until} ${VENUE.brunchEnd.value}`}
          </span>
          <h2 id="hm-feat" className="hm-h2">
            {evening ? f.eveningTitle : f.dayTitle}
          </h2>
        </div>
        <div className="hm-feat__tools">
          <div className="hm-feat__nav hm-desktop-only">
            <IconButton aria-label={f.previous} onClick={() => scroll(-1)}>
              <ChevronLeftIcon size={20} />
            </IconButton>
            <IconButton aria-label={f.next} onClick={() => scroll(1)}>
              <ChevronRightIcon size={20} />
            </IconButton>
          </div>
          <Link href={seeAll} className="hm-feat__see">
            {f.seeAll}
          </Link>
        </div>
      </div>

      <ul className="hm-feat__track" ref={track} aria-label={f.label}>
        {cards.map((c) => {
          const name = pageTitle(c.menu, c.page, locale);
          const word = c.strength ? STRENGTH_WORDS[locale][c.strength] : null;
          // The visible text (name and price) comes first and unbroken, as the accessible name must contain it.
          const label = [`${name} ${detail(c)}`.trim(), word ? f.strengthLabel(word) : null].filter(Boolean).join(", ");
          return (
            <li key={`${c.menu}-${c.page}`}>
              <Link href={`/${locale}/menu/${c.menu}?page=${c.page}`} prefetch={false} className="hm-fcard" aria-label={label}>
                <span className="hm-fcard__img">
                  <PageImage
                    menu={c.menu}
                    page={c.page}
                    locale={locale}
                    sizes="(min-width: 900px) 260px, 188px"
                    widths={[450, 900]}
                    alt=""
                  />
                </span>
                <span className="hm-fcard__name">{name}</span>{" "}
                <span className="hm-fcard__meta">
                  {c.strength ? (
                    <span className="hm-jelly" aria-hidden="true">
                      {Array.from({ length: c.strength }, (_, i) => (
                        <JellyfishIcon key={i} size={13} />
                      ))}
                    </span>
                  ) : null}
                  <span>{detail(c)}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
