import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

async function appendToSheet(row: string[]) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const tabName = process.env.GOOGLE_SHEET_TAB_NAME || "Sheet1";
  const credsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!sheetId || !credsJson) return;

  let credentials: { client_email?: string; private_key?: string };
  try {
    credentials = JSON.parse(credsJson) as { client_email?: string; private_key?: string };
  } catch {
    console.error("Invalid GOOGLE_SERVICE_ACCOUNT_JSON");
    return;
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const range = `${tabName}!A:L`;

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row],
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      parentName,
      email,
      phone,
      childName,
      childAge,
      registrationType,
      week,
      emergencyName,
      emergencyPhone,
      medicalNotes,
    } = body;

    if (
      !parentName ||
      !email ||
      !phone ||
      !childName ||
      childAge == null ||
      !emergencyName ||
      !emergencyPhone
    ) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const paymentLinkFull = process.env.STRIPE_PAYMENT_LINK_FULL;
    const paymentLinkSibling = process.env.STRIPE_PAYMENT_LINK_SIBLING;

    if (!paymentLinkFull || !paymentLinkSibling) {
      console.error("STRIPE_PAYMENT_LINK_FULL or STRIPE_PAYMENT_LINK_SIBLING not set");
      return NextResponse.json(
        { message: "Payment is not configured. Please contact us." },
        { status: 500 }
      );
    }

    // Append to Google Sheet if configured (don't block registration on failure)
    const weekLabels: Record<string, string> = {
      week1: "Week 1: June 1–5",
      week2: "Week 2: June 8–12",
      week3: "Week 3: June 15–19",
    };
    const sheetRow = [
      new Date().toISOString(),
      String(parentName),
      String(email),
      String(phone),
      String(childName),
      String(childAge),
      registrationType === "sibling" ? "Sibling" : "First",
      String(emergencyName),
      String(emergencyPhone),
      String(medicalNotes || ""),
      "Pending",
      week ? weekLabels[week] ?? String(week) : "",
    ];
    try {
      await appendToSheet(sheetRow);
    } catch (err) {
      console.error("Google Sheet append failed:", err);
      // Still return payment URL
    }

    const baseUrl =
      registrationType === "sibling" ? paymentLinkSibling : paymentLinkFull;
    const separator = baseUrl.includes("?") ? "&" : "?";
    const url = `${baseUrl}${separator}prefilled_email=${encodeURIComponent(email)}`;

    return NextResponse.json({ url });
  } catch (err) {
    console.error("Register API error:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
