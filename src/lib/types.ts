export type MealKey = "breakfast" | "lunch" | "snacks" | "dinner";

export interface Meal {
  name: string;
  startTime: string; // HH:mm in IST
  endTime: string;   // HH:mm in IST
  items: string[];
}

export interface DayMenu {
  day: string; // e.g. Monday
  meals: Record<MealKey, Meal>;
}

export interface WeekMenu {
  foodCourt: string;
  week: string; // e.g. "August 18 - August 24, 2024"
  menu: Record<string, DayMenu>; // key: YYYY-MM-DD
}

export interface CurrentMealPointer {
  dateKey: string;
  mealKey: MealKey;
  isOngoing: boolean;
}


