"use client";

import { usePathname } from "next/navigation";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import type { Locale } from "@/lib/venue";

/** The phone EN / RU pill, shown on the home page only. Other pages keep the language in the desktop nav. */
export function MobileLanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname().replace(/\/$/, "");
  if (pathname !== `/${locale}`) return null;
  return (
    <div className="site-mobile-lang">
      <LanguageSwitch locale={locale} />
    </div>
  );
}
