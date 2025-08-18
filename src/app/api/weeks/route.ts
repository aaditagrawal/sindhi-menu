import { NextResponse } from "next/server";
import { getAllWeeks } from "@/data/weeks";

export const dynamic = "force-dynamic";

export async function GET() {
  const weekIds = getAllWeeks();
  return NextResponse.json({ weekIds });
}


