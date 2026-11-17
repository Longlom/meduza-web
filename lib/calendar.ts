import { slotInstant } from "@/lib/time";

/** Calendar entries are 2 hours long. This is an assumption, not a venue policy. */
const EVENT_MINUTES = 120;

function stamp(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function esc(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function buildIcs(opts: {
  reference: string;
  date: string;
  time: string;
  guests: number;
  title: string;
  note: string;
}) {
  const start = slotInstant(opts.date, opts.time);
  const end = new Date(start.getTime() + EVENT_MINUTES * 60_000);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Meduza//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${opts.reference}@meduza-nt.com`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(`${opts.title} · ${opts.reference}`)}`,
    `LOCATION:${esc("Meduza, 157 Nguyễn Thiện Thuật, Nha Trang")}`,
    `DESCRIPTION:${esc(`${opts.note}\n${opts.reference} · ${opts.guests}`)}`,
    "STATUS:TENTATIVE",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}

export function downloadIcs(filename: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
