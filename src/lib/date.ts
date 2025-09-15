import { type MealKey, type WeekMenu, type CurrentMealPointer } from "./types";

const IST_OFFSET_MINUTES = 5 * 60 + 30; // +05:30
const IST_TIME_ZONE = "Asia/Kolkata";
const DAY_ORDER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const DAY_INDEX_LOOKUP = Object.fromEntries(DAY_ORDER.map((name, index) => [name, index])) as Record<
  (typeof DAY_ORDER)[number],
  number
>;

const dateKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: IST_TIME_ZONE,
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: IST_TIME_ZONE,
  month: "short",
  day: "numeric",
});

const dayNameFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: IST_TIME_ZONE,
  weekday: "long",
});

const shortDayNameFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: IST_TIME_ZONE,
  weekday: "short",
});

export function getISTNow(): Date {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
  return new Date(utcMs + IST_OFFSET_MINUTES * 60_000);
}

export function formatDateKey(date: Date): string {
  return dateKeyFormatter.format(date);
}

export function parseDateKey(dateKey: string): Date {
  return new Date(`${dateKey}T00:00:00Z`);
}

export function formatISTShortDate(date: Date): string {
  return shortDateFormatter.format(date);
}

export function formatISTDayName(date: Date): string {
  return dayNameFormatter.format(date);
}

export function getISTDayIndex(date: Date): number {
  const shortName = shortDayNameFormatter.format(date) as keyof typeof DAY_INDEX_LOOKUP;
  return DAY_INDEX_LOOKUP[shortName];
}

export function addISTDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86_400_000);
}

export function startOfISTWeek(date: Date): Date {
  const dayIndex = getISTDayIndex(date);
  const deltaToMonday = (dayIndex + 6) % 7; // convert Sunday=0 to Monday=0 index
  return addISTDays(date, -deltaToMonday);
}

export function parseTimeToMinutes(timeHHmm: string): number {
  const [h, m] = timeHHmm.split(":").map(Number);
  return h * 60 + m;
}

export function getTimeOfDayMinutes(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function sortDateKeysAsc(keys: string[]): string[] {
  return [...keys].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

export function mealOrder(meal: MealKey): number {
  switch (meal) {
    case "lunch":
      return 0;
    case "dinner":
      return 1;
  }
}

export function findCurrentOrUpcomingMeal(
  week: WeekMenu,
  nowIST: Date = getISTNow()
): CurrentMealPointer | null {
  const dateKeys = sortDateKeysAsc(Object.keys(week.menu));
  if (dateKeys.length === 0) return null;

  const todayKey = formatDateKey(nowIST);
  const todayMinutes = getTimeOfDayMinutes(nowIST);

  const todayData = week.menu[todayKey];
  const orderedMeals: MealKey[] = ["lunch", "dinner"];

  if (todayData) {
    for (const mk of orderedMeals) {
      const meal = todayData.meals[mk];
      if (!meal) continue;
      const start = parseTimeToMinutes(meal.startTime);
      const end = parseTimeToMinutes(meal.endTime);
      if (todayMinutes >= start && todayMinutes <= end) {
        return { dateKey: todayKey, mealKey: mk, isOngoing: true };
      }
    }
    for (const mk of orderedMeals) {
      const meal = todayData.meals[mk];
      if (!meal) continue;
      const start = parseTimeToMinutes(meal.startTime);
      if (todayMinutes < start) {
        return { dateKey: todayKey, mealKey: mk, isOngoing: false };
      }
    }
  }

  // Find the next available day after today
  const nextDayKey = dateKeys.find((k) => k > todayKey) ?? dateKeys[0];
  const nextDay = week.menu[nextDayKey];
  if (!nextDay) return null;

  for (const mk of orderedMeals) {
    if (nextDay.meals[mk]) {
      return { dateKey: nextDayKey, mealKey: mk, isOngoing: false };
    }
  }
  return null;
}

export function pickHighlightMealForDay(
  week: WeekMenu,
  dateKey: string,
  nowIST: Date = getISTNow()
): { mealKey: MealKey; isPrimaryUpcoming: boolean } | null {
  const orderedMeals: MealKey[] = ["lunch", "dinner"];
  const todayKey = formatDateKey(nowIST);
  const day = week.menu[dateKey];
  if (!day) return null;

  // Today: ongoing -> upcoming -> last
  if (dateKey === todayKey) {
    const minutes = getTimeOfDayMinutes(nowIST);
    for (const mk of orderedMeals) {
      const m = day.meals[mk];
      if (!m) continue;
      const s = parseTimeToMinutes(m.startTime);
      const e = parseTimeToMinutes(m.endTime);
      if (minutes >= s && minutes <= e) return { mealKey: mk, isPrimaryUpcoming: true };
    }
    for (const mk of orderedMeals) {
      const m = day.meals[mk];
      if (!m) continue;
      const s = parseTimeToMinutes(m.startTime);
      if (minutes < s) return { mealKey: mk, isPrimaryUpcoming: true };
    }
    // All done today → last available
    for (let i = orderedMeals.length - 1; i >= 0; i--) {
      const mk = orderedMeals[i];
      if (day.meals[mk]) return { mealKey: mk, isPrimaryUpcoming: false };
    }
    return null;
  }

  // Past day: last meal
  if (dateKey < todayKey) {
    for (let i = orderedMeals.length - 1; i >= 0; i--) {
      const mk = orderedMeals[i];
      if (day.meals[mk]) return { mealKey: mk, isPrimaryUpcoming: false };
    }
    return null;
  }

  // Future day: first meal
  for (const mk of orderedMeals) {
    if (day.meals[mk]) return { mealKey: mk, isPrimaryUpcoming: false };
  }
  return null;
}

