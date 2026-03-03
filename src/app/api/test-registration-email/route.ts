import { NextRequest, NextResponse } from "next/server";
import { buildRegistrationReceivedText, getRegistrationSubject } from "@/lib/registration-email";
import { sendMailgunEmail } from "@/lib/mailgun";

const WEEK_LABELS: Record<string, string> = {
  week1: "Week 1: June 1–5",
  week2: "Week 2: June 8–12",
  week3: "Week 3: June 15–19",
};

/**
 * GET /api/test-registration-email — Dev only. Preview or send the registration email.
 * Query params: parentName, childName, week (week1|week2|week3), registrationType (sibling|first), extendedPickup (yes|no), pickupTime
 * Add ?sendTo=you@example.com to send a real test email to that address.
 */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const parentName = searchParams.get("parentName") ?? "Jane Smith";
  const childName = searchParams.get("childName") ?? "Sam Smith";
  const week = searchParams.get("week") ?? "week1";
  const registrationType = searchParams.get("registrationType") ?? undefined;
  const extendedPickup = searchParams.get("extendedPickup") ?? "no";
  const pickupTime = searchParams.get("pickupTime") ?? "";
  const sendTo = searchParams.get("sendTo");

  const weekLabel = WEEK_LABELS[week] ?? week;

  const subject = getRegistrationSubject(registrationType ?? undefined);
  const text = buildRegistrationReceivedText({
    parentName,
    childName,
    weekLabel,
    registrationType: registrationType ?? undefined,
    extendedPickup,
    pickupTime: extendedPickup === "yes" ? pickupTime || "3:30pm" : undefined,
  });

  if (sendTo) {
    const ok = await sendMailgunEmail({ to: sendTo, subject, text });
    return NextResponse.json({
      sent: ok,
      to: sendTo,
      subject,
      message: ok ? "Test email sent." : "Mailgun not configured or send failed.",
    });
  }

  return NextResponse.json({ subject, text });
}
