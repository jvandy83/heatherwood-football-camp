import { NextRequest, NextResponse } from "next/server";
import { getSheetsClient, getSpotsPerWeek, sheetRange } from "@/lib/sheets";

function splitName(full: string): [string, string] {
  const t = full.trim();
  const i = t.indexOf(" ");
  if (i <= 0) return [t, ""];
  return [t.slice(0, i), t.slice(i + 1).trim()];
}

async function appendToSheet(row: string[]): Promise<boolean> {
  const client = await getSheetsClient();
  if (!client) {
    console.warn("Google Sheet not configured: GOOGLE_SHEET_ID or GOOGLE_SERVICE_ACCOUNT_JSON missing. Registration not saved to sheet.");
    return false;
  }

  const { sheets, sheetId, tabName } = client;
  const range = sheetRange(tabName, "A1:X");

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row],
    },
  });
  return true;
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
      tshirtSize,
      experienceLevel,
      gradeEntering,
      extendedPickup,
      pickupTime,
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

    // Enforce capacity per week (count Paid + Pending so we don't over-accept)
    if (week) {
      const spots = await getSpotsPerWeek({ includePending: true });
      if (spots && spots[week] !== undefined && spots[week] <= 0) {
        return NextResponse.json(
          { message: "That week is full. Please choose another week." },
          { status: 400 }
        );
      }
    }

    // Append to Google Sheet in same column order as existing forms.app sheet, then Payment Status (W) and Week (X)
    const weekLabels: Record<string, string> = {
      week1: "Week 1: June 1–5",
      week2: "Week 2: June 8–12",
      week3: "Week 3: June 15–19",
    };
    const [childFirst, childLast] = splitName(String(childName));
    const [parentFirst, parentLast] = splitName(String(parentName));
    const sheetRow = [
      childFirst,                    // A: Camper First Name
      childLast,                     // B: Camper Last Name
      "",                            // C: Camper DOB (we don't collect)
      String(childAge),              // D: Camper's Age
      String(gradeEntering ?? ""),   // E: Grade (Entering Fall)
      parentFirst,                   // F: Parent First Name
      parentLast,                    // G: Parent Last Name
      String(email),                 // H: Parent Email
      String(phone),                 // I: Parent Phone
      "",                            // J: Home Address (we don't collect)
      String(emergencyName),         // K: Emergency Contact Name
      String(emergencyPhone),        // L: Emergency Contact Phone
      extendedPickup === "yes" ? "Yes" : "No",  // M: Later pickup interest
      extendedPickup === "yes" ? String(pickupTime ?? "") : "", // N: Pickup time
      String(experienceLevel ?? ""), // O: Experience level
      String(tshirtSize ?? ""),       // P: T-Shirt Size
      String(medicalNotes ?? ""),    // Q: Allergies/medical
      "",                            // R: Other instructions
      "✓",                           // S: Waiver
      "Website",                     // T: Submitter
      new Date().toISOString(),      // U: Submission Date
      "",                            // V: Submission ID
      "Pending",                     // W: Payment Status
      week ? weekLabels[week] ?? String(week) : "", // X: Week
    ];
    let sheetOk = false;
    try {
      sheetOk = await appendToSheet(sheetRow);
    } catch (err) {
      console.error("Google Sheet append failed:", err);
      // Still return payment URL so they can pay; sheet can be updated manually
    }
    if (!sheetOk) {
      console.warn("Registration submitted but not saved to sheet (check Vercel env: GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_JSON, and sheet shared with service account).");
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
