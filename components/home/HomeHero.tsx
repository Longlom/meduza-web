import Image from "next/image";
import Link from "next/link";
import { OpenStatus } from "@/components/OpenStatus";
import { getDict } from "@/lib/i18n";
import type { Locale } from "@/lib/venue";

/** Tank photo, live status, headline, intro and the one filled "Book a table" button. */
export function HomeHero({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  return (
    <header className="hm-hero">
      <Image
        className="hm-hero__img"
        src="/photos/tank.jpg"
        alt={t.home.heroAlt}
        width={1050}
        height={1400}
        sizes="100vw"
        quality={70}
        priority
        fetchPriority="high"
      />
      <div className="hm-hero__scrim" aria-hidden="true" />
      <Link href={`/${locale}`} className="hm-hero__logo" aria-label={t.brand}>
        <img src="/logo/logo-white-sm.png" width={192} height={135} alt="" />
      </Link>
      <div className="hm-hero__content">
        <OpenStatus locale={locale} className="hm-badge" />
        <h1 className="hm-hero__title">
          {t.home.headlineLead} <em className="mz-accent-serif">{t.home.headlineAccent}</em>
        </h1>
        <p className="hm-hero__intro">{t.home.intro}</p>
        <div className="hm-hero__ctas">
          <Link className="mz-btn mz-btn--primary mz-btn--lg mz-btn--glow" href={`/${locale}/book`}>
            {t.home.book}
          </Link>
          <Link className="mz-btn mz-btn--secondary mz-btn--lg hm-desktop-only" href={`/${locale}/menu`}>
            {t.home.openMenu}
          </Link>
        </div>
      </div>
    </header>
  );
}
