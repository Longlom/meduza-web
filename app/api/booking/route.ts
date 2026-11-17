import { allow } from "@/lib/rateLimit";
import { makeReference } from "@/lib/reference";
import { deliverToHostess } from "@/lib/deliver";
import { formatBookingMessage } from "@/lib/telegram";
import {
  BookingSchema,
  checkSchedule,
  digitsIn,
  fieldErrors,
  type ErrorCode
} from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TEN_MIN = 10 * 60_000;

function fail(error: ErrorCode, status: number, fields?: Partial<Record<string, ErrorCode>>) {
  return Response.json({ ok: false, error, fields }, { status });
}

function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: Request) {
  if (!allow(`ip:${clientIp(req)}`, 8, TEN_MIN)) return fail("rate_limited", 429);

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return fail("invalid", 400);
  }
  if (typeof json !== "object" || json === null) return fail("invalid", 400);
  const body = json as Record<string, unknown>;

  // Honeypot: bots fill the hidden field. Pretend it worked, send nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: true, reference: makeReference() });
  }

  const parsed = BookingSchema.safeParse({
    ...body,
    guests: typeof body.guests === "string" ? Number(body.guests) : body.guests
  });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return fail(Object.values(fields)[0] ?? "invalid", 400, fields);
  }
  const booking = parsed.data;

  const scheduleError = checkSchedule(booking.date, booking.time, new Date());
  if (scheduleError) return fail(scheduleError, 400, { time: scheduleError });

  if (!allow(`phone:${digitsIn(booking.phone)}`, 3, TEN_MIN)) return fail("rate_limited", 429);

  const reference = makeReference();
  const text = formatBookingMessage(booking, reference);

  const failed = await deliverToHostess(text);
  if (failed) return fail(failed, failed === "server" ? 500 : 502);

  return Response.json({ ok: true, reference });
}
