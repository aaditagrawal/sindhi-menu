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
import { getMenuNameForOverriddenWeek, getWeekNumberFromDate } from "@/lib/menuManager";
import { MealCarousel } from "@/components/MealCarousel";
import { InlineSelect } from "@/components/InlineSelect";
import { WeekSelector } from "@/components/WeekSelector";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Grid3X3 } from "lucide-react";

// Client-side menu loading logic
async function loadMenuForWeekNumber(weekNumber: number): Promise<{ weekId: string; week: WeekMenu }> {
  const { menuName } = getMenuNameForOverriddenWeek(weekNumber);
  const res = await fetch(`/${menuName}.json`, { cache: 'force-cache' });
  if (!res.ok) throw new Error(`Failed to load ${menuName}.json`);
  const rawData = await res.json();

  // Process the menu data on the client side
  const processedData = await processMenuData(rawData);
  return processedData;
}

// Process menu data (duplicated client-side logic from weeks/index.ts)
async function processMenuData(rawData: unknown): Promise<{ weekId: string; week: WeekMenu }> {
  type DayMenu = {
    day: string;
    displayDate: string;
    meals: Record<string, unknown>;
  };
  // Extract menu and extras from raw data
  const extractMenuAndExtras = (source: unknown) => {
    const isRecord = (value: unknown): value is Record<string, unknown> => {
      return typeof value === "object" && value !== null;
    };

    const resolveExtras = (raw: unknown) => {
      const fallback = { category: "Extras", currency: "INR", items: [] };
      if (!isRecord(raw)) return fallback;

      const category = typeof raw.category === "string" && raw.category.trim().length > 0
        ? raw.category.trim() : fallback.category;
      const currency = typeof raw.currency === "string" && raw.currency.trim().length > 0
        ? raw.currency.trim() : fallback.currency;

      const items = Array.isArray(raw.items)
        ? raw.items
            .map((value) => {
              if (!isRecord(value)) return undefined;
              const name = typeof value.name === "string" && value.name.trim().length > 0
                ? value.name.trim() : undefined;
              if (!name) return undefined;
              const priceValue = value.price;
              const price = typeof priceValue === "number"
                ? priceValue
                : typeof priceValue === "string"
                  ? Number(priceValue)
                  : Number.NaN;
              if (!Number.isFinite(price)) return undefined;
              return { name, price: Number(price) };
            })
            .filter((item): item is { name: string; price: number } => Boolean(item))
        : [];

      if (items.length === 0) {
        return { category, currency, items: fallback.items };
      }
      return { category, currency, items };
    };

    if (isRecord(source)) {
      const extras = resolveExtras("extras" in source ? source.extras : undefined);
      if ("menu" in source && isRecord(source.menu)) {
        return { menu: source.menu, extras };
      }
      const menuEntries = Object.entries(source).filter(([key]) => key !== "extras" && key !== "menu");
      const menu = Object.fromEntries(menuEntries);
      return { menu, extras };
    }
    return { menu: source, extras: resolveExtras(undefined) };
  };

  const { menu: rawMenu, extras: extrasData } = extractMenuAndExtras(rawData);

  // Ensure rawMenu is a record
  const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === "object" && value !== null;
  };
  if (!isRecord(rawMenu)) {
    throw new Error('Invalid menu data structure');
  }

  // Date utility functions (duplicated)
  const IST_OFFSET_MINUTES = 5 * 60 + 30;
  const getISTNow = (): Date => {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
    return new Date(utcMs + IST_OFFSET_MINUTES * 60_000);
  };

  const formatDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatISTDayName = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "Asia/Kolkata"
    });
  };

  const formatISTShortDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "Asia/Kolkata"
    });
  };

  const addISTDays = (date: Date, days: number): Date => {
    return new Date(date.getTime() + days * 86_400_000);
  };

  const getISTDayIndex = (date: Date): number => {
    const shortName = date.toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: "Asia/Kolkata"
    });
    const DAY_INDEX_LOOKUP: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return DAY_INDEX_LOOKUP[shortName] ?? 0;
  };

  const startOfISTWeek = (date: Date): Date => {
    const dayIndex = getISTDayIndex(date);
    const deltaToMonday = (dayIndex + 6) % 7;
    return addISTDays(date, -deltaToMonday);
  };

  const sortDateKeysAsc = (keys: string[]): string[] => {
    return [...keys].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  };

  // Build the week menu
  const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const menu: Record<string, DayMenu> = {};

  const now = getISTNow();
  const monday = startOfISTWeek(now);

  const MEAL_TIMINGS = {
    lunch: { start: "11:30", end: "14:15" },
    dinner: { start: "19:00", end: "21:30" },
  };

  const SECTION_TITLES = {
    specialVeg: "Special Veg",
    veg: "Veg",
    vegSides: "Veg Sides",
    nonVeg: "Non-Veg",
    note: "Note",
  };

  const buildMeal = (src: Record<string, unknown> | undefined, mealName: string) => {
    if (!src) return undefined;

    const sections: Array<{ kind: string; title: string; items: string[] }> = [];
    const items: string[] = [];

    const pushSection = (kind: string, rawItems: unknown) => {
      if (!rawItems) return;
      const arr = Array.isArray(rawItems) ? rawItems : [rawItems];
      const cleaned = arr
        .flatMap((item: unknown) =>
          String(item)
            .split(/(?:\r?\n|,|;|•)/g)
            .map((part: string) => part.trim())
        )
        .map((item: string) => item.replace(/\s+/g, " "))
        .filter(Boolean);
      if (cleaned.length === 0) return;
      sections.push({ kind, title: SECTION_TITLES[kind as keyof typeof SECTION_TITLES], items: cleaned });

      for (const value of cleaned) {
        items.push(value);
      }
    };

    pushSection("specialVeg", src.specialVeg);
    pushSection("nonVeg", src.nonVeg);
    
    // Keep veg and vegSides as separate sections
    pushSection("veg", src.veg);
    pushSection("vegSides", src.vegSides);

    if (sections.length === 0) return undefined;

    const { start, end } = MEAL_TIMINGS[mealName as keyof typeof MEAL_TIMINGS];
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
    const rawDay = rawMenu[canonicalDay];

    menu[key] = {
      day: formatISTDayName(current),
      displayDate: formatISTShortDate(current),
      meals: {
        lunch: buildMeal(rawDay && isRecord(rawDay) ? rawDay.lunch as Record<string, unknown> | undefined : undefined, "lunch"),
        dinner: buildMeal(rawDay && isRecord(rawDay) ? rawDay.dinner as Record<string, unknown> | undefined : undefined, "dinner"),
      },
    };
  }

  const firstDay = addISTDays(monday, 0);
  const lastDay = addISTDays(monday, daysOrder.length - 1);
  const week = {
    foodCourt: 'Sindhi Mess',
    week: `${formatISTShortDate(firstDay)} – ${formatISTShortDate(lastDay)} • Weekly menu`,
    menu,
    extras: extrasData,
  };

  const computeWeekIdFromMenu = (week: WeekMenu): string => {
    const keys = sortDateKeysAsc(Object.keys(week.menu));
    const start = keys[0];
    const end = keys[keys.length - 1];
    return `${start}_to_${end}`;
  };

  const weekId = computeWeekIdFromMenu(week);

  return { weekId, week };
}

export function MenuViewer({
  initialWeekId,
  initialWeek,
}: {
  initialWeekId: string;
  initialWeek: WeekMenu;
}) {
  const [currentWeekId, setCurrentWeekId] = React.useState<string>(initialWeekId);
  const [currentWeek, setCurrentWeek] = React.useState<WeekMenu>(initialWeek);
  const [weekOverride, setWeekOverride] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const sortedDayKeys = React.useMemo(
    () => sortDateKeysAsc(Object.keys(currentWeek.menu)),
    [currentWeek.menu]
  );

  const defaultKey = sortedDayKeys[0] ?? "";

  const [dateKey, setDateKey] = React.useState<string>(defaultKey);

  // Load current week menu on client side
  React.useEffect(() => {
    async function loadCurrentWeek() {
      try {
        setIsLoading(true);
        const weekNumber = weekOverride ?? getWeekNumberFromDate(new Date());
        const { weekId, week } = await loadMenuForWeekNumber(weekNumber);
        setCurrentWeekId(weekId);
        setCurrentWeek(week);
      } catch (error) {
        console.error('Failed to load week menu:', error);
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
    }
  }, [currentWeek]);

  // Ensure dateKey is valid for current week
  React.useEffect(() => {
    if (!currentWeek.menu[dateKey]) {
      setDateKey(sortedDayKeys[0] ?? "");
    }
  }, [currentWeek, dateKey, sortedDayKeys]);

  const pointer = findCurrentOrUpcomingMeal(currentWeek);
  const effectiveDateKey = dateKey || pointer?.dateKey || defaultKey;
  const fallbackKey = defaultKey;
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
  const highlightKey = (picked?.mealKey ?? (meals[0]?.key ?? "breakfast")) as MealKey;
  const isPrimaryUpcoming = Boolean(picked?.isPrimaryUpcoming);

  const dayOptions = sortedDayKeys.map((key) => {
    const entry = currentWeek.menu[key];
    const parsed = parseDateKey(key);
    const isValidDate = !Number.isNaN(parsed.getTime());
    const dayLabel = entry?.day ?? (isValidDate
      ? parsed.toLocaleDateString(undefined, {
          weekday: 'long',
          timeZone: 'Asia/Kolkata',
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
        <p className="text-muted-foreground/70 text-sm mt-1 italic">Sometimes, the Sindhi mess doesn&apos;t adhere to any menu.</p>
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
              <h2 className="text-base sm:text-lg font-semibold text-muted-foreground">{extras.data.category}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground/80 mt-1">
                Prices are listed in {extras.data.currency}.
              </p>
              <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2" aria-label={`${extras.data.category} add-ons`}>
                {extras.data.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-center justify-between rounded-lg border border-border/40 bg-card/80 px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-foreground/90">{item.name}</span>
                    <span className="font-semibold text-primary">
                      {extras.formatter?.format(item.price) ?? `${extras.data.currency} ${item.price}`}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="flex flex-col items-center gap-2 mt-6">
            <Button asChild variant="outline">
              <Link href={`/week/${currentWeekId}/full`} title="View full week menu">
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
