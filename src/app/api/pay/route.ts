import { NextRequest, NextResponse } from "next/server";

/**
 * Payment-only: for people who already registered (e.g. via forms.app)
 * and just need to complete payment. No form data required.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, registrationType } = body;

    const paymentLinkFull = process.env.STRIPE_PAYMENT_LINK_FULL;
    const paymentLinkSibling = process.env.STRIPE_PAYMENT_LINK_SIBLING;

    if (!paymentLinkFull || !paymentLinkSibling) {
      return NextResponse.json(
        { message: "Payment is not configured." },
        { status: 500 }
      );
    }

    const baseUrl =
      registrationType === "sibling" ? paymentLinkSibling : paymentLinkFull;
    const separator = baseUrl.includes("?") ? "&" : "?";
    const url =
      email && typeof email === "string" && email.trim()
        ? `${baseUrl}${separator}prefilled_email=${encodeURIComponent(email.trim())}`
        : baseUrl;

    return NextResponse.json({ url });
  } catch (err) {
    console.error("Pay API error:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
