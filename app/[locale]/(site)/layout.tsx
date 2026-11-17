import { notFound } from "next/navigation";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { SiteNav } from "@/components/SiteNav";
import { SiteTabBar } from "@/components/SiteTabBar";
import { isLocale } from "@/lib/venue";

/** Shared shell: floating nav on desktop, tab bar on phones. The booking form lives outside it. */
export default async function SiteLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <SiteNav locale={locale} />
      <div className="site-mobile-lang">
        <LanguageSwitch locale={locale} />
      </div>
      <div className="site-body">{children}</div>
      <SiteTabBar locale={locale} />
    </>
  );
}
