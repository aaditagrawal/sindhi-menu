import type {
  Meal,
  MealKey,
  MealSection,
  MealSectionKind,
  MenuExtras,
  WeekMenu,
  WeekMeta,
} from "@/lib/types";
import {
  addISTDays,
  formatDateKey,
  formatISTDayName,
  formatISTShortDate,
  getISTNow,
  sortDateKeysAsc,
  startOfISTWeek,
} from "@/lib/date";
import { getMenuNameForDate, type MenuName } from "@/lib/menuManager";
import { promises as fs } from 'fs';
import path from 'path';

export type WeekId = string;

interface RawMenuData {
  [day: string]: {
    lunch?: RawMeal;
    dinner?: RawMeal;
  };
}

function cloneExtras(extras: MenuExtras): MenuExtras {
  return {
    category: extras.category,
    currency: extras.currency,
    items: extras.items.map((item) => ({ ...item })),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function resolveExtras(raw: unknown): MenuExtras {
  const fallback = cloneExtras(MENU_EXTRAS);
  if (!isRecord(raw)) {
    return fallback;
  }

  const category =
    typeof raw.category === "string" && raw.category.trim().length > 0
      ? raw.category.trim()
      : fallback.category;
  const currency =
    typeof raw.currency === "string" && raw.currency.trim().length > 0
      ? raw.currency.trim()
      : fallback.currency;

  const items = Array.isArray(raw.items)
    ? raw.items
        .map((value) => {
          if (!isRecord(value)) return undefined;
          const name =
            typeof value.name === "string" && value.name.trim().length > 0
              ? value.name.trim()
              : undefined;
          if (!name) return undefined;
          const priceValue = value.price;
          const price =
            typeof priceValue === "number"
              ? priceValue
              : typeof priceValue === "string"
                ? Number(priceValue)
                : Number.NaN;
          if (!Number.isFinite(price)) return undefined;
          return { name, price: Number(price) };
        })
        .filter((item): item is MenuExtras["items"][number] => Boolean(item))
    : [];

  if (items.length === 0) {
    return {
      category,
      currency,
      items: fallback.items,
    };
  }

  return { category, currency, items };
}

function extractMenuAndExtras(source: unknown): { menu: RawMenuData; extras: MenuExtras } {
  if (isRecord(source)) {
    const extras = resolveExtras("extras" in source ? source.extras : undefined);
    if ("menu" in source && isRecord(source.menu)) {
      return { menu: source.menu as RawMenuData, extras };
    }

    const menuEntries = Object.entries(source).filter(
      ([key]) => key !== "extras" && key !== "menu"
    );
    const menu = Object.fromEntries(menuEntries) as RawMenuData;
    return { menu, extras };
  }

  return { menu: source as RawMenuData, extras: resolveExtras(undefined) };
}

interface RawMeal {
  specialVeg?: string;
  veg?: string[];
  vegSides?: string[];
  nonVeg?: string[];
}

const MENU_EXTRAS: MenuExtras = {
  category: "Extras",
  currency: "INR",
  items: [
    { name: "Butter Milk", price: 10 },
    { name: "Dahi", price: 10 },
    { name: "Fruit Juice", price: 50 },
    { name: "Lassi", price: 35 },
    { name: "Boiled Eggs", price: 10 },
    { name: "Lime", price: 25 },
  ],
};

const MEAL_TIMINGS: Record<MealKey, { start: string; end: string }> = {
  lunch: { start: "11:30", end: "14:15" },
  dinner: { start: "19:00", end: "21:30" },
};

const SECTION_TITLES: Record<MealSectionKind, string> = {
  specialVeg: "Special Veg",
  veg: "Veg",
  vegSides: "Veg Sides",
  nonVeg: "Non-Veg",
  note: "Note",
};

/**
 * Load menu for a specific week, using the menu rotation system
 */
export async function loadMenuForDate(date: Date = getISTNow()): Promise<WeekMenu> {
  const menuName = getMenuNameForDate(date);
  return loadMenuByName(menuName);
}

/**
 * Load a menu by its name (menu1, menu2, menu3, menu4)
 */
export async function loadMenuByName(menuName: MenuName): Promise<WeekMenu> {
  let rawMenu: RawMenuData;
  let extrasData: MenuExtras;

  // During SSR/build time, read file from filesystem
  if (typeof window === 'undefined') {
    const filePath = path.join(process.cwd(), 'public', `${menuName}.json`);
    const fileContents = await fs.readFile(filePath, 'utf8');
    ({ menu: rawMenu, extras: extrasData } = extractMenuAndExtras(JSON.parse(fileContents)));
  } else {
    // Client-side, use fetch
    const res = await fetch(`/${menuName}.json`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load ${menuName}.json`);
    const parsed = (await res.json()) as unknown;
    ({ menu: rawMenu, extras: extrasData } = extractMenuAndExtras(parsed));
  }

  const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const menu: WeekMenu["menu"] = {};

  const now = getISTNow();
  const monday = startOfISTWeek(now);

  const buildMeal = (
    src: RawMeal | undefined,
    mealName: MealKey
  ): Meal | undefined => {
    if (!src) return undefined;

    const sections: MealSection[] = [];
    const items: string[] = [];

    const pushSection = (kind: MealSectionKind, rawItems: string[] | string | undefined) => {
      if (!rawItems) return;
      const arr = Array.isArray(rawItems) ? rawItems : [rawItems];
      const cleaned = arr
        .flatMap((item) =>
          String(item)
            .split(/(?:\r?\n|,|;|•)/g)
            .map((part) => part.trim())
        )
        .map((item) => item.replace(/\s+/g, " "))
        .filter(Boolean);
      if (cleaned.length === 0) return;
      sections.push({ kind, title: SECTION_TITLES[kind], items: cleaned });

      for (const value of cleaned) {
        items.push(value);
      }
    };

    pushSection("specialVeg", src.specialVeg);
    pushSection("nonVeg", src.nonVeg);
    
    // Keep veg and vegSides as separate sections
    pushSection("veg", src.veg);
    pushSection("vegSides", src.vegSides);

    if (sections.length === 0) return undefined;

    const { start, end } = MEAL_TIMINGS[mealName];
    return {
      name: mealName,
      startTime: start,
      endTime: end,
      items,
      sections,
    };
  };

  for (let i = 0; i < daysOrder.length; i++) {
    const current = addISTDays(monday, i);
    const key = formatDateKey(current);
    const canonicalDay = daysOrder[i]!;
    const rawDay = rawMenu[canonicalDay];

    menu[key] = {
      day: formatISTDayName(current),
      displayDate: formatISTShortDate(current),
      meals: {
        lunch: buildMeal(rawDay?.lunch, "lunch"),
        dinner: buildMeal(rawDay?.dinner, "dinner"),
      },
    };
  }

  const firstDay = addISTDays(monday, 0);
  const lastDay = addISTDays(monday, daysOrder.length - 1);
  const week: WeekMenu = {
    foodCourt: 'Sindhi Mess',
    week: `${formatISTShortDate(firstDay)} – ${formatISTShortDate(lastDay)} • ${menuName}`,
    menu,
    extras: extrasData,
  };
  return week;
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
