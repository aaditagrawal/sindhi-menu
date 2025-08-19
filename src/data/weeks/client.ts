"use client";

import type { WeekMenu, WeekMeta } from "@/lib/types";

export type WeekId = string;

export async function fetchWeeksInfo(): Promise<{ weekIds: WeekId[]; meta: WeekMeta[] }>{
  const res = await fetch(`/api/weeks`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch week ids");
  const data = (await res.json()) as { weekIds: WeekId[]; meta: WeekMeta[] };
  return data;
}

export async function getWeekMenuClient(id: WeekId): Promise<WeekMenu> {
  const res = await fetch(`/api/week/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch week menu");
  return (await res.json()) as WeekMenu;
}

export function getWeeksByYearFromList(all: WeekId[], year: string): WeekId[] {
  return all.filter((id) => id.startsWith(`${year}-`)).sort();
}

export function getAllYearsFromList(all: WeekId[]): string[] {
  const set = new Set<string>();
  for (const id of all) set.add(id.slice(0, 4));
  return Array.from(set).sort();
}

export function getLatestWeekIdForYearFromList(all: WeekId[], year: string): WeekId | null {
  const weeks = getWeeksByYearFromList(all, year);
  if (weeks.length === 0) return null;
  return weeks[weeks.length - 1];
}


