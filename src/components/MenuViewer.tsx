"use client";

import * as React from "react";
import type { MealKey, WeekMenu } from "@/lib/types";
import {
  findCurrentOrUpcomingMeal,
  pickHighlightMealForDay,
  sortDateKeysAsc,
  parseDateKey,
  formatISTShortDate,
} from "@/lib/date";
import {
  getMenuNameForOverriddenWeek,
  getMenuNumberForWeek,
  getWeekNumberFromDate,
} from "@/lib/menuManager";
import { buildWeekMenu, type MenuFile } from "@/lib/menuFile";
import { MealCarousel } from "@/components/MealCarousel";
import { InlineSelect } from "@/components/InlineSelect";
import { WeekSelector } from "@/components/WeekSelector";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Grid3X3 } from "lucide-react";

const WEEK_OVERRIDE_STORAGE_KEY = "sindhi-menu-week-override";

/** Fetch the menu document for a rotation week and project it onto the current IST week. */
async function loadMenuForWeekNumber(weekNumber: number): Promise<WeekMenu> {
  const { menuName } = getMenuNameForOverriddenWeek(weekNumber);
  const res = await fetch(`/${menuName}.json`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${menuName}.json`);
  // SAFETY: this is the same `public/menu*.json` document the server reads in `@/data/weeks`;
  // it is served from this app's own origin and authored against `MenuFile`, whose fields are all
  // optional, so `buildWeekMenu` normalises any drift instead of trusting the payload's shape.
  const file = (await res.json()) as MenuFile;
  return buildWeekMenu(file, "Weekly menu");
}

/** Read a previously chosen rotation week; ignores anything the user hand-edited into storage. */
function readStoredWeekOverride(): number | null {
  const saved = window.localStorage.getItem(WEEK_OVERRIDE_STORAGE_KEY);
  if (saved === null) return null;
  const weekNumber = Number.parseInt(saved, 10);
  return Number.isFinite(weekNumber) ? weekNumber : null;
}

export function MenuViewer({
  initialWeek,
  initialWeekOverride,
}: {
  initialWeek: WeekMenu;
  initialWeekOverride?: number;
}) {
  const [currentWeek, setCurrentWeek] = React.useState<WeekMenu>(initialWeek);

  const [weekOverride, setWeekOverride] = React.useState<number | null>(null);

  // Restore the saved override once mounted; localStorage does not exist during server rendering,
  // and reading it in the initializer would desync the first client render from the server HTML.
  React.useEffect(() => {
    setWeekOverride(readStoredWeekOverride());
  }, []);

  // Apply initialWeekOverride from props after mount
  React.useEffect(() => {
    if (initialWeekOverride !== undefined) {
      setWeekOverride(initialWeekOverride);
    }
  }, [initialWeekOverride]);

  const [isLoading, setIsLoading] = React.useState(false);

  const sortedDayKeys = React.useMemo(
    () => sortDateKeysAsc(Object.keys(currentWeek.menu)),
    [currentWeek.menu],
  );

  // Initialize with empty string, useEffect will set the correct current day
  const [dateKey, setDateKey] = React.useState<string>("");

  // Save week override to localStorage when it changes
  React.useEffect(() => {
    if (weekOverride !== null) {
      window.localStorage.setItem(WEEK_OVERRIDE_STORAGE_KEY, weekOverride.toString());
    } else {
      window.localStorage.removeItem(WEEK_OVERRIDE_STORAGE_KEY);
    }
  }, [weekOverride]);

  // Load current week menu on client side
  React.useEffect(() => {
    async function loadCurrentWeek() {
      try {
        setIsLoading(true);
        const weekNumber = weekOverride ?? getWeekNumberFromDate(new Date());
        const week = await loadMenuForWeekNumber(weekNumber);
        setCurrentWeek(week);
      } catch (error) {
        console.error("Failed to load week menu:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCurrentWeek();
  }, [weekOverride]);

  // Set initial dateKey to current/upcoming meal after week is loaded
  React.useEffect(() => {
    const ptr = findCurrentOrUpcomingMeal(currentWeek);
    if (ptr?.dateKey && currentWeek.menu[ptr.dateKey]) {
      setDateKey(ptr.dateKey);
    } else if (sortedDayKeys.length > 0) {
      // Fallback to first day only if no current/upcoming meal found
      setDateKey(sortedDayKeys[0]);
    }
  }, [currentWeek, sortedDayKeys]);

  // Update date key periodically for auto date adjustment
  React.useEffect(() => {
    const updateDate = () => {
      const ptr = findCurrentOrUpcomingMeal(currentWeek);
      if (ptr?.dateKey && currentWeek.menu[ptr.dateKey]) {
        setDateKey(ptr.dateKey);
      }
    };

    // Update immediately and then every minute
    updateDate();
    const interval = setInterval(updateDate, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [currentWeek]);

  const pointer = findCurrentOrUpcomingMeal(currentWeek);
  const effectiveDateKey = dateKey || pointer?.dateKey || (sortedDayKeys[0] ?? "");
  const fallbackKey = sortedDayKeys[0] ?? "";
  const day = currentWeek.menu[effectiveDateKey] ?? currentWeek.menu[fallbackKey];

  const order: MealKey[] = ["lunch", "dinner"];
  const meals = day
    ? order
        .filter((k) => day.meals[k])
        .map((k) => ({
          key: k,
          meal: day.meals[k]!,
          timeRange: `${day.meals[k]!.startTime} – ${day.meals[k]!.endTime} IST`,
          title: k[0].toUpperCase() + k.slice(1),
        }))
    : [];

  const extras = React.useMemo(() => {
    const data = currentWeek.extras;
    if (!data || data.items.length === 0) return undefined;
    let formatter: Intl.NumberFormat | undefined;
    try {
      formatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: data.currency,
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      });
    } catch {
      formatter = undefined;
    }
    return { data, formatter };
  }, [currentWeek.extras]);

  const picked = pickHighlightMealForDay(currentWeek, effectiveDateKey);
  const highlightKey: MealKey = picked?.mealKey ?? meals[0]?.key ?? "lunch";
  const isPrimaryUpcoming = Boolean(picked?.isPrimaryUpcoming);

  const dayOptions = sortedDayKeys.map((key) => {
    const entry = currentWeek.menu[key];
    const parsed = parseDateKey(key);
    const isValidDate = !Number.isNaN(parsed.getTime());
    const dayLabel =
      entry?.day ??
      (isValidDate
        ? parsed.toLocaleDateString(undefined, {
            weekday: "long",
            timeZone: "Asia/Kolkata",
          })
        : key);
    const dateLabel = entry?.displayDate ?? (isValidDate ? formatISTShortDate(parsed) : key);
    return { label: `${dayLabel} • ${dateLabel}`, value: key };
  });

  return (
    <div className="space-y-4">
      <header className="mb-4">
        <div className="text-3xl sm:text-4xl font-semibold tracking-tight">
          {currentWeek.foodCourt}
        </div>
        <p className="text-muted-foreground mt-2 text-lg">Weekly rotating menu (4-week cycle)</p>
        <p className="text-muted-foreground/70 text-sm mt-1 italic">
          Sometimes, the Sindhi mess doesn&apos;t adhere to any menu.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-4 text-base">
        <WeekSelector
          onWeekChange={(weekNum) => {
            setWeekOverride(weekNum === -1 ? null : weekNum);
          }}
          currentOverride={weekOverride}
        />
        <InlineSelect
          label="Day"
          value={effectiveDateKey}
          options={dayOptions}
          onChange={(v) => setDateKey(String(v))}
          disabled={isLoading}
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="ml-2 text-sm text-muted-foreground">Loading menu...</span>
        </div>
      )}

      {!isLoading && (
        <>
          <MealCarousel
            meals={meals}
            highlightKey={highlightKey}
            isPrimaryUpcoming={isPrimaryUpcoming}
          />

          {extras ? (
            <section className="rounded-xl border border-dashed border-muted-foreground/40 bg-muted/30 px-4 py-3 sm:px-5">
              <h2 className="text-base sm:text-lg font-semibold text-muted-foreground">
                {extras.data.category}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground/80 mt-1">
                Prices are listed in {extras.data.currency}.
              </p>
              <ul
                className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2"
                aria-label={`${extras.data.category} add-ons`}
              >
                {extras.data.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-center justify-between rounded-lg border border-border/40 bg-card/80 px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-foreground/90">{item.name}</span>
                    <span className="font-semibold text-primary">
                      {extras.formatter?.format(item.price) ??
                        `${extras.data.currency} ${item.price}`}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="flex flex-col items-center gap-2 mt-6">
            <Button asChild variant="outline">
              <Link
                href={`/week/${getMenuNumberForWeek(weekOverride ?? getWeekNumberFromDate(new Date()))}/full`}
                title="View full week menu"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                View Full Week Menu
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
