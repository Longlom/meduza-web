import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["en", "ru"];

/** Everything lives under /en or /ru. Old and bare URLs (/, /booking, /book) are redirected. */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const first = pathname.split("/")[1];
  if (LOCALES.includes(first)) return NextResponse.next();

  const preferred = (req.headers.get("accept-language") ?? "").split(",")[0]?.trim().toLowerCase();
  const locale = preferred?.startsWith("ru") ? "ru" : "en";

  const clean = pathname.replace(/\/+$/, "") || "/";
  const target =
    clean === "/"
      ? `/${locale}`
      : clean === "/booking" || clean === "/book"
        ? `/${locale}/book`
        : `/${locale}${clean}`;

  return NextResponse.redirect(new URL(`${target}${search}`, req.url));
}

export const config = {
  // Skip the API, Next internals and any file with an extension (images, icons, …).
  matcher: ["/((?!api|_next|.*\\..*).*)"]
};
