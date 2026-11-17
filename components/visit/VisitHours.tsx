import { OpenStatus } from "@/components/OpenStatus";
import { VenueText } from "@/components/VenueAction";
import { getDict } from "@/lib/i18n";
import { OPEN_FROM, OPEN_TO, type Locale } from "@/lib/venue";
import { VENUE } from "@/lib/venue-info";

/** Hours card: live open/closed badge, the daily hours, then brunch and kitchen rows (placeholders until confirmed). */
export function VisitHours({ locale }: { locale: Locale }) {
  const t = getDict(locale).visit;
  const row = (label: string, value: { value: string; placeholder: boolean }) => (
    <div className="vs-row">
      <dt>{label}</dt>
      <dd data-placeholder={value.placeholder ? "true" : undefined}>{value.value}</dd>
    </div>
  );
  return (
    <section className="mz-card vs-card" aria-labelledby="vs-hours">
      <div className="vs-card__head">
        <h2 id="vs-hours" className="vs-h2">{t.hoursTitle}</h2>
        <OpenStatus locale={locale} />
      </div>
      <dl className="vs-rows">
        <div className="vs-row">
          <dt>{t.everyDay}</dt>
          <dd className="vs-tabular">{OPEN_FROM} – {OPEN_TO}</dd>
        </div>
        {row(t.brunch, VENUE.brunchHours)}
        {row(t.kitchen, VENUE.kitchenCloses)}
      </dl>
      <p className="vs-note">{t.timezone}</p>
    </section>
  );
}
