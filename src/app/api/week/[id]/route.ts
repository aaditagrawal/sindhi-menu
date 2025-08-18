import { NextResponse } from "next/server";
import { getAllWeeks, getWeekMenu } from "@/data/weeks";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const id = decodeURIComponent(segments[segments.length - 1] || "");
  const all = getAllWeeks();
  if (!all.includes(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  try {
    const menu = await getWeekMenu(id);
    return NextResponse.json(menu);
  } catch {
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}


