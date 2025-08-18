import { NextResponse } from "next/server";
import { listWeekIds } from "@/data/weeks/server";

export async function GET() {
  const ids = await listWeekIds();
  return NextResponse.json({ weekIds: ids });
}


