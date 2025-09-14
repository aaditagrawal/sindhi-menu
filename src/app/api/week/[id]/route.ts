import { NextResponse } from "next/server";
import { getAllWeeks, getWeekMenu } from "@/data/weeks";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const id = decodeURIComponent(segments[segments.length - 1] || "");
  const all = await getAllWeeks();
  if (!all.includes(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  try {
    const menu = await getWeekMenu(id);

    // Add cache headers for client-side caching
    const response = NextResponse.json(menu);
    response.headers.set('Cache-Control', 'public, s-maxage=900, max-age=300'); // 15 min server, 5 min client
    response.headers.set('CDN-Cache-Control', 'max-age=900'); // 15 min on CDN

    return response;
  } catch {
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}


