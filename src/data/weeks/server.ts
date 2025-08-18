import { promises as fs } from "fs";
import path from "path";
import type { WeekMenu } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "src", "data", "weeks");

export async function listWeekIds(): Promise<string[]> {
  const entries = await fs.readdir(DATA_DIR);
  return entries
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
}

export async function readWeekMenuById(id: string): Promise<WeekMenu> {
  const file = path.join(DATA_DIR, `${id}.json`);
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw) as WeekMenu;
}

export async function latestWeekId(): Promise<string | null> {
  const ids = await listWeekIds();
  return ids.length ? ids[ids.length - 1] : null;
}


