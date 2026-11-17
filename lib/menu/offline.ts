import { pageCount, pageImage, type ImageWidth, type MenuId } from "@/lib/menu/manifest";

/** The slice of the browser's Network Information API we look at (not available everywhere). */
export type Connection = { saveData?: boolean; effectiveType?: string } | undefined;

/** Background prefetching is skipped when the device asks to save data or the connection is very slow. */
export function shouldPrefetch(connection: Connection): boolean {
  if (!connection) return true;
  if (connection.saveData) return false;
  return !/^(slow-)?2g$/.test(connection.effectiveType ?? "");
}

/** Every page of a menu, in the format and size the browser is already using for the current page. */
export function prefetchUrls(menu: MenuId, ext: "avif" | "webp", width: ImageWidth): string[] {
  return Array.from({ length: pageCount(menu) }, (_, i) => pageImage(menu, i + 1, width, ext));
}

/** Reads the width and format from the URL of an image that has loaded, e.g. ".../04-ab12cd34-900.avif". */
export function imageChoice(src: string): { ext: "avif" | "webp"; width: ImageWidth } | null {
  const m = src.match(/-(450|900|1800)\.(avif|webp)$/);
  return m ? { width: Number(m[1]) as ImageWidth, ext: m[2] as "avif" | "webp" } : null;
}
