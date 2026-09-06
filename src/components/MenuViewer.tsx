"use client";

import * as stylex from "@stylexjs/stylex";
import { styles } from "@/styles/site.stylex";

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
async function loadMenuForWeekNumber(weekNumber: number, signal?: AbortSignal): Promise<WeekMenu> {
  const { menuName } = getMenuNameForOverriddenWeek(weekNumber);
  const res = await fetch(`/${menuName}.json`, { cache: "no-store", signal });
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

/** Coordinate rotation overrides, day selection, and the current meal view. */
export function MenuViewer({
  initialWeek,
  initialWeekOverride,
}: {
  initialWeek: WeekMenu;
  initialWeekOverride?: number;
}) {
  const [currentWeek, setCurrentWeek] = React.useState<WeekMenu>(initialWeek);

  const [weekOverride, setWeekOverride] = React.useState<number | null>(null);
  const [hasRestoredOverride, setHasRestoredOverride] = React.useState(false);

  // Restore the saved override once mounted; localStorage does not exist during server rendering,
  // and reading it in the initializer would desync the first client render from the server HTML.
  React.useEffect(() => {
    setWeekOverride(readStoredWeekOverride());
    setHasRestoredOverride(true);
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
    if (!hasRestoredOverride) return;
    if (weekOverride !== null) {
      window.localStorage.setItem(WEEK_OVERRIDE_STORAGE_KEY, weekOverride.toString());
    } else {
      window.localStorage.removeItem(WEEK_OVERRIDE_STORAGE_KEY);
    }
  }, [hasRestoredOverride, weekOverride]);

  // Load current week menu on client side
  React.useEffect(() => {
    const controller = new AbortController();

    async function loadCurrentWeek() {
      try {
        setIsLoading(true);
        const weekNumber = weekOverride ?? getWeekNumberFromDate(new Date());
        const week = await loadMenuForWeekNumber(weekNumber, controller.signal);
        setCurrentWeek(week);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to load week menu:", error);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadCurrentWeek();
    return () => controller.abort();
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
    <div {...stylex.props(styles.viewer)} data-stack="4">
      <header {...stylex.props(styles.viewerHeader)}>
        <div {...stylex.props(styles.viewerTitle)}>{currentWeek.foodCourt}</div>
        <p {...stylex.props(styles.viewerDescription)}>Weekly rotating menu (4-week cycle)</p>
        <p {...stylex.props(styles.viewerNote)}>
          Sometimes, the Sindhi mess doesn&apos;t adhere to any menu.
        </p>
      </header>

      <div {...stylex.props(styles.viewerControls)}>
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
        <div {...stylex.props(styles.loading)}>
          <div {...stylex.props(styles.loadingSpinner)} />
          <span {...stylex.props(styles.loadingText)}>Loading menu...</span>
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
            <section {...stylex.props(styles.extras)}>
              <h2 {...stylex.props(styles.extrasTitle)}>{extras.data.category}</h2>
              <p {...stylex.props(styles.extrasDescription)}>
                Prices are listed in {extras.data.currency}.
              </p>
              <ul
                {...stylex.props(styles.extrasGrid)}
                aria-label={`${extras.data.category} add-ons`}
              >
                {extras.data.items.map((item) => (
                  <li key={item.name} {...stylex.props(styles.extra)}>
                    <span {...stylex.props(styles.extraName)}>{item.name}</span>
                    <span {...stylex.props(styles.extraPrice)}>
                      {extras.formatter?.format(item.price) ??
                        `${extras.data.currency} ${item.price}`}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div {...stylex.props(styles.viewerActions)}>
            <Button asChild variant="outline">
              <Link
                href={`/week/${getMenuNumberForWeek(weekOverride ?? getWeekNumberFromDate(new Date()))}/full`}
                title="View full week menu"
              >
                <Grid3X3 {...stylex.props(styles.fullWeekIcon)} />
                View Full Week Menu
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
