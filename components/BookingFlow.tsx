"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  ChevronLeftIcon,
  CloseIcon,
  DateStrip,
  IconButton,
  Stepper,
  TextArea,
  TextField,
  TimeSlots
} from "@meduza/ui";
import { SiteNav } from "@/components/SiteNav";
import { formatDayMonth, formatDayShort } from "@/lib/format";
import { getBooking, saveBooking, saveChange, useMyBookings } from "@/lib/my-bookings";
import { getDict } from "@/lib/i18n";
import { SLOT_GROUPS, dayHasSlots, defaultSlot, pickableDays } from "@/lib/slots";
import { currentOpeningDay, isBookable } from "@/lib/time";
import {
  BookingSchema,
  checkSchedule,
  fieldErrors,
  type ErrorCode,
  type FieldErrors
} from "@/lib/validation";
import { MAX_GUESTS, type Locale } from "@/lib/venue";

type Errors = FieldErrors & { form?: ErrorCode | "network" };

const PHONE_STRIP = /[^0-9+()\-.\s#xX]/g;
const FORM_FIELD_STEP: Record<string, 0 | 1> = {
  date: 0,
  time: 0,
  guests: 0,
  name: 1,
  phone: 1,
  instagram: 1,
  notes: 1
};

export function BookingFlow({ locale, changeRef = null }: { locale: Locale; changeRef?: string | null }) {
  const t = getDict(locale);
  // "Change": /book?change=MDZ-1234 reopens the form with that request's details.
  const bookings = useMyBookings();
  const found = changeRef && bookings ? getBooking(bookings, changeRef) : null;
  const replacing = found && found.status === "pending" ? found : null;
  const prefilled = useRef(false);
  const [now, setNow] = useState<Date | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [step, setStep] = useState<0 | 1>(0);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const router = useRouter();
  // Set once the booking is saved and we are on our way to the ticket, so the button stays disabled.
  const leaving = useRef(false);

  // Time only exists in the browser: avoids a server/browser mismatch and keeps slots fresh.
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Changing a booking: fill in the details the guest gave before.
  useEffect(() => {
    if (!replacing || prefilled.current) return;
    prefilled.current = true;
    setName(replacing.name);
    setPhone(replacing.phone);
    setInstagram(replacing.instagram);
    setNotes(replacing.notes);
    setGuests(Math.min(Math.max(replacing.guests, 1), MAX_GUESTS));
  }, [replacing]);

  // First load: pick the first day that still has a free slot, and a sensible time. When changing, start
  // from the old date and time if they can still be booked.
  useEffect(() => {
    if (!now || date) return;
    const open = pickableDays(now).filter((d) => dayHasSlots(d, now));
    const wanted = replacing && open.includes(replacing.date) ? replacing.date : open[0];
    if (wanted) {
      setDate(wanted);
      setTime(
        replacing && wanted === replacing.date && isBookable(wanted, replacing.time, now)
          ? replacing.time
          : defaultSlot(wanted, now)
      );
    }
  }, [now, date, replacing]);

  // If the picked slot slips inside the 1.5 h window while the guest is typing, deselect it.
  useEffect(() => {
    if (!now || !date || !time) return;
    if (!isBookable(date, time, now)) {
      setTime(null);
      setErrors((e) => ({ ...e, time: "time_past" }));
    }
  }, [now, date, time]);

  const days = useMemo(() => (now ? pickableDays(now) : []), [now]);
  const todayKey = now ? currentOpeningDay(now) : null;

  const dateLabel = date
    ? date === todayKey
      ? `${t.book.today}, ${formatDayMonth(date, locale)}`
      : formatDayShort(date, locale)
    : "";
  const summary = date && time ? `${dateLabel} · ${time} · ${t.book.guestsCount(guests)}` : "";
  const daySlots = date && now && !dayHasSlots(date, now);

  function pickDate(key: string) {
    if (!now) return;
    setDate(key);
    setErrors((e) => ({ ...e, date: undefined, time: undefined }));
    if (!time || !isBookable(key, time, now)) setTime(defaultSlot(key, now));
  }

  function goNext() {
    setStep(1);
    window.scrollTo({ top: 0 });
  }

  function goBack() {
    setStep(0);
    window.scrollTo({ top: 0 });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending || !date || !time) return;
    const payload = {
      name,
      phone,
      instagram,
      date,
      time,
      guests,
      notes,
      locale,
      website,
      ...(replacing ? { replaces: replacing.reference } : null)
    };

    const parsed = BookingSchema.safeParse(payload);
    const found: Errors = parsed.success ? {} : fieldErrors(parsed.error);
    if (parsed.success) {
      const schedule = checkSchedule(date, time, new Date());
      if (schedule) found.time = schedule;
    }
    if (Object.keys(found).length) return showErrors(found);

    setSending(true);
    setErrors({});
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        reference?: string;
        error?: ErrorCode;
        fields?: FieldErrors;
      };
      if (res.ok && data.ok && data.reference) {
        // Kept on this device only; the ticket page reads it from here.
        const record = {
          reference: data.reference,
          date,
          time,
          guests,
          name: name.trim(),
          phone: phone.trim(),
          instagram: parsed.success ? parsed.data.instagram : "",
          notes: notes.trim()
        };
        if (replacing) saveChange(replacing.reference, record);
        else saveBooking(record);
        // The Book tab shows the booking: go straight to its ticket.
        leaving.current = true;
        router.push(`/${locale}/booking/${data.reference}`);
      } else if (data.fields && Object.keys(data.fields).length) {
        showErrors(data.fields);
      } else {
        showErrors({ form: data.error ?? "server" });
      }
    } catch {
      showErrors({ form: "network" });
    } finally {
      if (!leaving.current) setSending(false);
    }
  }

  function showErrors(found: Errors) {
    setErrors(found);
    const firstField = Object.keys(found).find((k) => k in FORM_FIELD_STEP);
    // On a phone, jump back to the step that holds the problem.
    if (firstField) setStep(FORM_FIELD_STEP[firstField]);
    window.scrollTo({ top: 0 });
  }

  const err = (code?: ErrorCode | "network") => (code ? t.errors[code] : undefined);

  const nav = <SiteNav locale={locale} />;

  return (
    <div className="bk" data-step={step}>
      {nav}
      <form className="bk-form" noValidate onSubmit={onSubmit}>
        {/* Phone header: close/back, step label, progress */}
        <header className="bk-mhead">
          <div className="bk-mhead__row">
            {step === 0 ? (
              <a className="mz-icon-btn" href={`/${locale}`} aria-label={t.book.close}>
                <CloseIcon size={20} />
              </a>
            ) : (
              <IconButton aria-label={t.book.back} onClick={goBack}>
                <ChevronLeftIcon size={20} />
              </IconButton>
            )}
            <span className="bk-mhead__label">{t.book.steps[step]}</span>
            <span className="bk-mhead__count">{t.book.stepOf(step + 1, 2)}</span>
          </div>
          <div className="bk-progress" aria-hidden="true">
            <span data-on="true" />
            <span data-on={step === 1} />
          </div>
        </header>

        <div className="bk-main">
          <div className="bk-intro">
            <span className="mz-eyebrow">{t.book.eyebrow}</span>
            <h1 className="bk-h1 bk-h1--book">
              {t.book.titleLead} <em className="mz-accent-serif">{t.book.titleAccent}</em>
            </h1>
            <h2 className="bk-h1 bk-h1--details">{t.book.steps[1]}</h2>
            <p className="mz-body mz-secondary bk-intro__text">{t.book.intro}</p>
          </div>

          {replacing ? (
            <p className="bk-banner" role="status">
              {t.book.changeBanner(replacing.reference)}
            </p>
          ) : null}

          {errors.form ? (
            <div className="bk-alert" role="alert">
              {err(errors.form)}
            </div>
          ) : null}

          <div className="bk-cols">
            <div className="bk-sections">
              {/* Step 1: date, time, guests */}
              <section className="bk-card" data-active={step === 0} aria-labelledby="bk-h-when">
                <h2 id="bk-h-when" className="bk-card__title">
                  {t.book.sectionWhen}
                </h2>

                {now && date ? (
                  <>
                    <div className="bk-block bk-dates">
                      <span className="bk-label">{t.book.date}</span>
                      <DateStrip
                        days={days.map((d) => new Date(`${d}T12:00:00Z`))}
                        value={date}
                        onChange={pickDate}
                        locale={locale}
                        label={t.book.date}
                        isDisabled={(d) => !dayHasSlots(d.toISOString().slice(0, 10), now)}
                      />
                    </div>

                    <div className="bk-block bk-slots">
                      <div className="bk-rowhead">
                        <span className="bk-label">{t.book.time}</span>
                        <span className="bk-hint">{t.book.timeHint}</span>
                      </div>
                      {daySlots ? (
                        <p className="bk-hint" role="status">
                          {t.book.noSlots}
                        </p>
                      ) : (
                        <TimeSlots
                          groups={SLOT_GROUPS.map((g) => ({
                            label: t.book.groups[g.id],
                            slots: g.times.map((tm) => ({ time: tm, available: isBookable(date, tm, now) }))
                          }))}
                          value={time}
                          onChange={(tm) => {
                            setTime(tm);
                            setErrors((e) => ({ ...e, time: undefined }));
                          }}
                          slotLabel={t.book.slotLabel}
                          unavailableText={t.book.slotTooSoon}
                        />
                      )}
                      {errors.time ? (
                        <span className="mz-field__error" role="alert">
                          {err(errors.time)}
                        </span>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <div className="bk-skel" aria-busy="true" />
                )}

                <Stepper
                  label={t.book.guests}
                  value={guests}
                  onChange={setGuests}
                  min={1}
                  max={MAX_GUESTS}
                  decrementLabel={t.book.guestsFewer}
                  incrementLabel={t.book.guestsMore}
                />
                {errors.guests ? (
                  <span className="mz-field__error" role="alert">
                    {err(errors.guests)}
                  </span>
                ) : null}
              </section>

              {/* Step 2: details */}
              <section className="bk-card" data-active={step === 1} aria-labelledby="bk-h-you">
                <h2 id="bk-h-you" className="bk-card__title">
                  {t.book.sectionYou}
                </h2>
                <div className="bk-two">
                  <TextField
                    label={t.book.name}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.book.namePlaceholder}
                    autoComplete="name"
                    maxLength={80}
                    error={err(errors.name)}
                  />
                  <TextField
                    label={t.book.phone}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(PHONE_STRIP, ""))}
                    placeholder={t.book.phonePlaceholder}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    error={err(errors.phone)}
                  />
                </div>

                <div className="mz-field">
                  <label htmlFor="bk-ig" className="mz-field__label">
                    {t.book.instagram} · {t.book.optional}
                  </label>
                  <span className="bk-ig">
                    <span className="bk-ig__at" aria-hidden="true">
                      @
                    </span>
                    <input
                      id="bk-ig"
                      className="mz-field__control bk-ig__input"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder={t.book.instagramPlaceholder}
                      autoComplete="off"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      aria-invalid={errors.instagram ? true : undefined}
                      aria-describedby={errors.instagram ? "bk-ig-error" : "bk-ig-hint"}
                    />
                  </span>
                  {errors.instagram ? (
                    <span id="bk-ig-error" className="mz-field__error">
                      {err(errors.instagram)}
                    </span>
                  ) : (
                    <span id="bk-ig-hint" className="mz-field__hint">
                      {t.book.instagramHint}
                    </span>
                  )}
                </div>

                <TextArea
                  label={t.book.notes}
                  optional
                  optionalText={t.book.optional}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.book.notesPlaceholder}
                  maxLength={800}
                  error={err(errors.notes)}
                />

                {/* Honeypot: invisible to guests, tempting to bots. */}
                <div className="bk-hp" aria-hidden="true">
                  <label>
                    Website
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </label>
                </div>
              </section>
            </div>

            {/* Desktop summary card */}
            <aside className="bk-aside" aria-label={t.book.yourTable}>
              <img
                src="/photos/tank.jpg"
                width={1050}
                height={1400}
                alt={t.book.photoAlt}
                loading="lazy"
                className="bk-aside__photo"
              />
              <div className="bk-aside__body">
                <span className="bk-aside__title">{t.book.yourTable}</span>
                <dl className="bk-dl">
                  <dt>{t.book.summaryDate}</dt>
                  <dd>{dateLabel || "—"}</dd>
                  <dt>{t.book.summaryTime}</dt>
                  <dd>{time ?? "—"}</dd>
                  <dt>{t.book.summaryGuests}</dt>
                  <dd>{guests}</dd>
                </dl>
                <Button type="submit" size="lg" glow block disabled={sending || !time}>
                  {sending ? t.book.submitting : t.book.submit}
                </Button>
              </div>
            </aside>
          </div>
        </div>

        {/* Phone sticky action with the live summary */}
        <div className="bk-cta">
          <span className="bk-cta__summary">{summary}</span>
          {step === 0 ? (
            <Button key="next" type="button" size="lg" glow block disabled={!time} onClick={goNext}>
              {t.book.next}
            </Button>
          ) : (
            <Button key="submit" type="submit" size="lg" glow block disabled={sending || !time}>
              {sending ? t.book.submitting : t.book.submit}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
