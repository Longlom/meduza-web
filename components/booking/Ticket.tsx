"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BottomSheet,
  Button,
  CalendarIcon,
  CheckIcon,
  EditIcon,
  LocationIcon,
  MessageIcon
} from "@meduza/ui";
import { VenueAction } from "@/components/VenueAction";
import { buildIcs, downloadIcs } from "@/lib/calendar";
import { formatDayShort, formatVenueTime } from "@/lib/format";
import { getDict } from "@/lib/i18n";
import {
  getBooking,
  hasPassed,
  markCancelled,
  useMyBookings,
  type MyBooking
} from "@/lib/my-bookings";
import type { Locale } from "@/lib/venue";
import type { ErrorCode } from "@/lib/validation";

/** Buttons hidden for now. The change flow (/book?change=…), the cancel sheet and /api/booking/cancel still work; set a flag to true to bring its button back. */
const SHOW_CHANGE = false;
const SHOW_CANCEL = false;
const SHOW_ANOTHER = false;

type Step = { key: string; label: string; sub: string; time: string; done: boolean; href?: string };

/** The ticket page body. It reads the record from this device, so it is a client component. */
export function Ticket({ locale, reference }: { locale: Locale; reference: string }) {
  const t = getDict(locale).ticket;
  const bookings = useMyBookings();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  // null on the server and while hydrating: show a quiet placeholder, never "not found" by mistake.
  if (bookings === null) {
    return (
      <main className="tk">
        <h1 className="tk-title">{t.title}</h1>
        <div className="tk-skel" aria-busy="true" aria-label={t.loading} />
      </main>
    );
  }

  const booking = getBooking(bookings, reference);
  if (!booking) return <Unknown locale={locale} />;
  return <TicketBody locale={locale} booking={booking} now={now} />;
}

function Unknown({ locale }: { locale: Locale }) {
  const t = getDict(locale).ticket;
  return (
    <main className="tk tk--unknown">
      <h1 className="tk-title">{t.unknownTitle}</h1>
      <p className="mz-body mz-secondary">{t.unknownText}</p>
      <div className="tk-unknown__actions">
        <Button variant="inverse" size="lg" href={`/${locale}/book`}>
          {t.newBooking}
        </Button>
        <VenueAction kind="telegram" className="mz-btn mz-btn--secondary mz-btn--lg">
          {t.messageUs}
        </VenueAction>
      </div>
    </main>
  );
}

function TicketBody({ locale, booking, now }: { locale: Locale; booking: MyBooking; now: Date | null }) {
  const dict = getDict(locale);
  const t = dict.ticket;
  const [sheet, setSheet] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<ErrorCode | "network" | null>(null);
  const [cancelledNote, setCancelledNote] = useState(false);

  const pending = booking.status === "pending";
  // Change and Cancel only before the booked time. Until the clock is known we assume it has not passed.
  const open = pending && !(now && hasPassed(booking, now));

  const label =
    booking.status === "pending" ? t.statusPending : booking.status === "cancelled" ? t.statusCancelled : t.statusChanged;
  // Pending needs no note: the booking is simply shown. Cancelled and changed say what happened.
  const note = booking.status === "cancelled" ? t.cancelledNote : booking.status === "changed" ? t.changedNote : "";

  const steps: Step[] = [
    { key: "sent", label: t.sent, sub: "", time: formatVenueTime(booking.sentAt), done: true }
  ];
  if (booking.status === "pending") {
    steps.push(
      {
        key: "arrive",
        label: t.arrive,
        sub: `${formatDayShort(booking.date, locale)} · ${booking.time}`,
        time: "",
        done: false
      }
    );
  } else if (booking.status === "cancelled") {
    steps.push({
      key: "cancel",
      label: t.cancelRequested,
      sub: t.cancelRequestedSub,
      time: booking.closedAt ? formatVenueTime(booking.closedAt) : "",
      done: true
    });
  } else {
    steps.push({
      key: "change",
      label: t.changeRequested,
      sub: t.changeRequestedSub,
      time: booking.closedAt ? formatVenueTime(booking.closedAt) : "",
      done: true,
      href: booking.replacedBy ? `/${locale}/booking/${booking.replacedBy}` : undefined
    });
  }

  function addToCalendar() {
    downloadIcs(
      `meduza-${booking.reference}.ics`,
      buildIcs({
        reference: booking.reference,
        date: booking.date,
        time: booking.time,
        guests: booking.guests,
        title: dict.book.calendarTitle,
        note: dict.book.calendarNote
      })
    );
  }

  async function confirmCancel() {
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/booking/cancel", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          reference: booking.reference,
          date: booking.date,
          time: booking.time,
          name: booking.name,
          phone: booking.phone,
          locale,
          website: ""
        })
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: ErrorCode };
      if (res.ok && data.ok) {
        markCancelled(booking.reference);
        setCancelledNote(true);
        setSheet(false);
      } else {
        setError(data.error ?? "server");
      }
    } catch {
      setError("network");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="tk">
      <h1 className="tk-title">{t.title}</h1>

      <div className="tk-layout">
        <article className="tk-ticket" data-status={booking.status}>
          <div className="tk-ticket__photo">
            <Image
              src="/photos/lounge.jpg"
              alt={t.photoAlt}
              width={1050}
              height={1400}
              sizes="(min-width: 900px) 520px, 100vw"
              quality={70}
              priority
              className="tk-ticket__img"
            />
            <div className="tk-ticket__fade" aria-hidden="true" />
            <span className="tk-badge" role="status">
              <span className="tk-badge__dot" aria-hidden="true" />
              {label}
            </span>
          </div>
          <div className="tk-ticket__body">
            <div className="tk-ticket__when">
              <span className="tk-ticket__date">
                {formatDayShort(booking.date, locale)} · {booking.time}
              </span>
              <span className="mz-secondary">{t.guests(booking.guests)}</span>
            </div>
            <div className="tk-ticket__tear" aria-hidden="true" />
            <div className="tk-ticket__ref">
              <span>{t.reference}</span>
              <span className="tk-ticket__refvalue">{booking.reference}</span>
            </div>
            {note ? <p className="tk-ticket__note">{note}</p> : null}
            {cancelledNote ? (
              <p className="tk-ticket__note tk-ticket__note--ok" role="status">
                {t.cancelSent}
              </p>
            ) : null}
          </div>
        </article>

        <div className="tk-side">
          <ol className="tk-timeline" aria-label={t.timelineLabel}>
            {steps.map((s, i) => (
              <li key={s.key} className="tk-step" data-done={s.done}>
                <span className="tk-step__rail" aria-hidden="true">
                  <span className="tk-step__dot">{s.done ? <CheckIcon size={12} /> : null}</span>
                  {i < steps.length - 1 ? <span className="tk-step__line" /> : null}
                </span>
                <span className="tk-step__text">
                  <span className="tk-step__label">{s.label}</span>
                  {s.href || s.sub ? (
                    <span className="tk-step__sub">{s.href ? <Link href={s.href}>{t.viewNew}</Link> : s.sub}</span>
                  ) : null}
                </span>
                <span className="tk-step__time">{s.time}</span>
              </li>
            ))}
          </ol>

          <div className="tk-actions" role="group" aria-label={t.actionsLabel}>
            {pending ? (
              <>
                <VenueAction kind="directions" className="tk-tile">
                  <LocationIcon size={20} aria-hidden="true" />
                  <span>{t.directions}</span>
                </VenueAction>
                <VenueAction kind="telegram" className="tk-tile">
                  <MessageIcon size={20} aria-hidden="true" />
                  <span>{t.messageUs}</span>
                </VenueAction>
                <button type="button" className="tk-tile" onClick={addToCalendar}>
                  <CalendarIcon size={20} aria-hidden="true" />
                  <span>{t.addToCalendar}</span>
                </button>
                {SHOW_CHANGE && open ? (
                  <Link className="tk-tile" href={`/${locale}/book?change=${booking.reference}`}>
                    <EditIcon size={20} aria-hidden="true" />
                    <span>{t.change}</span>
                  </Link>
                ) : null}
              </>
            ) : (
              <>
                <Button variant="inverse" size="lg" href={`/${locale}/book`}>
                  {t.newBooking}
                </Button>
                <VenueAction kind="telegram" className="tk-tile">
                  <MessageIcon size={20} aria-hidden="true" />
                  <span>{t.messageUs}</span>
                </VenueAction>
              </>
            )}
          </div>

          {SHOW_CANCEL && open ? (
            <button type="button" className="tk-cancel" onClick={() => setSheet(true)}>
              {t.cancel}
            </button>
          ) : null}
          {SHOW_ANOTHER && pending ? (
            <Link className="tk-another" href={`/${locale}/book`}>
              {t.another}
            </Link>
          ) : null}
        </div>
      </div>

      <BottomSheet
        open={sheet}
        onClose={() => (sending ? undefined : setSheet(false))}
        label={t.cancelTitle}
        title={t.cancelTitle}
        closeLabel={t.closeSheet}
      >
        <div className="tk-cancelsheet">
          <p className="mz-body">
            <strong>
              {formatDayShort(booking.date, locale)} · {booking.time}
            </strong>{" "}
            · {t.guests(booking.guests)} · {booking.reference}
          </p>
          <p className="mz-body mz-secondary">{t.cancelIntro}</p>
          {error ? (
            <p className="bk-alert" role="alert">
              {dict.errors[error]}
            </p>
          ) : null}
          <div className="tk-cancelsheet__buttons">
            <button type="button" className="mz-btn mz-btn--lg tk-danger" onClick={confirmCancel} disabled={sending}>
              {sending ? t.cancelling : error ? t.tryAgain : t.confirmCancel}
            </button>
            <Button variant="secondary" size="lg" onClick={() => setSheet(false)} disabled={sending}>
              {t.keep}
            </Button>
          </div>
        </div>
      </BottomSheet>
    </main>
  );
}
