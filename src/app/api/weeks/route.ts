import { NextResponse } from "next/server";
import { getAllWeeks, getWeeksMeta } from "@/data/weeks";

export const dynamic = "force-dynamic";

export async function GET() {
  const weekIds = await getAllWeeks();
  const meta = await getWeeksMeta();

  // Add cache headers for client-side caching
  const response = NextResponse.json({ weekIds, meta });
  response.headers.set('Cache-Control', 'public, s-maxage=3600, max-age=300'); // 1 hour server, 5 min client
  response.headers.set('CDN-Cache-Control', 'max-age=3600'); // 1 hour on CDN

  return response;
}


