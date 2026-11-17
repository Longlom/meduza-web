import { slotCalendarDate, toMin } from "@/lib/time";
import { OPEN_TO } from "@/lib/venue";
import type { BookingInput, CancelInput } from "@/lib/validation";

type TelegramSendMessageResponse = {
  ok: boolean;
  description?: string;
};

export async function sendTelegramMessage(opts: {
  botToken: string;
  chatId: string;
  text: string;
}) {
  const url = `https://api.telegram.org/bot${opts.botToken}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: opts.chatId,
      text: opts.text,
      parse_mode: "HTML",
      disable_web_page_preview: true
    })
  });

  const data = (await res.json().catch(() => ({}))) as TelegramSendMessageResponse;
  if (!res.ok || !data.ok) {
    throw new Error(data.description || `Telegram send failed (HTTP ${res.status}).`);
  }
}

export function escapeHtml(s: string) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

const dayFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC"
});

/** "Fri 20 Nov" for a "YYYY-MM-DD" key (formatted at noon UTC so the zone never shifts the day). */
export function dayLabel(dateKey: string) {
  return dayFmt.format(new Date(`${dateKey}T12:00:00Z`)).replace(",", "");
}

/**
 * The message the hostess reads. The opening day is always spelled out, and after-midnight
 * times get an extra line with the real calendar date, so "01:00" can never be misread.
 */
function dateAndTimeLines(date: string, time: string) {
  const lines = [`<b>${escapeHtml(dayLabel(date))} · ${time}</b> (Vietnam time)`];
  if (toMin(time) <= toMin(OPEN_TO)) {
    lines.push(
      `<i>After midnight: ${escapeHtml(dayLabel(slotCalendarDate(date, time)))} ${time}, ` +
        `still the ${escapeHtml(dayLabel(date))} night.</i>`
    );
  }
  return lines;
}

export function formatBookingMessage(booking: BookingInput, reference: string) {
  const lines = booking.replaces
    ? [
        `<b>Change request — replaces ${escapeHtml(booking.replaces)}</b>`,
        `<b>New reference: ${reference}</b>`,
        "",
        ...dateAndTimeLines(booking.date, booking.time)
      ]
    : [`<b>New booking · ${reference}</b>`, "", ...dateAndTimeLines(booking.date, booking.time)];
  lines.push(
    `<b>Guests:</b> ${booking.guests}`,
    "",
    `<b>Name:</b> ${escapeHtml(booking.name)}`,
    `<b>Phone:</b> ${escapeHtml(booking.phone)}`,
    booking.instagram
      ? `<b>Instagram:</b> <a href="https://instagram.com/${encodeURIComponent(booking.instagram)}">@${escapeHtml(booking.instagram)}</a> (preferred contact)`
      : `<b>Instagram:</b> —`,
    booking.notes ? `<b>Notes:</b> ${escapeHtml(booking.notes)}` : `<b>Notes:</b> —`,
    "",
    `Guest language: ${booking.locale.toUpperCase()}`
  );
  return lines.join("\n");
}

/**
 * A cancellation request. The server cannot prove the booking exists, so the message says
 * "requested" and asks the hostess to check with the guest.
 */
export function formatCancelMessage(cancel: CancelInput) {
  return [
    `<b>Cancellation requested · ${escapeHtml(cancel.reference)}</b>`,
    "",
    ...dateAndTimeLines(cancel.date, cancel.time),
    "",
    `<b>Name:</b> ${cancel.name ? escapeHtml(cancel.name) : "—"}`,
    `<b>Phone:</b> ${cancel.phone ? escapeHtml(cancel.phone) : "—"}`,
    "",
    "Please verify with the guest by phone or Telegram.",
    `Guest language: ${cancel.locale.toUpperCase()}`
  ].join("\n");
}
