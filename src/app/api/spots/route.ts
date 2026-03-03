import { NextResponse } from "next/server";
import { getDefaultSpots, getSpotsPerWeek } from "@/lib/sheets";

export async function GET() {
  try {
    const spots = await getSpotsPerWeek({ includePending: true });
    const data = spots === null ? getDefaultSpots() : spots;
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (err) {
    console.error("Spots API error:", err);
    return NextResponse.json(getDefaultSpots(), {
      status: 200,
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  }
}
