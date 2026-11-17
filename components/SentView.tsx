"use client";

import { Button, JellyfishIcon } from "@meduza/ui";
import { buildIcs, downloadIcs } from "@/lib/calendar";
import { formatDayLong } from "@/lib/format";
import { getDict } from "@/lib/i18n";
import { HOLD_POLICY_PLACEHOLDER, type Locale } from "@/lib/venue";

export type SentBooking = { reference: string; date: string; time: string; guests: number };

export function SentView({
  locale,
  booking,
  onAnother
}: {
  locale: Locale;
  booking: SentBooking;
  onAnother: () => void;
}) {
  const t = getDict(locale);

  function addToCalendar() {
    downloadIcs(
      `meduza-${booking.reference}.ics`,
      buildIcs({
        reference: booking.reference,
        date: booking.date,
        time: booking.time,
        guests: booking.guests,
        title: t.book.calendarTitle,
        note: t.book.calendarNote
      })
    );
  }

  return (
    <main className="bk-sent">
      <div className="bk-sent__photo">
        <img
          src="/photos/tank.jpg"
          width={1050}
          height={1400}
          alt={t.book.photoAlt}
          className="bk-sent__img"
        />
      </div>
      <div className="bk-sent__body">
        <span className="bk-sent__icon" aria-hidden="true">
          <JellyfishIcon size={32} />
        </span>
        <h1 className="bk-h1" role="status">
          {t.book.sentTitle}
        </h1>
        <p className="mz-body bk-sent__text">{t.book.sentText}</p>
        <dl className="bk-dl bk-sent__card">
          <dt>{t.book.summaryDate}</dt>
          <dd>{formatDayLong(booking.date, locale)}</dd>
          <dt>{t.book.summaryTime}</dt>
          <dd>{booking.time}</dd>
          <dt>{t.book.summaryGuests}</dt>
          <dd>{booking.guests}</dd>
          <dt>{t.book.reference}</dt>
          <dd>{booking.reference}</dd>
        </dl>
        <p className="mz-footnote mz-secondary">{HOLD_POLICY_PLACEHOLDER}</p>
        <div className="bk-sent__actions">
          <Button variant="inverse" size="lg" href={`/${locale}/booking/${booking.reference}`}>
            {t.book.viewBooking}
          </Button>
          <Button variant="secondary" size="lg" onClick={addToCalendar}>
            {t.book.addToCalendar}
          </Button>
          <Button variant="ghost" size="lg" onClick={onAnother}>
            {t.book.another}
          </Button>
        </div>
      </div>
    </main>
  );
}
