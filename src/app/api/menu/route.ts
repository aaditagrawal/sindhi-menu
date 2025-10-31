import { NextResponse } from "next/server";
import { getLatestWeekId, getWeekMenu } from "@/data/weeks";



export async function GET() {
  try {
    const weekId = await getLatestWeekId();
    const week = await getWeekMenu(weekId);

    return NextResponse.json({
      id: weekId,
      generatedAt: new Date().toISOString(),
      source: "/sindhi-menu.json",
      foodCourt: week.foodCourt,
      week: week.week,
      menu: week.menu,
      extras: week.extras,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to load menu",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
