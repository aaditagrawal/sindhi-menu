import fs from "fs";
import path from "path";
import type { WeekMenu } from "@/lib/types";

const WEEKS_DIR = path.join(process.cwd(), "src", "data", "weeks");

export type WeekId = string;

export function getAllWeeks(): WeekId[] {
  try {
    const files = fs.readdirSync(WEEKS_DIR);
    return files
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""))
      .sort();
  } catch {
    return [];
  }
}

export function getLatestWeekId(): WeekId {
  const all = getAllWeeks();
  return all[all.length - 1];
}

export async function getWeekMenu(id: WeekId): Promise<WeekMenu> {
  const filePath = path.join(WEEKS_DIR, `${id}.json`);
  const raw = await fs.promises.readFile(filePath, "utf-8");
  return JSON.parse(raw) as WeekMenu;
}


