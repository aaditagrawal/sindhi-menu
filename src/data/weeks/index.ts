import type { WeekMenu } from "@/lib/types";
import { getISTNow } from "@/lib/date";
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


export async function getWeekMenu(id: WeekId): Promise<WeekMenu> {
  const names = new Map<string, MenuName>([["1", "menu1"], ["2", "menu2"], ["3", "menu3"], ["4", "menu4"]]);
  const menuName = names.get(id);
  return menuName ? loadMenuByName(menuName) : loadFixedMenu();
}
