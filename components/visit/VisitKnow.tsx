import { getDict } from "@/lib/i18n";
import type { Locale } from "@/lib/venue";
import { VENUE } from "@/lib/venue-info";

/** "Good to know": 2×2 tiles. The facts the owner has not confirmed stay as bracketed placeholders. */
export function VisitKnow({ locale }: { locale: Locale }) {
  const t = getDict(locale).visit;
  const tiles = [
    { label: t.dress, value: VENUE.dressCode.value, placeholder: VENUE.dressCode.placeholder },
    { label: t.payment, value: VENUE.payment.value, placeholder: VENUE.payment.placeholder },
    { label: t.hookah, value: VENUE.hookahRule.value, placeholder: VENUE.hookahRule.placeholder },
    { label: t.languages, value: t.languagesValue, placeholder: false }
  ];
  return (
    <section className="vs-block" aria-labelledby="vs-know">
      <h2 id="vs-know" className="vs-h2">{t.knowTitle}</h2>
      <ul className="vs-tiles">
        {tiles.map((tile) => (
          <li key={tile.label} className="vs-tile">
            <span className="vs-tile__label">{tile.label}</span>
            <span className="vs-tile__value" data-placeholder={tile.placeholder ? "true" : undefined}>{tile.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
