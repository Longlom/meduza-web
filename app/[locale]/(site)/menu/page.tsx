import { notFound, redirect } from "next/navigation";
import { defaultMenu } from "@/lib/menu/default";
import { isLocale } from "@/lib/venue";

// Depends on the time of day (Vietnam time), so it must run on every request.
export const dynamic = "force-dynamic";

/** `/menu` opens the right menu for the moment: brunch by day, the evening default after the evening start. */
export default async function MenuIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  redirect(`/${locale}/menu/${defaultMenu(new Date())}`);
}
