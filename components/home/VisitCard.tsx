import Link from "next/link";
import { Theme } from "@meduza/ui";
import { VenueAction, VenueText } from "@/components/VenueAction";
import { getDict } from "@/lib/i18n";
import { OPEN_FROM, OPEN_TO, type Locale } from "@/lib/venue";
import { VENUE } from "@/lib/venue-info";

/** Light (Pearl) card on the dark page: hours, address and the way to the Visit page. */
export function VisitCard({ locale }: { locale: Locale }) {
  const t = getDict(locale).home;
  const hours = `${OPEN_FROM} – ${OPEN_TO}`;
  return (
    <section className="hm-section" aria-labelledby="hm-visit">
      <Theme theme="pearl" className="hm-visit">
        <h2 id="hm-visit" className="hm-visit__title">
          {t.visitLead} <em className="mz-accent-serif">{t.visitAccent}</em>
        </h2>

        {/* Phone */}
        <div className="hm-visit__lines hm-phone-only">
          <span>
            <span className="mz-secondary">{t.daily}</span> · {hours}
          </span>
          <span>{VENUE.address.value}</span>
        </div>
        <Link className="mz-btn mz-btn--inverse mz-btn--md hm-phone-only" href={`/${locale}/visit`}>
          {t.visitCta}
        </Link>

        {/* Desktop */}
        <dl className="hm-visit__dl hm-desktop-only">
          <dt>{t.hoursLabel}</dt>
          <dd>{t.daily} · {hours}</dd>
          <dt>{t.addressLabel}</dt>
          <dd>{VENUE.address.value}</dd>
          <dt>{t.phoneLabel}</dt>
          <dd><VenueText kind="phone" /></dd>
        </dl>
        <div className="hm-visit__ctas hm-desktop-only">
          <Link className="mz-btn mz-btn--inverse mz-btn--md" href={`/${locale}/book`}>
            {t.book}
          </Link>
          <VenueAction kind="directions" className="mz-btn mz-btn--secondary mz-btn--md">
            {t.getDirections}
          </VenueAction>
        </div>
      </Theme>
    </section>
  );
}
