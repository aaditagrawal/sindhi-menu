import type {
  Meal,
  MealKey,
  MealSection,
  MealSectionKind,
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
import { promises as fs } from 'fs';
import path from 'path';

export type WeekId = string;

interface RawMenuData {
  [day: string]: {
    lunch?: RawMeal;
    dinner?: RawMeal;
  };
}

interface RawMeal {
  specialVeg?: string;
  veg?: string[];
  nonVeg?: string[];
}

const MEAL_TIMINGS: Record<MealKey, { start: string; end: string }> = {
  lunch: { start: "11:30", end: "14:15" },
  dinner: { start: "19:00", end: "21:30" },
};

const SECTION_TITLES: Record<MealSectionKind, string> = {
  specialVeg: "Special Veg",
  veg: "Veg",
  nonVeg: "Non-Veg",
  note: "Note",
};

async function loadFixedMenu(): Promise<WeekMenu> {
  let raw: RawMenuData;

  // During SSR/build time, read file from filesystem
  if (typeof window === 'undefined') {
    const filePath = path.join(process.cwd(), 'public', 'sindhi-menu.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    raw = JSON.parse(fileContents);
  } else {
    // Client-side, use fetch
    const res = await fetch('/sindhi-menu.json', { cache: 'force-cache' });
    if (!res.ok) throw new Error('Failed to load sindhi-menu.json');
    raw = await res.json() as RawMenuData;
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
    pushSection("veg", src.veg);

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
    const rawDay = raw[canonicalDay];

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
    week: `${formatISTShortDate(firstDay)} – ${formatISTShortDate(lastDay)} • Fixed weekly menu`,
    menu,
  };
  return week;
}

function computeWeekIdFromMenu(week: WeekMenu): WeekId {
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
