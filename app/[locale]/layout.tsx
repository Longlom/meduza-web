import "@meduza/ui/styles.css";
import "../booking.css";
import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, Instrument_Serif } from "next/font/google";
import { notFound } from "next/navigation";
import { RegisterServiceWorker } from "@/components/RegisterServiceWorker";
import { getDict } from "@/lib/i18n";
import { SITE_URL } from "@/lib/metadata";
import { LOCALES, isLocale } from "@/lib/venue";

// Self-hosted brand fonts. next/font adds a fallback with matching metrics, so text does not jump when
// the real font arrives. They are not preloaded on purpose: preloading competes with the hero image on a
// slow connection. (The dong sign has its own system-font rule in booking.css, see "Dong" there.)
const text = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-text", preload: false });
const display = Inter_Tight({ subsets: ["latin", "cyrillic"], variable: "--font-display", preload: false });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", preload: false });

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Lets the page draw under the notch; controls respect env(safe-area-inset-*).
  viewportFit: "cover",
  // Browser chrome colour: the Abyss page ground (--mz-bg).
  themeColor: "#05070E"
};

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDict(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.title, template: `%s` },
    description: t.meta.description,
    applicationName: "Meduza",
    appleWebApp: { capable: true, title: "Meduza", statusBarStyle: "black-translucent" },
    icons: {
      icon: [
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
      ],
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }]
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} data-theme="abyss" className={`${text.variable} ${display.variable} ${serif.variable}`}>
      <body>
        {children}
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
