import { NextResponse } from "next/server";
import { getSpotsPerWeek } from "@/lib/sheets";

export async function GET() {
  try {
    const spots = await getSpotsPerWeek();
    if (spots === null) {
      return NextResponse.json({
        week1: 11,
        week2: 20,
        week3: 20,
      });
    }
    return NextResponse.json(spots);
  } catch (err) {
    console.error("Spots API error:", err);
    return NextResponse.json(
      { week1: 11, week2: 20, week3: 20 },
      { status: 200 }
    );
  }
}
