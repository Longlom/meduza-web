import type { ReactEventHandler } from "react";
import { pageAlt, pageImage, pageSrcSet, type ImageWidth, type MenuId } from "@/lib/menu/manifest";
import type { Locale } from "@/lib/venue";

/**
 * One menu page. AVIF with a WebP fallback, sizes chosen by the browser from the 450 and 900 px
 * files (the 1800 px file is only used when the guest zooms). The A4 ratio is reserved by CSS,
 * so nothing moves while the image loads.
 */
export function PageImage({
  menu,
  page,
  locale,
  sizes,
  widths = [450, 900],
  fallbackWidth = 900,
  priority = false,
  eager = false,
  className,
  alt,
  onError,
  onLoad
}: {
  menu: MenuId;
  page: number;
  locale: Locale;
  sizes: string;
  widths?: ImageWidth[];
  fallbackWidth?: ImageWidth;
  priority?: boolean;
  /** Load now without competing with the current page (a neighbour that is off screen). */
  eager?: boolean;
  className?: string;
  alt?: string;
  onError?: ReactEventHandler<HTMLImageElement>;
  onLoad?: ReactEventHandler<HTMLImageElement>;
}) {
  return (
    <picture>
      <source type="image/avif" srcSet={pageSrcSet(menu, page, "avif", widths)} sizes={sizes} />
      <source type="image/webp" srcSet={pageSrcSet(menu, page, "webp", widths)} sizes={sizes} />
      <img
        className={className}
        src={pageImage(menu, page, fallbackWidth, "webp")}
        width={910}
        height={1287}
        alt={alt ?? pageAlt(menu, page, locale)}
        decoding="async"
        onError={onError}
        onLoad={onLoad}
        {...(priority
          ? { fetchPriority: "high" as const }
          : eager
            ? { loading: "eager" as const, fetchPriority: "low" as const }
            : { loading: "lazy" as const })}
      />
    </picture>
  );
}

/** Starts loading a page ahead of time (the AVIF source; browsers without AVIF ignore it). */
export function PreloadPage({ menu, page, sizes }: { menu: MenuId; page: number; sizes: string }) {
  return (
    <link
      rel="preload"
      as="image"
      type="image/avif"
      imageSrcSet={pageSrcSet(menu, page, "avif")}
      imageSizes={sizes}
    />
  );
}
