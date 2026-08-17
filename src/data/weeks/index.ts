import type { WeekMenu, WeekMeta } from "@/lib/types";
import { getISTNow, sortDateKeysAsc } from "@/lib/date";
import { buildWeekMenu, type MenuFile } from "@/lib/menuFile";
import { getMenuNameForDate, type MenuName } from "@/lib/menuManager";
import { promises as fs } from "fs";
import path from "path";

export type WeekId = string;

/**
 * Load menu for a specific week, using the menu rotation system
 */
export async function loadMenuForDate(date: Date = getISTNow()): Promise<WeekMenu> {
  return loadMenuByName(getMenuNameForDate(date));
}

/**
 * Load a menu by its name (menu1, menu2, menu3, menu4).
 *
 * This module reads from the filesystem, so it only runs during SSR and static generation.
 * The browser loads the same documents over `fetch` in `MenuViewer`.
 */
export async function loadMenuByName(menuName: MenuName): Promise<WeekMenu> {
  const filePath = path.join(process.cwd(), "public", `${menuName}.json`);
  const fileContents = await fs.readFile(filePath, "utf8");
  // SAFETY: `public/menu*.json` is committed alongside this code and authored against `MenuFile`,
  // whose fields are all optional; `buildWeekMenu` normalises every field it reads, so a document
  // that drifts from the contract degrades to defaults rather than producing an invalid `WeekMenu`.
  const file = JSON.parse(fileContents) as MenuFile;
  return buildWeekMenu(file, menuName);
}

/**
 * Load the fixed menu (backward compatibility)
 */
export async function loadFixedMenu(): Promise<WeekMenu> {
  return loadMenuForDate();
}

export function computeWeekIdFromMenu(week: WeekMenu): WeekId {
  const keys = sortDateKeysAsc(Object.keys(week.menu));
  const start = keys[0];
  const end = keys[keys.length - 1];
  return `${start}_to_${end}`;
}

export async function getAllWeeks(): Promise<WeekId[]> {
  const latest = await getLatestWeekId();
  return latest ? [latest] : [];
}

export async function getLatestWeekId(): Promise<WeekId> {
  const latestWeek = await loadFixedMenu();
  return computeWeekIdFromMenu(latestWeek);
}

// oxlint-disable-next-line @typescript-eslint/no-unused-vars
export async function getWeekMenu(_id: WeekId): Promise<WeekMenu> {
  // For fixed menu, ignore id and return the same constructed week for current dates
  return loadFixedMenu();
}

export async function getWeeksMeta(): Promise<WeekMeta[]> {
  const ids = await getAllWeeks();
  const metas: WeekMeta[] = [];
  for (const id of ids) {
    const menu = await getWeekMenu(id);
    metas.push({ id, year: id.slice(0, 4), foodCourt: menu.foodCourt, week: menu.week });
  }
  return metas;
}
