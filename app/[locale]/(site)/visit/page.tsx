import "../../../visit.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VenueAction } from "@/components/VenueAction";
import { VisitContacts } from "@/components/visit/VisitContacts";
import { VisitHours } from "@/components/visit/VisitHours";
import { VisitMap } from "@/components/visit/VisitMap";
import { getDict } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { isLocale } from "@/lib/venue";
import { VENUE } from "@/lib/venue-info";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDict(locale);
  return pageMetadata(locale, "/visit", `${t.nav.visit} — ${t.brand}`);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);
  return (
    <main className="vs">
      <VisitMap locale={locale} />
      <header className="vs-head">
        <h1 className="vs-title">{t.visit.title}</h1>
        <address className="vs-address">{VENUE.address.value}</address>
        <div className="vs-actions">
          <VenueAction kind="directions" className="mz-btn mz-btn--primary mz-btn--lg">
            {t.venue.directions}
          </VenueAction>
        </div>
      </header>
      <div className="vs-info">
        <VisitHours locale={locale} />
        <VisitContacts locale={locale} />
      </div>
    </main>
  );
}
