export type MealKey = "lunch" | "dinner";

export type MealSectionKind = "specialVeg" | "veg" | "nonVeg" | "note";

export interface MealSection {
  kind: MealSectionKind;
  title: string;
  items: string[];
}

export interface Meal {
  name: string;
  startTime: string; // HH:mm in IST
  endTime: string;   // HH:mm in IST
  items: string[];
  sections: MealSection[];
}

export interface DayMenu {
  day: string; // e.g. Monday
  displayDate: string; // e.g. Sep 04
  meals: Partial<Record<MealKey, Meal>>;
}

export interface WeekMenu {
  foodCourt: string;
  week: string; // e.g. "Sindhi Mess — Weekly Menu"
  menu: Record<string, DayMenu>; // key: YYYY-MM-DD
}

export interface CurrentMealPointer {
  dateKey: string;
  mealKey: MealKey;
  isOngoing: boolean;
}

export interface WeekMeta {
  id: string;
  year: string;
  foodCourt: string;
  week: string;
}
