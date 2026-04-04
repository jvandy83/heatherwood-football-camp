import { NextResponse } from "next/server";
import {
  getDefaultSpots,
  getSpotsPerWeek,
  isWeek3BlockedUntilWeek2Full,
} from "@/lib/sheets";

function spotsPayload(spots: Record<string, number>) {
  return {
    ...spots,
    week3BlockedUntilWeek2Full: isWeek3BlockedUntilWeek2Full(spots),
  };
}

export async function GET() {
  try {
    const spots = await getSpotsPerWeek({ includePending: true });
    const data = spots === null ? getDefaultSpots() : spots;
    return NextResponse.json(spotsPayload(data), {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (err) {
    console.error("Spots API error:", err);
    return NextResponse.json(spotsPayload(getDefaultSpots()), {
      status: 200,
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  }
}
