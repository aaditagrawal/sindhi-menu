import { NextResponse } from "next/server";
import { getAllWeeks, getWeeksMeta } from "@/data/weeks";

export const dynamic = "force-dynamic";

export async function GET() {
  const weekIds = await getAllWeeks();
  const meta = await getWeeksMeta();
  return NextResponse.json({ weekIds, meta });
}


