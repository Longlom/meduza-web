import "../../../../ticket.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Ticket } from "@/components/booking/Ticket";
import { getDict } from "@/lib/i18n";
import { isLocale } from "@/lib/venue";

/** A personal page: never indexed, no canonical or language alternates. */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDict(locale);
  return { title: `${t.ticket.title} — ${t.brand}`, robots: { index: false, follow: false } };
}

export default async function Page({ params }: { params: Promise<{ locale: string; ref: string }> }) {
  const { locale, ref } = await params;
  if (!isLocale(locale)) notFound();
  return <Ticket locale={locale} reference={decodeURIComponent(ref)} />;
}
