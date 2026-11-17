import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RetryButton } from "@/components/RetryButton";
import { getDict } from "@/lib/i18n";
import { isLocale } from "@/lib/venue";

export const metadata: Metadata = { robots: { index: false } };

/** Shown by the service worker when a page that was never opened is requested offline. */
export default async function OfflinePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);
  return (
    <main className="bk-stub bk-stub--full">
      <img src="/logo/logo-white.png" width={514} height={362} alt={t.brand} className="bk-stub__logo" />
      <h1 className="bk-h1">{t.common.offlineTitle}</h1>
      <p className="mz-body mz-secondary bk-stub__text">{t.common.offlineText}</p>
      <RetryButton label={t.common.tryAgain} />
    </main>
  );
}
