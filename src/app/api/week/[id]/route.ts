import { NextResponse } from "next/server";
import { readWeekMenuById } from "@/data/weeks/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await readWeekMenuById(params.id);
    return NextResponse.json(data);
  } catch (e) {
    return new NextResponse("Not found", { status: 404 });
  }
}


