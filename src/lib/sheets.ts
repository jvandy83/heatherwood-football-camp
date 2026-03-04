import { google } from "googleapis";

export async function getSheetsClient(): Promise<{
  sheets: ReturnType<typeof google.sheets>;
  sheetId: string;
  tabName: string;
} | null> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const tabName = process.env.GOOGLE_SHEET_TAB_NAME || "Sheet1";
  const credsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!sheetId || !credsJson) return null;

  let credentials: { client_email?: string; private_key?: string };
  try {
    const normalized = credsJson.replace(/\r\n?|\n/g, "");
    credentials = JSON.parse(normalized) as {
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
  const resolvedTitle = await resolveSheetTitle(sheets, sheetId, tabName);
  return { sheets, sheetId, tabName: resolvedTitle };
}

/** Get the exact sheet title from the spreadsheet (fixes "Unable to parse range" when tab name differs). */
async function resolveSheetTitle(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  tabName: string
): Promise<string> {
  const res = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties(title)",
  });
  const titles = res.data.sheets?.map((s) => s.properties?.title).filter(Boolean) as string[] | undefined;
  if (!titles?.length) return tabName;
  const match = titles.find((t) => t === tabName || t.toLowerCase() === tabName.toLowerCase());
  return match ?? titles[0];
}

/** Build a range string. Quote sheet name only when it contains spaces or special chars. */
export function sheetRange(tabName: string, cellRange: string): string {
  const needsQuotes = /[\s'()]/.test(tabName);
  if (needsQuotes) {
    const escaped = tabName.replace(/'/g, "''");
    return `'${escaped}'!${cellRange}`;
  }
  return `${tabName}!${cellRange}`;
}

/**
 * Find the first row with the given email and "Pending" or empty payment status.
 * Treats empty W (existing forms.app rows) as Pending so they get marked Paid when they pay.
 * Only marks as "Paid" if that week still has capacity. If row has no Week (X), treats as week 1 and fills X.
 * Returns true if updated, false if skipped (e.g. week full).
 */
export async function markRegistrationPaidByEmail(email: string): Promise<boolean> {
  const client = await getSheetsClient();
  if (!client) return false;

  const { sheets, sheetId, tabName } = client;
  const range = sheetRange(tabName, "A2:X1000");
  const normalizedEmail = email.trim().toLowerCase();

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });

  const rows = data.values as string[][] | undefined;
  if (!rows || rows.length === 0) return false;

  // Existing sheet: H=7 Email, W=22 Payment Status, X=23 Week
  const emailColIndex = 7;
  const statusColIndex = 22;
  const weekColIndex = 23;

  const spots = await getSpotsPerWeek();
  if (!spots) return false;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowEmail = (row[emailColIndex] ?? "").trim().toLowerCase();
    const status = (row[statusColIndex] ?? "").trim();
    const isPendingOrEmpty = status === "Pending" || status === "";
    if (rowEmail !== normalizedEmail || !isPendingOrEmpty) continue;

    const weekLabel = (row[weekColIndex] ?? "").trim();
    const weekIdx = WEEK_LABELS.indexOf(weekLabel as (typeof WEEK_LABELS)[number]);
    const weekKey = weekIdx >= 0 ? WEEK_KEYS[weekIdx] : null;
    const effectiveWeek = weekKey ?? "week1";
    if (spots[effectiveWeek] <= 0) {
      return false;
    }

    const sheetRowNumber = i + 2;
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: sheetRange(tabName, `W${sheetRowNumber}:X${sheetRowNumber}`),
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            "Paid",
            weekLabel || WEEK_LABELS[0],
          ],
        ],
      },
    });
    return true;
  }
  return false;
}

const WEEK_LABELS = [
  "Week 1: June 1–5",
  "Week 2: June 8–12",
  "Week 3: June 15–19",
] as const;

const WEEK_KEYS = ["week1", "week2", "week3"] as const;

const CAPACITY_PER_WEEK = 20;

/** Reserved spots per week (not in sheet — e.g. coach's kids, verbal commits). From env RESERVED_SPOTS_WEEK1, etc. */
function getReservedSpots(): Record<string, number> {
  const n = (key: string) => {
    const v = process.env[key];
    if (v === undefined || v === "") return key === "RESERVED_SPOTS_WEEK1" ? 3 : 0;
    const num = parseInt(v, 10);
    return Number.isNaN(num) ? 0 : Math.max(0, num);
  };
  return {
    week1: n("RESERVED_SPOTS_WEEK1"),
    week2: n("RESERVED_SPOTS_WEEK2"),
    week3: n("RESERVED_SPOTS_WEEK3"),
  };
}

/** Default spots when sheet is unavailable (capacity minus reserved per week). */
export function getDefaultSpots(): Record<string, number> {
  const r = getReservedSpots();
  return {
    week1: Math.max(0, CAPACITY_PER_WEEK - r.week1),
    week2: Math.max(0, CAPACITY_PER_WEEK - r.week2),
    week3: Math.max(0, CAPACITY_PER_WEEK - r.week3),
  };
}

/**
 * Get available spots per week.
 * By default only counts "Paid" (payment confirmed) — so spots fill as payments complete.
 * Option includePending: true counts both Paid and Pending (for validation so we don't over-accept form submissions).
 */
export async function getSpotsPerWeek(options?: {
  includePending?: boolean;
}): Promise<Record<string, number> | null> {
  const client = await getSheetsClient();
  if (!client) return null;

  const { sheets, sheetId, tabName } = client;
  const range = sheetRange(tabName, "A2:X1000");

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });

  const reserved = getReservedSpots();
  const rows = data.values as string[][] | undefined;
  if (!rows || rows.length === 0) {
    return getDefaultSpots();
  }

  const weekColIndex = 23;  // X
  const statusColIndex = 22; // W
  const counts: Record<string, number> = { week1: 0, week2: 0, week3: 0 };

  for (const row of rows) {
    const status = (row[statusColIndex] ?? "").trim();
    if (options?.includePending) {
      if (status !== "Paid" && status !== "Pending") continue;
    } else {
      if (status !== "Paid") continue;
    }
    const weekLabel = (row[weekColIndex] ?? "").trim();
    const idx = WEEK_LABELS.indexOf(weekLabel as (typeof WEEK_LABELS)[number]);
    if (idx >= 0 && WEEK_KEYS[idx]) counts[WEEK_KEYS[idx]]++;
  }

  return {
    week1: Math.max(0, CAPACITY_PER_WEEK - reserved.week1 - counts.week1),
    week2: Math.max(0, CAPACITY_PER_WEEK - reserved.week2 - counts.week2),
    week3: Math.max(0, CAPACITY_PER_WEEK - reserved.week3 - counts.week3),
  };
}
