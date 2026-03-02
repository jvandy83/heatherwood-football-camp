import { google } from "googleapis";

function getSheetsClient() {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const tabName = process.env.GOOGLE_SHEET_TAB_NAME || "Sheet1";
  const credsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!sheetId || !credsJson) return null;

  let credentials: { client_email?: string; private_key?: string };
  try {
    credentials = JSON.parse(credsJson) as {
      client_email?: string;
      private_key?: string;
    };
  } catch {
    return null;
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  return { sheets, sheetId, tabName };
}

/**
 * Find the first row with the given email and "Pending" payment status,
 * and update that row's Payment Status (column K) to "Paid".
 */
export async function markRegistrationPaidByEmail(email: string): Promise<void> {
  const client = getSheetsClient();
  if (!client) return;

  const { sheets, sheetId, tabName } = client;
  const range = `${tabName}!A2:K1000`;
  const normalizedEmail = email.trim().toLowerCase();

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });

  const rows = data.values as string[][] | undefined;
  if (!rows || rows.length === 0) return;

  // Columns: A=0 Timestamp, B=1 Parent, C=2 Email, ... K=10 Payment Status
  const emailColIndex = 2;
  const statusColIndex = 10;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowEmail = (row[emailColIndex] ?? "").trim().toLowerCase();
    const status = (row[statusColIndex] ?? "").trim();
    if (rowEmail === normalizedEmail && status === "Pending") {
      const sheetRowNumber = i + 2; // data starts at row 2
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `${tabName}!K${sheetRowNumber}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [["Paid"]],
        },
      });
      return;
    }
  }
}

const WEEK_LABELS = [
  "Week 1: June 1–5",
  "Week 2: June 8–12",
  "Week 3: June 15–19",
] as const;

const WEEK_KEYS = ["week1", "week2", "week3"] as const;

const CAPACITY_PER_WEEK = 20;

/**
 * Get available spots per week by counting registrations in the sheet (column L = Week).
 * Returns { week1: number, ... } for available spots, or null if sheet not configured.
 */
export async function getSpotsPerWeek(): Promise<Record<string, number> | null> {
  const client = getSheetsClient();
  if (!client) return null;

  const { sheets, sheetId, tabName } = client;
  const range = `${tabName}!A2:L1000`;

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });

  const rows = data.values as string[][] | undefined;
  if (!rows || rows.length === 0) {
    return Object.fromEntries(WEEK_KEYS.map((k) => [k, CAPACITY_PER_WEEK]));
  }

  const weekColIndex = 11;
  const counts: Record<string, number> = { week1: 0, week2: 0, week3: 0 };

  for (const row of rows) {
    const weekLabel = (row[weekColIndex] ?? "").trim();
    const idx = WEEK_LABELS.indexOf(weekLabel as (typeof WEEK_LABELS)[number]);
    if (idx >= 0 && WEEK_KEYS[idx]) counts[WEEK_KEYS[idx]]++;
  }

  return {
    week1: Math.max(0, CAPACITY_PER_WEEK - counts.week1),
    week2: Math.max(0, CAPACITY_PER_WEEK - counts.week2),
    week3: Math.max(0, CAPACITY_PER_WEEK - counts.week3),
  };
}
