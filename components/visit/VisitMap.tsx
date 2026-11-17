import { LocationIcon } from "@meduza/ui";
import { getDict } from "@/lib/i18n";
import type { Locale } from "@/lib/venue";
import { VENUE, directionsHref } from "@/lib/venue-info";

/**
 * The map slot. While the embed address is a placeholder it is a dark block with a glowing pin, the
 * address and a link to the maps app (the bracketed marker stays visible so it is not forgotten).
 * Once `VENUE.mapEmbed` holds a real https address it becomes the embedded map.
 */
export function VisitMap({ locale, venue = VENUE }: { locale: Locale; venue?: typeof VENUE }) {
  const t = getDict(locale).visit;
  const embed = venue.mapEmbed;
  const configured = !embed.placeholder && /^https:\/\//.test(embed.value);

  return (
    <div className="vs-map">
      {configured ? (
        <iframe
          className="vs-map__frame"
          src={embed.value}
          title={t.mapLabel}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
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
