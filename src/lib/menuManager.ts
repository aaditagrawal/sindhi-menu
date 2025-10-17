/**
 * Menu Manager: Handles rotation of 4 menus in a cyclical pattern (1 -> 2 -> 3 -> 4 -> 1)
 * 
 * Reference Point: As of Oct 16, 2025, Sindhi Mess is on Week 2.
 * This means:
 * - Week 1 would use menu2
 * - Week 2 (current) uses menu2
 * - Week 3 uses menu3
 * - Week 4 uses menu4
 * - Week 5 uses menu1
 * - And the cycle repeats...
 */

export type MenuName = "menu1" | "menu2" | "menu3" | "menu4";

// October 16, 2025 is the reference point for Week 2
const REFERENCE_DATE = new Date("2025-10-13"); // Monday of Week 2
const REFERENCE_WEEK_NUMBER = 2;

/**
 * Calculate which week number we're in based on a reference date
 */
export function getWeekNumberFromDate(date: Date): number {
  // Get start of week (Monday) in IST
  const IST_OFFSET_MINUTES = 5 * 60 + 30;
  const utcMs = date.getTime() + date.getTimezoneOffset() * 60_000;
  const istDate = new Date(utcMs + IST_OFFSET_MINUTES * 60_000);

  // Calculate Monday of this week
  const dayOfWeek = istDate.getDay();
  const daysSinceMonday = (dayOfWeek + 6) % 7; // Sunday is 0, so Monday is index 1
  const monday = new Date(istDate);
  monday.setDate(istDate.getDate() - daysSinceMonday);
  monday.setHours(0, 0, 0, 0);

  // Calculate number of weeks since reference
  const timeDiff = monday.getTime() - REFERENCE_DATE.getTime();
  const weeksDiff = Math.round(timeDiff / (7 * 24 * 60 * 60 * 1000));
  const currentWeekNumber = REFERENCE_WEEK_NUMBER + weeksDiff;

  return currentWeekNumber;
}

/**
 * Get the menu number (1-4) for a given week number
 * Week 2 maps to menu2
 */
export function getMenuNumberForWeek(weekNumber: number): number {
  // Week 1 -> menu1, Week 2 -> menu2, Week 3 -> menu3, Week 4 -> menu4, Week 5 -> menu1...
  // Formula: ((weekNumber - 1) % 4) + 1
  const offset = ((weekNumber - 1) % 4 + 4) % 4;
  return offset + 1;
}

/**
 * Get the menu name for a given week number
 */
export function getMenuNameForWeek(weekNumber: number): MenuName {
  const menuNumber = getMenuNumberForWeek(weekNumber);
  return `menu${menuNumber}` as MenuName;
}

/**
 * Get the menu name for a given date
 */
export function getMenuNameForDate(date: Date): MenuName {
  const weekNumber = getWeekNumberFromDate(date);
  return getMenuNameForWeek(weekNumber);
}

/**
 * Get metadata about the current menu state
 */
export function getMenuMetadata(date: Date = new Date()) {
  const weekNumber = getWeekNumberFromDate(date);
  const menuName = getMenuNameForWeek(weekNumber);
  const menuNumber = parseInt(menuName.replace("menu", ""), 10);

  return {
    weekNumber,
    menuName,
    menuNumber,
    description: `Week ${weekNumber} • ${menuName}`,
  };
}

/**
 * Override the current week (for user preference)
 */
export function getMenuNameForOverriddenWeek(
  userOverrideWeekNumber: number | null,
  currentDate: Date = new Date()
): { menuName: MenuName; weekNumber: number; isOverridden: boolean } {
  if (userOverrideWeekNumber !== null) {
    return {
      menuName: getMenuNameForWeek(userOverrideWeekNumber),
      weekNumber: userOverrideWeekNumber,
      isOverridden: true,
    };
  }

  const weekNumber = getWeekNumberFromDate(currentDate);
  return {
    menuName: getMenuNameForWeek(weekNumber),
    weekNumber,
    isOverridden: false,
  };
}
