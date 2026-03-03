import { NextResponse } from "next/server";
import { getDefaultSpots, getSpotsPerWeek } from "@/lib/sheets";

export async function GET() {
  try {
    const spots = await getSpotsPerWeek();
    if (spots === null) {
      return NextResponse.json(getDefaultSpots());
    }
    return NextResponse.json(spots);
  } catch (err) {
    console.error("Spots API error:", err);
    return NextResponse.json(getDefaultSpots(), { status: 200 });
  }
}
