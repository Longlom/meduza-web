import Link from "next/link";
import { LocationIcon, MenuBookIcon, MessageIcon, PhoneIcon } from "@meduza/ui";
import { VenueAction } from "@/components/VenueAction";
import { getDict } from "@/lib/i18n";
import type { Locale } from "@/lib/venue";
import { telegramAvailable } from "@/lib/venue-info";

/** Menu, Call, Directions, Message. Call and Message are links only once their values are confirmed. */
export function QuickActions({ locale }: { locale: Locale }) {
  const t = getDict(locale).home;
  return (
    <nav aria-label={t.quickLabel} className="hm-actions">
      <Link href={`/${locale}/menu`} className="hm-action">
        <span className="hm-action__icon"><MenuBookIcon size={24} /></span>
        {t.actionMenu}
      </Link>
      <VenueAction kind="phone" className="hm-action">
        <span className="hm-action__icon"><PhoneIcon size={24} /></span>
        {t.actionCall}
      </VenueAction>
      <VenueAction kind="directions" className="hm-action">
        <span className="hm-action__icon"><LocationIcon size={24} /></span>
        {t.actionDirections}
      </VenueAction>
      {telegramAvailable() ? (
        <VenueAction kind="telegram" className="hm-action">
          <span className="hm-action__icon"><MessageIcon size={24} /></span>
          {t.actionMessage}
        </VenueAction>
      ) : null}
    </nav>
  );
}
