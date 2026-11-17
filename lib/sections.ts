export type Section = "home" | "menu" | "book" | "visit" | null;

/** Which tab a path belongs to. Paths look like /en, /en/menu/dinner, /ru/booking/MDZ-1234. */
export function sectionOf(pathname: string): Section {
  const seg = pathname.split("/")[2];
  if (!seg) return "home";
  if (seg === "menu") return "menu";
  if (seg === "book" || seg === "booking") return "book";
  if (seg === "visit") return "visit";
  return null;
}
