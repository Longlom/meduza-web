import { daypart } from "@/lib/daypart";
import { MENU_EVENING_DEFAULT } from "@/lib/venue";
import type { MenuId } from "@/lib/menu/manifest";

/** The menu `/menu` opens: brunch during the day, the evening default after the evening start. */
export function defaultMenu(now: Date): MenuId {
  return daypart(now) === "day" ? "brunch" : MENU_EVENING_DEFAULT;
}
