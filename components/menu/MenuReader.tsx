"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { PointerEvent } from "react";
import { useRouter } from "next/navigation";
import {
  BottomSheet,
  ChevronLeftIcon,
  ChevronRightIcon,
  IconButton,
  MinusIcon,
  PlusIcon,
  SegmentedControl,
  ShareIcon
} from "@meduza/ui";
import { ContentsList } from "@/components/menu/ContentsList";
import { PageImage, PreloadPage } from "@/components/menu/PageImage";
import { useMediaQuery } from "@/components/menu/useMediaQuery";
import { getDict } from "@/lib/i18n";
import {
  DEFAULT_PAGE,
  MENU_IDS,
  menuTitle,
  pageAlt,
  pageCount,
  pageImage,
  pageTitle,
  type MenuId
} from "@/lib/menu/manifest";
import { imageChoice, prefetchUrls, shouldPrefetch, type Connection } from "@/lib/menu/offline";
import { nextSpreadStart, prevSpreadStart, spreadPages } from "@/lib/menu/spreads";
import type { Locale } from "@/lib/venue";

/** Phone: one page at ~90% of the width. Desktop: two pages of up to 380 px. */
const SIZES = "(min-width: 900px) 380px, 90vw";
const ZOOM_SIZES = "(min-width: 900px) 70vw, 230vw";

export function MenuReader({ locale, menu, initialPage }: { locale: Locale; menu: MenuId; initialPage: number }) {
  const t = getDict(locale).menu;
  const router = useRouter();
  const desktop = useMediaQuery("(min-width: 900px)");
  const count = pageCount(menu);

  const [page, setPage] = useState(initialPage);
  const [zoomed, setZoomed] = useState<number | null>(null);
  const [sheet, setSheet] = useState(false);
  const [copied, setCopied] = useState(false);
  // Pages whose image could not load (offline and not cached), and a counter to retry them.
  const [failed, setFailed] = useState<number[]>([]);
  const [retry, setRetry] = useState(0);
  // Neighbouring pages are preloaded only after the visible one has loaded, so they never compete with it.
  const [settled, setSettled] = useState("");

  const visible = desktop ? spreadPages(page, count) : [page];
  const visibleKey = `${menu}:${visible.join(",")}`;
  const prevTarget = desktop ? prevSpreadStart(page) : page > 1 ? page - 1 : null;
  const nextTarget = desktop ? nextSpreadStart(page, count) : page < count ? page + 1 : null;

  /** Turns to a page, resets zoom and keeps `?page=N` in the address without adding history entries. */
  const go = useCallback(
    (target: number) => {
      const n = Math.min(count, Math.max(1, target));
      setPage(n);
      setZoomed(null);
      setSheet(false);
      window.history.replaceState(window.history.state, "", `${window.location.pathname}?page=${n}`);
    },
    [count]
  );

  // ---- phone page slide: the page follows the finger, then settles with a short animation ------
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);

  /** Moves the track instantly (while dragging) or leaves it to a CSS transition. */
  const moveTrack = (x: number, ms = 0) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = ms ? `transform ${ms}ms cubic-bezier(0.22, 1, 0.36, 1)` : "none";
    track.style.transform = x ? `translate3d(${x}px, 0, 0)` : "";
  };
  /** Distance from one page to its neighbour: the stage width plus the gap, measured from the slots. */
  const slideDistance = () => {
    const cur = trackRef.current?.querySelector<HTMLElement>('[data-pos="cur"]');
    const nb = trackRef.current?.querySelector<HTMLElement>('[data-pos="next"], [data-pos="prev"]');
    if (cur && nb) return Math.abs(nb.getBoundingClientRect().left - cur.getBoundingClientRect().left);
    return stageRef.current?.clientWidth ?? 390;
  };
  /**
   * Finishes a slide: animates the track to the next (dir 1) or previous (dir -1) page, or back to
   * the current one (dir 0), then switches the page in the same frame the track resets, so nothing
   * flashes. `from` is where the finger left the page. Reduced motion skips the animation.
   */
  const settle = useCallback(
    (dir: 1 | -1 | 0, from = 0) => {
      const target = dir === 1 ? nextTarget : dir === -1 ? prevTarget : null;
      const track = trackRef.current;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (dir !== 0 && target === null) return;
      if (!track || reduce) {
        moveTrack(0);
        if (target !== null) go(target);
        return;
      }
      const dist = slideDistance();
      const end = -dir * dist;
      const remaining = Math.abs(end - from);
      const ms = Math.round(Math.min(340, Math.max(160, (remaining / dist) * 340)));
      animating.current = true;
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        track.removeEventListener("transitionend", finish);
        if (target !== null) flushSync(() => go(target));
        moveTrack(0);
        animating.current = false;
      };
      track.addEventListener("transitionend", finish);
      window.setTimeout(finish, ms + 100);
      // Next frame, so the browser starts the transition from where the finger left it.
      moveTrack(from);
      requestAnimationFrame(() => moveTrack(end, ms));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nextTarget, prevTarget, go]
  );

  // Buttons, tap zones and arrow keys: slide on a phone, switch instantly on desktop.
  const prev = useCallback(() => {
    if (prevTarget === null || animating.current) return;
    if (desktop) go(prevTarget);
    else settle(-1);
  }, [prevTarget, desktop, go, settle]);
  const next = useCallback(() => {
    if (nextTarget === null || animating.current) return;
    if (desktop) go(nextTarget);
    else settle(1);
  }, [nextTarget, desktop, go, settle]);

  // Arrow keys turn pages; Escape leaves zoom. Ignored while typing or while the sheet is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target;
      if (target instanceof Element && target.closest("input, textarea, select, [contenteditable], dialog[open]")) return;
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") setZoomed(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // ---- phone gestures: drag to turn (the page follows the finger), pinch to zoom ----------------
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const g = useRef({ sx: 0, sy: 0, pinch0: 0, pinched: false, swiped: false, edge: false, drag: false, x: 0, t: 0, vx: 0 });
  const dist = () => {
    const [a, b] = [...pointers.current.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (animating.current) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      // Keep the OS back gesture: a drag that starts at the very edge is not ours.
      const edge = e.clientX < 20 || e.clientX > window.innerWidth - 20;
      g.current = { sx: e.clientX, sy: e.clientY, pinch0: 0, pinched: false, swiped: false, edge, drag: false, x: e.clientX, t: e.timeStamp, vx: 0 };
    }
    if (pointers.current.size === 2) {
      // A second finger means pinch: put a half-dragged page back.
      if (g.current.drag) moveTrack(0);
      g.current = { ...g.current, pinch0: dist(), pinched: true, drag: false };
    }
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const s = g.current;
    if (pointers.current.size === 2 && s.pinch0) {
      const ratio = dist() / s.pinch0;
      if (ratio > 1.3) {
        setZoomed(page);
        s.pinch0 = 0;
      } else if (ratio < 0.75) {
        setZoomed(null);
        s.pinch0 = 0;
      }
      return;
    }
    if (pointers.current.size !== 1 || s.pinched || s.edge || zoomed !== null) return;
    const dx = e.clientX - s.sx;
    const dy = e.clientY - s.sy;
    if (!s.drag) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      s.drag = true;
      // Keep receiving moves if the finger leaves the stage. Only now, so plain taps still reach the tap zones.
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* the pointer already ended */
      }
    }
    // At the first or last page the page resists instead of moving freely.
    const blocked = (dx < 0 && nextTarget === null) || (dx > 0 && prevTarget === null);
    moveTrack(blocked ? dx * 0.25 : dx);
    const dt = e.timeStamp - s.t;
    if (dt > 0) s.vx = 0.8 * s.vx + 0.2 * ((e.clientX - s.x) / dt);
    s.x = e.clientX;
    s.t = e.timeStamp;
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    const s = g.current;
    if (!s.drag) return;
    s.drag = false;
    s.swiped = true;
    window.setTimeout(() => (s.swiped = false), 400);
    const dx = e.clientX - s.sx;
    const w = slideDistance();
    const fast = Math.abs(s.vx) > 0.45 && Math.abs(dx) > 24;
    const far = Math.abs(dx) > w * 0.25;
    const dir = dx < 0 ? 1 : -1;
    const blocked = (dir === 1 && nextTarget === null) || (dir === -1 && prevTarget === null);
    const shown = blocked ? dx * 0.25 : dx;
    if (e.type !== "pointercancel" && !blocked && (far || (fast && Math.sign(s.vx) === Math.sign(dx)))) settle(dir, shown);
    else settle(0, shown);
  };
  const tap = (fn: () => void) => () => {
    if (!g.current.swiped) fn();
  };

  // ---- share -----------------------------------------------------------------------------------
  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}?page=${page}`;
    const title = t.shareTitle(menuTitle(menu, locale));
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 3000);
    } catch {
      /* no clipboard access: nothing more to do */
    }
  };

  // Offline reading: once the worker is ready, ask it to fetch the rest of this menu in the
  // background (in the size and format already in use), unless data saving or a 2g connection says no.
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    if (!shouldPrefetch((navigator as Navigator & { connection?: Connection }).connection)) return;
    let cancelled = false;
    const run = async () => {
      const reg = await navigator.serviceWorker.ready;
      const img = document.querySelector<HTMLImageElement>(".mr-slot[data-current] .mr-page__img, .mr-spread__img");
      const choice = (img && imageChoice(img.currentSrc)) || { ext: "avif" as const, width: 900 as const };
      if (!cancelled) reg.active?.postMessage({ type: "prefetch-menu", urls: prefetchUrls(menu, choice.ext, choice.width) });
    };
    const id = window.setTimeout(run, 1500);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [menu, desktop]);

  // First visit: the worker does not control this page yet, so it has not seen the images being shown.
  // Ask it to store them (this is the page the guest is reading, so it is allowed under data saving too).
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    if (navigator.serviceWorker.controller) return;
    const id = window.setTimeout(async () => {
      const reg = await navigator.serviceWorker.ready;
      const img = document.querySelector<HTMLImageElement>(".mr-slot[data-current] .mr-page__img, .mr-spread__img");
      const choice = (img && imageChoice(img.currentSrc)) || { ext: "avif" as const, width: 900 as const };
      reg.active?.postMessage({
        type: "prefetch-menu",
        urls: spreadPages(page, count).map((p) => pageImage(menu, p, choice.width, choice.ext))
      });
    }, 800);
    return () => window.clearTimeout(id);
    // Only the first visit matters, so this runs once per menu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu]);

  // An image that finished loading before the page hydrated never fires onLoad, so check once.
  useEffect(() => {
    const img = document.querySelector<HTMLImageElement>(".mr-slot[data-current] .mr-page__img, .mr-spread__img");
    if (img?.complete && img.naturalWidth > 0) setSettled(visibleKey);
  }, [visibleKey]);

  const markFailed = (p: number) => setFailed((f) => (f.includes(p) ? f : [...f, p]));
  const retryPage = (p: number) => {
    setFailed((f) => f.filter((x) => x !== p));
    setRetry((n) => n + 1);
  };
  const unavailable = (p: number) => (
    <div className="mr-gap" role="status">
      <span>{t.pageUnavailable}</span>
      <button type="button" className="mr-pill" onClick={() => retryPage(p)}>
        {getDict(locale).common.tryAgain}
      </button>
    </div>
  );

  const switchMenu = (id: MenuId) => {
    if (id !== menu) router.replace(`/${locale}/menu/${id}?page=${DEFAULT_PAGE}`);
  };

  const label =
    visible.length === 2 ? t.pagesOf(visible[0], visible[1], count) : t.pageOf(visible[0], count);
  const name = visible.map((p) => pageTitle(menu, p, locale)).join(" · ");
  // Phone: the neighbouring pages sit next to the current one so a drag can reveal them.
  const slots = [page - 1, page, page + 1].filter((p) => p >= 1 && p <= count);
  const around = (desktop
    ? [prevTarget, nextTarget].flatMap((s) => (s ? spreadPages(s, count) : []))
    : [page - 1, page + 1]
  ).filter((p) => p >= 1 && p <= count && !visible.includes(p));

  const contents = (
    <ContentsList menu={menu} locale={locale} current={visible} onPick={go} />
  );

  return (
    <main className="mr">
      <header className="mr-head">
        <div className="mr-head__row">
          <div className="mr-titles">
            <span className="mz-eyebrow mr-desktop-only">{t.eyebrow}</span>
            <h1 className="mr-h1">
              <span className="mr-phone-only">{t.title}</span>
              <span className="mr-desktop-only">
                {t.titleLead} <em className="mz-accent-serif">{t.titleAccent}</em>
              </span>
            </h1>
          </div>
          <div className="mr-actions">
            <button type="button" className="mr-pill mr-phone-only" onClick={() => setSheet(true)}>
              {t.contents}
            </button>
            <IconButton aria-label={t.share} onClick={share} className="mr-share">
              <ShareIcon size={20} />
            </IconButton>
          </div>
        </div>
        <SegmentedControl
          className="mr-seg"
          label={t.menusLabel}
          role="tabs"
          value={menu}
          onChange={switchMenu}
          options={MENU_IDS.map((id) => ({ value: id, label: t.names[id] }))}
        />
      </header>

      <div className="mr-body">
        <aside className="mr-aside" aria-label={t.contents}>
          <div className="mr-aside__head">
            <span>{t.contents}</span>
            <span className="mr-aside__count">{t.pageCount(count)}</span>
          </div>
          {contents}
        </aside>

        <div className="mr-main">
          {!desktop ? (
            <>
              <div
                className="mr-stage"
                ref={stageRef}
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onUp}
              >
                {zoomed === page ? (
                  <>
                    <div className="mr-zoom" tabIndex={0} role="region" aria-label={pageAlt(menu, page, locale)}>
                      <PageImage
                        menu={menu}
                        page={page}
                        locale={locale}
                        sizes={ZOOM_SIZES}
                        widths={[900, 1800]}
                        fallbackWidth={1800}
                        priority
                        className="mr-zoom__img"
                      />
                    </div>
                    <span className="mr-zoom__hint">{t.zoomHint}</span>
                  </>
                ) : (
                  <>
                    <div className="mr-track" ref={trackRef}>
                      {slots.map((p) => {
                        const here = p === page;
                        return (
                          <div
                            key={p}
                            className="mr-slot"
                            data-pos={here ? "cur" : p < page ? "prev" : "next"}
                            data-current={here ? "true" : undefined}
                            aria-hidden={here ? undefined : true}
                            inert={here ? undefined : true}
                          >
                            <div className="mr-page">
                              {failed.includes(p) ? (
                                here ? (
                                  unavailable(p)
                                ) : null
                              ) : here || settled === visibleKey ? (
                                <PageImage
                                  key={`${p}-${retry}`}
                                  menu={menu}
                                  page={p}
                                  locale={locale}
                                  sizes={SIZES}
                                  priority={here}
                                  eager={!here}
                                  alt={here ? undefined : ""}
                                  className="mr-page__img"
                                  onError={() => markFailed(p)}
                                  onLoad={here ? () => setSettled(visibleKey) : undefined}
                                />
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <button type="button" className="mr-zone mr-zone--prev" aria-label={t.previousPage} onClick={tap(prev)} disabled={prevTarget === null} />
                    <button type="button" className="mr-zone mr-zone--zoom" aria-label={t.zoomIn} onClick={tap(() => setZoomed(page))} />
                    <button type="button" className="mr-zone mr-zone--next" aria-label={t.nextPage} onClick={tap(next)} disabled={nextTarget === null} />
                  </>
                )}
              </div>

              <div className="mr-controls">
                <IconButton aria-label={t.previousPage} onClick={prev} disabled={prevTarget === null}>
                  <ChevronLeftIcon size={20} />
                </IconButton>
                <button type="button" className="mr-label" onClick={() => setSheet(true)} aria-live="polite">
                  <span className="mr-label__name">{name}</span>
                  <span className="mr-label__page">{label}</span>
                </button>
                <div className="mr-controls__end">
                  <IconButton
                    aria-label={zoomed === page ? t.zoomOut : t.zoomIn}
                    aria-pressed={zoomed === page}
                    solid={zoomed === page}
                    onClick={() => setZoomed(zoomed === page ? null : page)}
                  >
                    {zoomed === page ? <MinusIcon size={20} /> : <PlusIcon size={20} />}
                  </IconButton>
                  <IconButton aria-label={t.nextPage} onClick={next} disabled={nextTarget === null}>
                    <ChevronRightIcon size={20} />
                  </IconButton>
                </div>
              </div>
            </>
          ) : zoomed === null ? (
            <>
              <div className="mr-spread">
                {visible.map((p) => (
                  failed.includes(p) ? (
                    <div key={p} className="mr-spread__page mr-spread__page--gap">
                      {unavailable(p)}
                    </div>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      className="mr-spread__page"
                      aria-label={t.zoomInto(pageAlt(menu, p, locale))}
                      onClick={() => setZoomed(p)}
                    >
                      <PageImage
                        key={`${p}-${retry}`}
                        menu={menu}
                        page={p}
                        locale={locale}
                        sizes={SIZES}
                        priority
                        className="mr-spread__img"
                        onError={() => markFailed(p)}
                        onLoad={() => setSettled(visibleKey)}
                      />
                    </button>
                  )
                ))}
              </div>
              <div className="mr-bar">
                <button type="button" className="mr-pill mr-pill--lg" onClick={prev} disabled={prevTarget === null}>
                  <ChevronLeftIcon size={18} /> {t.previous}
                </button>
                <div className="mr-bar__label" aria-live="polite">
                  <span className="mr-bar__name">{name}</span>
                  <span className="mr-label__page">{label}</span>
                </div>
                <button type="button" className="mr-pill mr-pill--lg" onClick={next} disabled={nextTarget === null}>
                  {t.next} <ChevronRightIcon size={18} />
                </button>
              </div>
              <span className="mr-keys">{t.keysHint}</span>
            </>
          ) : (
            <div className="mr-bigzoom">
              <div className="mr-bigzoom__scroll" tabIndex={0} role="region" aria-label={pageAlt(menu, zoomed, locale)}>
                <PageImage
                  menu={menu}
                  page={zoomed}
                  locale={locale}
                  sizes={ZOOM_SIZES}
                  widths={[900, 1800]}
                  fallbackWidth={1800}
                  priority
                  className="mr-bigzoom__img"
                />
              </div>
              <button type="button" className="mr-pill mr-bigzoom__back" onClick={() => setZoomed(null)}>
                {t.backToSpread}
              </button>
            </div>
          )}
        </div>
      </div>

      {copied ? (
        <span className="mr-toast" role="status">
          {t.copied}
        </span>
      ) : null}

      {!desktop ? (
        <BottomSheet
          open={sheet}
          onClose={() => setSheet(false)}
          label={t.contentsOf(menuTitle(menu, locale))}
          title={menuTitle(menu, locale)}
          meta={t.pageCount(count)}
          closeLabel={t.closeContents}
        >
          {contents}
        </BottomSheet>
      ) : null}

      {desktop && settled === visibleKey
        ? around.map((p) => <PreloadPage key={p} menu={menu} page={p} sizes={SIZES} />)
        : null}
    </main>
  );
}
