import { NextRequest, NextResponse } from "next/server";
import { markRegistrationPaidByEmail } from "@/lib/sheets";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ") && auth.slice(7) === secret) return true;
  if (request.headers.get("x-cron-secret") === secret) return true;
  return false;
}

/**
 * Mark the first Pending registration row for the given email as Paid.
 * Use when a payment was completed but the webhook didn't update the sheet
 * (e.g. email mismatch, or week-full guard). Bypasses capacity check.
 *
 * POST /api/admin/mark-paid
 * Authorization: Bearer <CRON_SECRET>
 * Body: { "email": "parent@example.com" }
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!email) {
    return NextResponse.json(
      { error: "Missing or invalid email in body" },
      { status: 400 },
    );
  }

  try {
    const updated = await markRegistrationPaidByEmail(email, {
      skipCapacityCheck: true,
    });
    if (!updated) {
      return NextResponse.json(
        { ok: false, message: "No Pending row found for this email" },
        { status: 200 },
      );
    }
    return NextResponse.json({ ok: true, message: "Marked as Paid" });
  } catch (err) {
    console.error("[admin/mark-paid]", err);
    return NextResponse.json(
      { error: "Failed to update sheet" },
      { status: 500 },
    );
  }
}
