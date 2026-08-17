import {
  addISTDays,
  formatDateKey,
  formatISTDayName,
  formatISTShortDate,
  getISTNow,
  startOfISTWeek,
} from "@/lib/date";
import type {
  Meal,
  MealKey,
  MealSection,
  MealSectionKind,
  MenuExtras,
  WeekMenu,
} from "@/lib/types";

/**
 * Contract for the menu documents committed to `public/menu*.json`.
 *
 * Every field is optional because the documents are data, edited independently of this module.
 * The readers below normalise each field, so a document that omits or mis-spells something
 * degrades to a sensible default instead of throwing.
 */
export interface MenuFileMeal {
  specialVeg?: string | string[];
  veg?: string | string[];
  vegSides?: string | string[];
  nonVeg?: string | string[];
}

export interface MenuFileDay {
  lunch?: MenuFileMeal;
  dinner?: MenuFileMeal;
}

export interface MenuFileExtraItem {
  name?: string;
  price?: number | string;
}

export interface MenuFileExtras {
  category?: string;
  currency?: string;
  items?: MenuFileExtraItem[];
}

export interface MenuFile {
  /** Day name (`"Monday"` … `"Saturday"`) to that day's meals. */
  menu?: Record<string, MenuFileDay>;
  extras?: MenuFileExtras;
}

interface MealTiming {
  start: string;
  end: string;
}

const DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

const DEFAULT_EXTRAS = {
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
} satisfies MenuExtras;

const MEAL_TIMINGS = {
  lunch: { start: "11:30", end: "14:15" },
  dinner: { start: "19:00", end: "21:30" },
} satisfies Record<MealKey, MealTiming>;

const SECTION_TITLES = {
  specialVeg: "Special Veg",
  veg: "Veg",
  vegSides: "Veg Sides",
  nonVeg: "Non-Veg",
  note: "Note",
} satisfies Record<MealSectionKind, string>;

/** Trim a documented text field, falling back when it is missing or blank. */
function readText(value: string | undefined, fallback: string): string {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : fallback;
}

/**
 * Split a documented item field into individual menu items.
 * Documents use either a single delimited string or an array of them.
 */
function readItems(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  const parts = Array.isArray(value) ? value : [value];
  return parts
    .flatMap((part) =>
      String(part)
        .split(/(?:\r?\n|,|;|•)/g)
        .map((piece) => piece.trim()),
    )
    .map((piece) => piece.replace(/\s+/g, " "))
    .filter(Boolean);
}

export function readExtras(extras: MenuFileExtras | undefined): MenuExtras {
  const category = readText(extras?.category, DEFAULT_EXTRAS.category);
  const currency = readText(extras?.currency, DEFAULT_EXTRAS.currency);
  const rawItems = Array.isArray(extras?.items) ? extras.items : [];

  const items = rawItems.flatMap((item) => {
    const name = String(item?.name ?? "").trim();
    const price = Number(item?.price ?? Number.NaN);
    return name.length > 0 && Number.isFinite(price) ? [{ name, price }] : [];
  });

  if (items.length === 0) {
    return { category, currency, items: DEFAULT_EXTRAS.items.map((item) => ({ ...item })) };
  }
  return { category, currency, items };
}

function readMeal(source: MenuFileMeal | undefined, mealKey: MealKey): Meal | undefined {
  if (!source) return undefined;

  const sections: MealSection[] = [];
  const items: string[] = [];

  const pushSection = (kind: MealSectionKind, value: string | string[] | undefined) => {
    const cleaned = readItems(value);
    if (cleaned.length === 0) return;
    sections.push({ kind, title: SECTION_TITLES[kind], items: cleaned });
    items.push(...cleaned);
  };

  pushSection("specialVeg", source.specialVeg);
  pushSection("nonVeg", source.nonVeg);

  // Keep veg and vegSides as separate sections
  pushSection("veg", source.veg);
  pushSection("vegSides", source.vegSides);

  if (sections.length === 0) return undefined;

  const { start, end } = MEAL_TIMINGS[mealKey];
  return { name: mealKey, startTime: start, endTime: end, items, sections };
}

/**
 * Project a menu document onto the current IST week.
 *
 * `weekLabel` is appended to the rendered date range so callers can say which rotation the
 * document came from.
 */
export function buildWeekMenu(file: MenuFile, weekLabel: string): WeekMenu {
  const days = file.menu ?? {};
  const monday = startOfISTWeek(getISTNow());
  const menu: WeekMenu["menu"] = {};

  DAYS_ORDER.forEach((dayName, index) => {
    const current = addISTDays(monday, index);
    const source = days[dayName];
    menu[formatDateKey(current)] = {
      day: formatISTDayName(current),
      displayDate: formatISTShortDate(current),
      meals: {
        lunch: readMeal(source?.lunch, "lunch"),
        dinner: readMeal(source?.dinner, "dinner"),
      },
    };
  });

  const lastDay = addISTDays(monday, DAYS_ORDER.length - 1);
  return {
    foodCourt: "Sindhi Mess",
    week: `${formatISTShortDate(monday)} – ${formatISTShortDate(lastDay)} • ${weekLabel}`,
    menu,
    extras: readExtras(file.extras),
  };
}
