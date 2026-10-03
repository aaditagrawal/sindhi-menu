"use client";

import * as stylex from "@stylexjs/stylex";
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
import { Grid3X3, Loader2 } from "lucide-react";

const WEEK_OVERRIDE_STORAGE_KEY = "sindhi-menu-week-override";

const spin = stylex.keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" },
});

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    rowGap: "1rem",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    rowGap: "0.375rem",
  },
  title: {
    fontSize: {
      default: "26px",
      "@media (min-width: 640px)": "32px",
    },
    fontWeight: 600,
    letterSpacing: "-0.02em",
    lineHeight: 1.1,
  },
  description: {
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    color: "var(--muted-foreground)",
  },
  note: {
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    color: "var(--muted-foreground)",
  },
  controls: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: "1rem",
    rowGap: "0.5rem",
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    columnGap: "0.75rem",
    paddingBlock: "3rem",
    color: "var(--muted-foreground)",
    fontSize: "0.875rem",
  },
  spinner: {
    height: "1.25rem",
    width: "1.25rem",
    animationName: spin,
    animationDuration: "1s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
  extras: {
    display: "flex",
    flexDirection: "column",
    rowGap: "0.75rem",
    marginTop: "0.5rem",
  },
  extrasTitle: {
    fontSize: "1.125rem",
    lineHeight: "calc(1.75 / 1.125)",
    fontWeight: 600,
  },
  extrasDescription: {
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    color: "var(--muted-foreground)",
  },
  extrasGrid: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(1, minmax(0, 1fr))",
      "@media (min-width: 640px)": "repeat(2, minmax(0, 1fr))",
    },
    rowGap: "0.5rem",
    columnGap: "0.5rem",
  },
  extra: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: "0.75rem",
    borderRadius: "calc(var(--radius) - 2px)",
    borderWidth: "1px",
    borderColor: "color-mix(in oklab, var(--border) 60%, transparent)",
    backgroundColor: "var(--card)",
    paddingInline: "0.75rem",
    paddingBlock: "0.5rem",
  },
  extraName: {
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
  },
  extraPrice: {
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    color: "var(--muted-foreground)",
    fontVariantNumeric: "tabular-nums",
  },
  actions: {
    display: "flex",
    marginTop: "0.5rem",
  },
  buttonIcon: {
    height: "1rem",
    width: "1rem",
    marginRight: "0.5rem",
  },
});

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
  const [now, setNow] = React.useState(() => new Date());
  const calendarWeek = getWeekNumberFromDate(now);
  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
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
        const weekNumber = weekOverride ?? calendarWeek;
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
  }, [weekOverride, calendarWeek]);

  React.useEffect(() => setDateKey(""), [currentWeek]);
  const pointer = findCurrentOrUpcomingMeal(currentWeek, now);
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

  const picked = pickHighlightMealForDay(currentWeek, effectiveDateKey, now);
  const highlightKey: MealKey = picked?.mealKey ?? meals[0]?.key ?? "lunch";
  const isPrimaryUpcoming = Boolean(picked?.isPrimaryUpcoming);
  const isLive = Boolean(
    pointer &&
    pointer.isOngoing &&
    pointer.dateKey === effectiveDateKey &&
    pointer.mealKey === highlightKey,
  );

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
    <div {...stylex.props(styles.root)}>
      <header {...stylex.props(styles.header)}>
        <div {...stylex.props(styles.title)}>{currentWeek.foodCourt}</div>
        <p {...stylex.props(styles.description)}>Weekly rotating menu (4-week cycle)</p>
        <p {...stylex.props(styles.note)}>
          Sometimes, the Sindhi mess doesn&apos;t adhere to any menu.
        </p>
      </header>

      <div {...stylex.props(styles.controls)}>
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
          <Loader2 {...stylex.props(styles.spinner)} />
          <span>Loading menu...</span>
        </div>
      )}

      {!isLoading && (
        <>
          <MealCarousel
            meals={meals}
            highlightKey={highlightKey}
            isPrimaryUpcoming={isPrimaryUpcoming}
            isLive={isLive}
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

          <div {...stylex.props(styles.actions)}>
            <Button asChild variant="outline">
              <Link
                href={`/week/${getMenuNumberForWeek(weekOverride ?? calendarWeek)}/full`}
                title="View full week menu"
              >
                <Grid3X3 {...stylex.props(styles.buttonIcon)} />
                View Full Week Menu
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
