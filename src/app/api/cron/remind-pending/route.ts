import { NextResponse } from "next/server";
import { getPendingRegistrationEmails, setLastReminderSent } from "@/lib/sheets";
import { sendMailgunEmail } from "@/lib/mailgun";

const REMINDER_SUBJECT = "Heatherwood Football Camp — Complete your payment";
const PAY_URL = "https://heatherwoodfootballcamp.com/register/pay";

function reminderBody(): string {
  return `Hi there,

You registered for Heatherwood Football Camp but we haven't received your payment yet. Your spot isn't confirmed until payment is complete.

To finish registration and secure your spot, please pay here:
${PAY_URL}

If you have any questions or already paid, just reply to this email.

See you on the field,
Heatherwood Football Camp`;
}

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ") && auth.slice(7) === secret) return true;
  if (request.headers.get("x-cron-secret") === secret) return true;
  return false;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return runReminders();
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return runReminders();
}

const RECEIPT_SUBJECT = "Heatherwood Football Camp — Payment reminder run";

async function runReminders() {
  const pending = await getPendingRegistrationEmails();
  if (pending === null) {
    return NextResponse.json(
      { ok: false, error: "Google Sheet not configured or unavailable" },
      { status: 500 }
    );
  }
  let sent = 0;
  const sentTo: string[] = [];
  for (const { email, sheetRowNumbers } of pending) {
    const ok = await sendMailgunEmail({
      to: email,
      subject: REMINDER_SUBJECT,
      text: reminderBody(),
    });
    if (ok) {
      sent++;
      sentTo.push(email);
      await setLastReminderSent(sheetRowNumbers);
    }
  }

  const notifyEmail = process.env.REMINDER_NOTIFY_EMAIL ?? process.env.REGISTRATION_NOTIFY_EMAIL;
  if (notifyEmail) {
    const receiptText =
      sent === 0
        ? "No payment reminder emails were sent (no pending registrations due for a reminder, or none qualified)."
        : `Payment reminder run completed.\n\nSent ${sent} reminder(s) to:\n${sentTo.map((e) => `- ${e}`).join("\n")}`;
    await sendMailgunEmail({
      to: notifyEmail,
      subject: `${RECEIPT_SUBJECT}: ${sent} sent`,
      text: receiptText,
    });
  }

  return NextResponse.json({ ok: true, sent, total: pending.length });
}
