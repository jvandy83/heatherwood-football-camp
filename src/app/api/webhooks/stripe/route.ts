import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendMailgunEmail } from "@/lib/mailgun";
import { markRegistrationPaidByEmail } from "@/lib/sheets";

const PAYMENT_CONFIRMED_SUBJECT = "Heatherwood Football Camp — Payment received, you're confirmed";

const PAYMENT_CONFIRMED_TEXT = `Thanks for registering for Heatherwood Football Camp. We've received your payment and your spot is confirmed.

Camp runs 9:00am–2:00pm. If you signed up for optional extended pickup, you can pick up at Coach Jared's until 4:00pm (4783 Dorchester Cir, Boulder, CO 80301).

If you have any questions, reply to this email or contact us at heatherwoodfootballcamp@gmail.com.

See you at camp!`;

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  let body: string;
  try {
    body = await request.text();
  } catch {
    return NextResponse.json(
      { error: "Invalid body" },
      { status: 400 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 }
    );
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error("STRIPE_SECRET_KEY is not set (required for webhook verification)");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(secretKey);
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    // Stripe often leaves customer_email null; use customer_details.email when present
    const email =
      (session.customer_email as string | null | undefined)?.trim() ||
      (session.customer_details?.email as string | null | undefined)?.trim() ||
      undefined;

    if (email) {
      try {
        const updated = await markRegistrationPaidByEmail(email);
        if (!updated) {
          console.warn(
            "[Stripe webhook] Payment received but sheet not updated (no Pending row for email, or week full):",
            email,
          );
        } else {
          await sendMailgunEmail({
            to: email,
            subject: PAYMENT_CONFIRMED_SUBJECT,
            text: PAYMENT_CONFIRMED_TEXT,
          });
        }
      } catch (err) {
        console.error("[Stripe webhook] Failed to update sheet with payment:", err);
        // Still return 200 so Stripe doesn't retry; the sheet update is best-effort
      }
    } else {
      console.warn("[Stripe webhook] checkout.session.completed had no customer email");
    }
  }

  return NextResponse.json({ received: true });
}
