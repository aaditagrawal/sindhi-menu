import type { WeekMenu } from "@/lib/types";

export const WEEK_IDS = [
  "2024-08-18_to_2024-08-24",
] as const;

export type WeekId = (typeof WEEK_IDS)[number];

export function getAllWeeks(): WeekId[] {
  return [...WEEK_IDS].sort();
}

export function getLatestWeekId(): WeekId {
  return getAllWeeks()[getAllWeeks().length - 1];
}

// Static imports keep it fast and tree-shakeable
export async function getWeekMenu(id: WeekId): Promise<WeekMenu> {
  switch (id) {
    case "2024-08-18_to_2024-08-24":
      return (await import("./2024-08-18_to_2024-08-24.json")).default as WeekMenu;
    default:
      throw new Error(`Unknown week id: ${id}`);
  }
}


