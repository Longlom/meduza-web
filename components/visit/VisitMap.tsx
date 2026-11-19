import { LocationIcon } from "@meduza/ui";
import { getDict } from "@/lib/i18n";
import type { Locale } from "@/lib/venue";
import { VENUE, directionsHref } from "@/lib/venue-info";

/**
 * The map block: an OpenStreetMap embed (no key, no sign-up) when `VENUE.mapEmbed` holds an https
 * address, otherwise a dark block with a glowing pin. The map is centred on the venue and the app draws
 * the pin. It is a picture, not a scroll trap: it is not interactive, and a tap anywhere on it opens the
 * place in Google Maps.
 */
export function VisitMap({ locale, venue = VENUE }: { locale: Locale; venue?: typeof VENUE }) {
  const t = getDict(locale).visit;
  const embed = venue.mapEmbed;
  const configured = !embed.placeholder && /^https:\/\//.test(embed.value);

  return (
    <div className="vs-map">
      {configured ? (
        <>
          <iframe
            className="vs-map__frame"
            src={embed.value}
            title={t.mapLabel}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            tabIndex={-1}
          />
          <span className="vs-map__pin vs-map__pin--on-map" aria-hidden="true">
            <LocationIcon size={28} />
          </span>
          <a
            className="vs-map__tap"
            href={directionsHref()}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={-1}
            aria-hidden="true"
          />
          <a
            className="vs-map__credit"
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.mapCredit}
          </a>
        </>
      ) : (
        <div className="vs-map__slot" role="img" aria-label={t.mapLabel}>
          <span className="vs-map__pin" aria-hidden="true">
            <LocationIcon size={28} />
          </span>
          <small className="vs-map__marker bk-placeholder" data-placeholder="true">{embed.value}</small>
        </div>
      )}
      <a className="mz-btn mz-btn--secondary mz-btn--sm vs-map__link" href={directionsHref()} target="_blank" rel="noopener noreferrer">
        {t.openInMaps}
      </a>
      <div className="vs-map__fade" aria-hidden="true" />
    </div>
  );
}
