import { deliverToHostess } from "@/lib/deliver";
import { allow } from "@/lib/rateLimit";
import { formatCancelMessage } from "@/lib/telegram";
import { CancelSchema, digitsIn, fieldErrors, type ErrorCode } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TEN_MIN = 10 * 60_000;

function fail(error: ErrorCode, status: number, fields?: Partial<Record<string, ErrorCode>>) {
  return Response.json({ ok: false, error, fields }, { status });
}

function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/**
 * A guest asks the hostess to cancel a booking. The server cannot check the booking exists (there is
 * no database yet), so this is a request the hostess verifies. It shares the per-IP limit with new
 * bookings, so booking and cancelling together stay under 8 requests in 10 minutes.
 */
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

  // Honeypot: pretend it worked, send nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  const parsed = CancelSchema.safeParse(body);
  if (!parsed.success) {
    const fields = fieldErrors<string>(parsed.error);
    return fail(Object.values(fields)[0] ?? "invalid", 400, fields);
  }
  const cancel = parsed.data;

  if (cancel.phone && !allow(`cancel-phone:${digitsIn(cancel.phone)}`, 3, TEN_MIN)) return fail("rate_limited", 429);

  const failed = await deliverToHostess(formatCancelMessage(cancel), "cancellation");
  if (failed) return fail(failed, failed === "server" ? 500 : 502);

  return Response.json({ ok: true });
}
