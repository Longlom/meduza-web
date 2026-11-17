import { useSyncExternalStore } from "react";

/** True when the media query matches. Always false on the server and during hydration (phone first). */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (notify) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", notify);
      return () => mql.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
