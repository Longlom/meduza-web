/* Meduza service worker: a small offline shell. Hand written, no dependencies.
 *  - pages: network first, cached copy when offline, branded offline page as a last resort
 *  - static files and images: stale while revalidate
 *  - /api/* is never touched
 *  - menu page images: cache first in a cache named after the menu version (deleted when a menu changes)
 *  - a new version waits until open pages are closed (no skipWaiting), so it never interrupts a guest
 */
importScripts("/sw-menu-version.js"); // defines self.MENU_VERSION (written by npm run menu:images)
const VERSION = "v1";
const PAGES = `meduza-pages-${VERSION}`;
const STATIC = `meduza-static-${VERSION}`;
const MENU = `meduza-menu-${self.MENU_VERSION || "0"}`;
const OFFLINE_PAGES = ["/en/offline", "/ru/offline"];
const PRECACHE = ["/logo/logo-white.png", "/logo/logo-white-sm.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(precache());
});

// Stores the offline pages together with the scripts and styles they need, so they render with
// the connection down (the offline page has a working "Try again" button).
async function precache() {
  const pages = await caches.open(PAGES);
  const statics = await caches.open(STATIC);
  for (const path of OFFLINE_PAGES) {
    const res = await fetch(path);
    if (!res.ok) continue;
    const html = await res.clone().text();
    await pages.put(path, res);
    const assets = [...new Set([...html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+)"/g)].map((m) => m[1]))];
    await Promise.all(assets.map((a) => statics.add(a).catch(() => undefined)));
  }
  await statics.addAll(PRECACHE);
}

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k.startsWith("meduza-") && k !== PAGES && k !== STATIC && k !== MENU).map((k) => caches.delete(k)))
      )
  );
});

self.addEventListener("message", (event) => {
  // The page asks us to remember itself on the very first visit, before this worker controls it.
  const data = event.data;
  if (data && data.type === "prefetch-menu" && Array.isArray(data.urls)) {
    event.waitUntil(prefetchMenu(data.urls));
    return;
  }
  if (data && data.type === "cache-page" && typeof data.url === "string") {
    const url = new URL(data.url, self.location.origin);
    if (url.origin === self.location.origin && !url.pathname.startsWith("/api/")) {
      event.waitUntil(
        fetch(url.href).then((res) => (res.ok && !res.redirected ? caches.open(PAGES).then((c) => c.put(url.href, res)) : undefined))
      );
    }
  }
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  if (req.mode === "navigate") {
    event.respondWith(networkFirst(req, url));
    return;
  }
  if (url.pathname.startsWith("/menu/") && /\.(avif|webp)$/.test(url.pathname)) {
    event.respondWith(cacheFirst(req));
    return;
  }
  if (url.pathname.startsWith("/_next/static/") || /^\/(photos|logo|icons)\//.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(req));
  }
});

async function networkFirst(req, url) {
  try {
    const res = await fetch(req);
    // Redirected responses cannot be replayed for a navigation, so never store them.
    if (res.ok && !res.redirected) {
      const cache = await caches.open(PAGES);
      cache.put(req, res.clone());
    }
    return res;
  } catch {
    const hit = await caches.match(req);
    if (hit) return hit;
    if (url.pathname === "/") {
      const home = (await caches.match("/en")) || (await caches.match("/ru"));
      if (home) return home;
    }
    const offline = await caches.match(url.pathname.startsWith("/ru") ? "/ru/offline" : "/en/offline");
    return offline || Response.error();
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(STATIC);
  const cached = (await cache.match(req)) || (await caches.match(req));
  const refresh = fetch(req)
    .then((res) => {
      if (res.ok) cache.put(req, res.clone());
      return res;
    })
    .catch(() => undefined);
  return cached || (await refresh) || Response.error();
}

// Menu page images never change under the same URL (the name holds a content hash).
async function cacheFirst(req) {
  const cache = await caches.open(MENU);
  const cached = await cache.match(req);
  if (cached) return cached;
  const res = await fetch(req);
  if (res.ok) cache.put(req, res.clone());
  return res;
}

// The reader asks us to fetch the rest of the current menu in the background.
async function prefetchMenu(urls) {
  const cache = await caches.open(MENU);
  for (const u of urls) {
    const url = new URL(u, self.location.origin);
    if (url.origin !== self.location.origin || !url.pathname.startsWith("/menu/")) continue;
    if (await cache.match(url.href)) continue;
    try {
      const res = await fetch(url.href);
      if (res.ok) await cache.put(url.href, res);
    } catch {
      /* offline or flaky: the reader asks again next visit */
    }
  }
}
