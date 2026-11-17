import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingFlow } from "@/components/BookingFlow";
import { getDict } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { REFERENCE_RE } from "@/lib/validation";
import { isLocale } from "@/lib/venue";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDict(locale);
  return pageMetadata(locale, "/book", t.meta.title);
}

export default async function BookPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ change?: string | string[] }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { change } = await searchParams;
  const ref = typeof change === "string" && REFERENCE_RE.test(change) ? change : null;
  return <BookingFlow locale={locale} changeRef={ref} />;
}
