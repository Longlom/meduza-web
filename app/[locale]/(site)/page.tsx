import "../../home.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { ExperienceCards } from "@/components/home/ExperienceCards";
import { HomeHero } from "@/components/home/HomeHero";
import { MenuCovers } from "@/components/home/MenuCovers";
import { QuickActions } from "@/components/home/QuickActions";
import { VisitCard } from "@/components/home/VisitCard";
import { daypart } from "@/lib/daypart";
import { pageMetadata } from "@/lib/metadata";
import { VENUE_NAME } from "@/lib/venue-info";
import { isLocale } from "@/lib/venue";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, "", VENUE_NAME);
}

// The featured carousel follows the time of day, so the cached page is refreshed every minute.
export const revalidate = 60;

/** Home (M1). */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <main className="hm">
      <HomeHero locale={locale} />
      <QuickActions locale={locale} />
      <FeaturedCarousel locale={locale} initialDaypart={daypart(new Date())} />
      <ExperienceCards locale={locale} />
      <MenuCovers locale={locale} />
      <VisitCard locale={locale} />
    </main>
  );
}
