"use client";

import { useSyncExternalStore } from "react";
import { currentOpeningDay, slotInstant } from "@/lib/time";

/**
 * "My booking": the guest's own requests, kept on this device only (localStorage). Screens never
 * touch localStorage directly; they use this module, so a database can replace it later (then
 * `getBooking` becomes a fetch and statuses gain "confirmed" and "declined").
 *
 * Stored fields: reference, date, time, guests, name, phone, Instagram, notes, the time it was
 * sent, a status and, for changed or cancelled requests, when and (for changes) the new reference.
 * Nothing here is sent to a server except inside the booking request itself.
 */
export type BookingStatus = "pending" | "cancelled" | "changed";

export type MyBooking = {
  reference: string;
  /** Opening day, "YYYY-MM-DD". */
  date: string;
  time: string;
  guests: number;
  name: string;
  phone: string;
  instagram: string;
  notes: string;
  /** Epoch milliseconds when the request was sent. */
  sentAt: number;
  status: BookingStatus;
  /** Epoch milliseconds when it was cancelled or changed. */
  closedAt?: number;
  /** The reference that replaced this booking (status "changed"). */
  replacedBy?: string;
};

export const BOOKINGS_KEY = "mdz:bookings:v1";
export const LEGACY_KEY = "mdz:last-booking";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function defaultStorage(): StorageLike | null {
  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch {
    return null; // private mode or blocked storage
  }
}

function isRecord(v: unknown): v is MyBooking {
  if (typeof v !== "object" || v === null) return false;
  const r = v as Record<string, unknown>;
  return (
    typeof r.reference === "string" &&
    typeof r.date === "string" &&
    typeof r.time === "string" &&
    typeof r.guests === "number" &&
    typeof r.sentAt === "number" &&
    (r.status === "pending" || r.status === "cancelled" || r.status === "changed")
  );
}

export function parseBookings(raw: string | null): MyBooking[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data.filter(isRecord) : [];
  } catch {
    return [];
  }
}

function write(list: MyBooking[], storage: StorageLike | null) {
  if (!storage) return;
  try {
    storage.setItem(BOOKINGS_KEY, JSON.stringify(list));
  } catch {
    /* quota or private mode: the confirmation screen still works */
  }
  emit();
}

export function readBookings(storage: StorageLike | null = defaultStorage()): MyBooking[] {
  if (!storage) return [];
  try {
    return parseBookings(storage.getItem(BOOKINGS_KEY));
  } catch {
    return [];
  }
}

/** Active: the opening day the booking belongs to has not ended yet. */
export function isActive(b: MyBooking, now: Date) {
  return currentOpeningDay(now) <= b.date;
}

/** True once the booked time has passed (the opening day may still be running). */
export function hasPassed(b: MyBooking, now: Date) {
  return slotInstant(b.date, b.time).getTime() <= now.getTime();
}

/**
 * The booking the Book tab should open: among pending requests that are still active, the next one
 * to come; if every booked time has already passed, the most recent one.
 */
export function activeBooking(list: MyBooking[], now: Date): MyBooking | null {
  const pending = list.filter((b) => b.status === "pending" && isActive(b, now));
  const at = (b: MyBooking) => slotInstant(b.date, b.time).getTime();
  const upcoming = pending.filter((b) => !hasPassed(b, now)).sort((a, b) => at(a) - at(b));
  if (upcoming.length) return upcoming[0];
  return pending.sort((a, b) => at(b) - at(a))[0] ?? null;
}

export function getBooking(list: MyBooking[], reference: string): MyBooking | null {
  return list.find((b) => b.reference === reference) ?? null;
}

/** Records whose opening day has ended are removed. */
export function pruneExpired(now: Date, storage: StorageLike | null = defaultStorage()) {
  const list = readBookings(storage);
  const kept = list.filter((b) => isActive(b, now));
  if (kept.length !== list.length) write(kept, storage);
}

/** The old single-record key becomes one pending record without personal details. */
export function migrateLegacy(storage: StorageLike | null = defaultStorage()) {
  if (!storage) return;
  let raw: string | null = null;
  try {
    raw = storage.getItem(LEGACY_KEY);
  } catch {
    return;
  }
  if (!raw) return;
  try {
    const old = JSON.parse(raw) as Partial<MyBooking>;
    if (
      typeof old.reference === "string" &&
      typeof old.date === "string" &&
      typeof old.time === "string" &&
      typeof old.guests === "number"
    ) {
      const list = readBookings(storage);
      if (!getBooking(list, old.reference)) {
        list.push({
          reference: old.reference,
          date: old.date,
          time: old.time,
          guests: old.guests,
          name: "",
          phone: "",
          instagram: "",
          notes: "",
          sentAt: typeof old.sentAt === "number" ? old.sentAt : Date.now(),
          status: "pending"
        });
        write(list, storage);
      }
    }
  } catch {
    /* unreadable: drop it */
  }
  try {
    storage.removeItem(LEGACY_KEY);
  } catch {
    /* ignore */
  }
}

export function saveBooking(
  booking: Omit<MyBooking, "status" | "sentAt"> & { sentAt?: number },
  storage: StorageLike | null = defaultStorage()
) {
  const list = readBookings(storage).filter((b) => b.reference !== booking.reference);
  list.push({ ...booking, sentAt: booking.sentAt ?? Date.now(), status: "pending" });
  write(list, storage);
}

function update(reference: string, patch: Partial<MyBooking>, storage: StorageLike | null) {
  const list = readBookings(storage).map((b) => (b.reference === reference ? { ...b, ...patch } : b));
  write(list, storage);
}

export function markCancelled(reference: string, storage: StorageLike | null = defaultStorage()) {
  update(reference, { status: "cancelled", closedAt: Date.now() }, storage);
}

/** A change request was sent: save the new record and point the old one to it, in one write. */
export function saveChange(
  oldReference: string,
  booking: Omit<MyBooking, "status" | "sentAt">,
  storage: StorageLike | null = defaultStorage()
) {
  const list = readBookings(storage)
    .filter((b) => b.reference !== booking.reference)
    .map((b) =>
      b.reference === oldReference
        ? { ...b, status: "changed" as const, closedAt: Date.now(), replacedBy: booking.reference }
        : b
    );
  list.push({ ...booking, sentAt: Date.now(), status: "pending" });
  write(list, storage);
}

/* ---------- React: a store with a stable snapshot, safe for hydration ---------- */

const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedList: MyBooking[] = [];
let started = false;

function emit() {
  for (const l of listeners) l();
}

function snapshot(): MyBooking[] {
  const storage = defaultStorage();
  let raw: string | null = null;
  try {
    raw = storage ? storage.getItem(BOOKINGS_KEY) : null;
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedList = parseBookings(raw);
  }
  return cachedList;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === BOOKINGS_KEY || e.key === LEGACY_KEY || e.key === null) onChange();
  };
  window.addEventListener("storage", onStorage);
  if (!started) {
    started = true;
    // First visit of this page load: bring the old key over, drop finished bookings.
    migrateLegacy();
    pruneExpired(new Date());
  }
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * All records on this device. `null` on the server and during hydration, so the first browser render
 * matches the server HTML; the real list follows right after.
 */
export function useMyBookings(): MyBooking[] | null {
  return useSyncExternalStore(subscribe, snapshot, () => null);
}

/** The reference of the active pending booking, or null. A string, so the snapshot is stable. */
export function useActiveReference(): string | null {
  return useSyncExternalStore(
    subscribe,
    () => activeBooking(snapshot(), new Date())?.reference ?? null,
    () => null
  );
}
