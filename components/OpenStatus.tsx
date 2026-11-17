"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@meduza/ui";
import { getDict } from "@/lib/i18n";
import { openStatus } from "@/lib/venue-info";
import type { Locale } from "@/lib/venue";

/**
 * Live "Open now · until 02:00" badge. The server and the first browser render show only the daily
 * hours (no clock), so there is no hydration mismatch; the live state appears right after mount.
 */
export function OpenStatus({ locale, className }: { locale: Locale; className?: string }) {
  const t = getDict(locale).venue;
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  if (!now) return <StatusBadge open={false} className={className}>{t.dailyHours}</StatusBadge>;
  const s = openStatus(now);
  return <StatusBadge open={s.open} className={className}>{s.open ? t.openNow(s.until) : t.closedOpens(s.opensAt)}</StatusBadge>;
}
