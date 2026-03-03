import { NextResponse } from "next/server";
import { getSheetsClient, sheetRange } from "@/lib/sheets";

/**
 * GET /api/test-sheet — Only in development. Appends a test row to verify Google Sheets config.
 * Open http://localhost:3000/api/test-sheet in the browser while running npm run dev.
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 });
  }

  const client = await getSheetsClient();
  if (!client) {
    return NextResponse.json(
      {
        ok: false,
        error: "Google Sheet not configured. Check GOOGLE_SHEET_ID and GOOGLE_SERVICE_ACCOUNT_JSON.",
      },
      { status: 500 }
    );
  }

  const { sheets, sheetId, tabName } = client;
  const testRow = [
    "TEST",
    "ROW",
    "",
    "0",
    "",
    "Test",
    "User",
    "test-sheet-check@example.com",
    "",
    "",
    "Test",
    "Contact",
    "No",
    "",
    "",
    "",
    "",
    "",
    "✓",
    "Website",
    new Date().toISOString(),
    "",
    "Pending",
    "Week 1: June 1–5",
  ];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: sheetRange(tabName, "A1:X"),
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [testRow] },
    });
    return NextResponse.json({
      ok: true,
      message: "Test row appended. Check your sheet — you can delete that row.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Test sheet append failed:", err);
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
