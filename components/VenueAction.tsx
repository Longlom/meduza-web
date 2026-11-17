import type { ReactNode } from "react";
import { VENUE, contactHref, type ContactKind, type VenueRecord } from "@/lib/venue-info";

const valueOf = (venue: VenueRecord) =>
  ({
    phone: venue.phone,
    telegram: venue.telegram,
    zalo: venue.zalo,
    instagram: venue.instagram,
    grab: venue.grabPickup,
    directions: venue.address
  }) as const;

/**
 * A contact action (call, message, directions, …). It is a real link only when the value is
 * confirmed. While the value is a placeholder it renders plain, non-interactive text that shows
 * the bracketed marker, so there is never a dead phone link.
 */
export function VenueAction({
  kind,
  className,
  children,
  venue = VENUE
}: {
  kind: ContactKind;
  className?: string;
  children: ReactNode;
  /** Only for tests: lets a test supply confirmed values. */
  venue?: VenueRecord;
}) {
  const href = contactHref(kind, venue);
  const value = valueOf(venue)[kind];
  if (href) {
    const external = href.startsWith("http");
    return (
      <a
        className={className}
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : null)}
      >
        {children}
      </a>
    );
  }
  return (
    <span className={className} data-placeholder="true" aria-disabled="true">
      {children}
      {value.placeholder ? <small className="bk-placeholder">{value.value}</small> : null}
    </span>
  );
}

/**
 * A contact value as text: the value itself, as a link when confirmed (for example the phone
 * number in the visit block). A placeholder stays plain text.
 */
export function VenueText({ kind, venue = VENUE }: { kind: ContactKind; venue?: VenueRecord }) {
  const href = contactHref(kind, venue);
  const value = valueOf(venue)[kind].value;
  return href ? <a href={href}>{value}</a> : <span data-placeholder="true">{value}</span>;
}
