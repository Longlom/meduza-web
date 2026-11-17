"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Registers the service worker in production only (it would get in the way of development). */
export function RegisterServiceWorker() {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => navigator.serviceWorker.ready)
      .then((reg) => {
        // First visit: the worker does not control this page yet, so ask it to remember the page.
        if (!navigator.serviceWorker.controller) {
          reg.active?.postMessage({ type: "cache-page", url: window.location.href });
        }
      })
      .catch(() => {
        /* offline support is an extra; the site works without it */
      });
  }, [pathname]);

  return null;
}
