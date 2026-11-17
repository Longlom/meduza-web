import { ChevronRightIcon } from "@meduza/ui";
import { getDict } from "@/lib/i18n";
import type { Locale } from "@/lib/venue";
import { VENUE, contactHref, telegramAvailable, type ContactKind, type VenueRecord } from "@/lib/venue-info";

const ROWS = [
  { kind: "telegram", mark: "TG" },
  { kind: "zalo", mark: "Z" },
  { kind: "instagram", mark: "IG" },
  { kind: "phone", mark: "Tel" }
] as const satisfies readonly { kind: ContactKind; mark: string }[];

/**
 * "Talk to the hostess": four rows. A row is a link only when its value is confirmed; a placeholder
 * row is plain text showing the bracketed marker (never a dead link).
 */
export function VisitContacts({ locale, venue = VENUE }: { locale: Locale; venue?: VenueRecord }) {
  const t = getDict(locale).visit;
  return (
    <section className="vs-block" aria-labelledby="vs-contact">
      <h2 id="vs-contact" className="vs-h2">{t.contactTitle}</h2>
      <ul className="mz-card mz-card--flush vs-list">
        {ROWS.filter((r) => r.kind !== "telegram" || telegramAvailable(venue)).map(({ kind, mark }) => {
          const value = venue[kind];
          const href = contactHref(kind, venue);
          const body = (
            <>
              <span className="vs-list__mark" aria-hidden="true">{mark}</span>
              <span className="vs-list__text">
                <span className="vs-list__name">{t.contacts[kind]}</span>
                <span className="vs-list__value" data-placeholder={value.placeholder ? "true" : undefined}>{value.value}</span>
              </span>
              {href ? <ChevronRightIcon size={20} className="vs-list__chev" aria-hidden="true" /> : null}
            </>
          );
          return (
            <li key={kind}>
              {href ? (
                <a
                  className="vs-list__row"
                  href={href}
                  {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : null)}
                >
                  {body}
                </a>
              ) : (
                <div className="vs-list__row" data-placeholder="true">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
