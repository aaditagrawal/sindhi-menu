import { type MealKey, type WeekMenu, type CurrentMealPointer } from "./types";

const IST_OFFSET_MINUTES = 5 * 60 + 30; // +05:30

export function getISTNow(): Date {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
  return new Date(utcMs + IST_OFFSET_MINUTES * 60_000);
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
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
    case "breakfast":
      return 0;
    case "lunch":
      return 1;
    case "snacks":
      return 2;
    case "dinner":
      return 3;
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
  const orderedMeals: MealKey[] = ["breakfast", "lunch", "snacks", "dinner"];

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


