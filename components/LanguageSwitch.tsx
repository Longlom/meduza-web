"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { getDict } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/lib/venue";

function Links({ locale, query }: { locale: Locale; query: string }) {
  const rest = usePathname().replace(/^\/(en|ru)(?=\/|$)/, "");
  return (
    <nav aria-label={getDict(locale).nav.language} className="site-lang">
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}${query ? `?${query}` : ""}`}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? "true" : undefined}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}

function WithQuery({ locale }: { locale: Locale }) {
  return <Links locale={locale} query={useSearchParams().toString()} />;
}

/** EN / RU links to the same page, keeping query parameters such as ?page=4. */
export function LanguageSwitch({ locale }: { locale: Locale }) {
  return (
    <Suspense fallback={<Links locale={locale} query="" />}>
      <WithQuery locale={locale} />
    </Suspense>
  );
}
