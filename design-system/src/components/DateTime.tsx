import { cx, VENUE_TIME_ZONE } from '../utils';
import type { Locale } from '../utils';

const intl: Record<Locale, string> = { en: 'en-GB', ru: 'ru-RU', vi: 'vi-VN' };
const todayWord: Record<Locale, string> = { en: 'Today', ru: 'Сегодня', vi: 'Hôm nay' };

/** "YYYY-MM-DD" for a date as seen in Nha Trang. */
export function venueDateKey(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: VENUE_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

/** The next `count` days starting today (venue time), as noon-UTC dates to avoid DST/zone edge cases. */
export function nextDays(count = 14, from: Date = new Date()): Date[] {
  const [y, m, d] = venueDateKey(from).split('-').map(Number);
  return Array.from({ length: count }, (_, i) => new Date(Date.UTC(y, m - 1, d + i, 12)));
}

export interface DateStripProps {
  days: Date[];
  /** Selected day as "YYYY-MM-DD". */
  value: string;
  onChange: (key: string) => void;
  locale?: Locale;
  isDisabled?: (day: Date) => boolean;
  label?: string;
  className?: string;
}

/** Horizontal day picker. Today first; swipeable on phones. */
export function DateStrip({ days, value, onChange, locale = 'en', isDisabled, label = 'Date', className }: DateStripProps) {
  const todayKey = venueDateKey(new Date());
  const dow = new Intl.DateTimeFormat(intl[locale], { weekday: 'short', timeZone: VENUE_TIME_ZONE });
  const num = new Intl.DateTimeFormat(intl[locale], { day: 'numeric', timeZone: VENUE_TIME_ZONE });
  const full = new Intl.DateTimeFormat(intl[locale], { weekday: 'long', day: 'numeric', month: 'long', timeZone: VENUE_TIME_ZONE });
  return (
    <div role="group" aria-label={label} className={cx('mz-date-strip', className)}>
      {days.map((d) => {
        const key = venueDateKey(d);
        return (
          <button
            key={key}
            type="button"
            className="mz-date"
            aria-pressed={key === value}
            aria-label={full.format(d)}
            disabled={isDisabled?.(d)}
            onClick={() => onChange(key)}
          >
            <span className="mz-date__dow">{key === todayKey ? todayWord[locale] : dow.format(d)}</span>
            <span className="mz-date__num">{num.format(d)}</span>
          </button>
        );
      })}
    </div>
  );
}

export interface Slot {
  time: string;
  available?: boolean;
}

export interface SlotGroup {
  label: string;
  slots: Slot[];
}

export interface TimeSlotsProps {
  groups: SlotGroup[];
  value: string | null;
  onChange: (time: string) => void;
  /** Accessible name prefix for each slot, e.g. "Book at". */
  slotLabel?: string;
  unavailableText?: string;
  className?: string;
}

/** Pill time slots, grouped (e.g. Afternoon / Evening / Late). Unavailable slots are struck through. */
export function TimeSlots({ groups, value, onChange, slotLabel = 'Book at', unavailableText = 'fully booked', className }: TimeSlotsProps) {
  return (
    <div className={cx('mz-stack', className)} style={{ ['--mz-gap' as string]: '16px' }}>
      {groups.map((g) => (
        <div key={g.label} className="mz-slots__group" role="group" aria-label={g.label}>
          <span className="mz-slots__group-label">{g.label}</span>
          <div className="mz-slots">
            {g.slots.map((s) => {
              const off = s.available === false;
              return (
                <button
                  key={s.time}
                  type="button"
                  className="mz-slot"
                  aria-pressed={s.time === value}
                  aria-label={`${slotLabel} ${s.time}${off ? `, ${unavailableText}` : ''}`}
                  disabled={off}
                  onClick={() => onChange(s.time)}
                >
                  {s.time}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
