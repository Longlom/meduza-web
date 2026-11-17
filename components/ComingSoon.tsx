import { getDict } from "@/lib/i18n";
import type { Locale } from "@/lib/venue";

/** Temporary body for screens that have their own change (menu, visit). Replaced when they land. */
export function ComingSoon({ locale, title }: { locale: Locale; title: string }) {
  return (
    <main className="bk-stub">
      <h1 className="bk-h1">{title}</h1>
      <p className="mz-body mz-secondary">{getDict(locale).common.comingSoon}</p>
    </main>
  );
}
