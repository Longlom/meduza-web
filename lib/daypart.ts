import { toMin, venueClock } from "@/lib/time";
import { EVENING_STARTS, OPEN_TO } from "@/lib/venue";

export type Daypart = "day" | "evening";

/** Evening runs from the evening start until closing (02:00); everything else counts as day. */
export function daypart(now: Date): Daypart {
  const { minutes } = venueClock(now);
  return minutes >= toMin(EVENING_STARTS) || minutes < toMin(OPEN_TO) ? "evening" : "day";
}
