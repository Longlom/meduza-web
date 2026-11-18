import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["en", "ru"];

/** Everything lives under /en or /ru. Old and bare URLs (/, /booking, /book, and the retired /call) are redirected. */
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
        : clean === "/call" || clean.startsWith("/call/")
          ? `/${locale}` // the old table QR "call staff" page is gone: land on home instead of a 404
          : `/${locale}${clean}`;

  const dropQuery = clean === "/call" || clean.startsWith("/call/");
  return NextResponse.redirect(new URL(`${target}${dropQuery ? "" : search}`, req.url));
}

export const config = {
  // Skip the API, Next internals and any file with an extension (images, icons, …).
  matcher: ["/((?!api|_next|.*\\..*).*)"]
};
