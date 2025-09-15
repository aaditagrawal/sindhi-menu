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

import { MealCarousel } from "@/components/MealCarousel";
import { InlineSelect } from "@/components/InlineSelect";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Grid3X3 } from "lucide-react";

export function MenuViewer({
  initialWeekId,
  initialWeek,
}: {
  initialWeekId: string;
  initialWeek: WeekMenu;
}) {
  const sortedDayKeys = React.useMemo(
    () => sortDateKeysAsc(Object.keys(initialWeek.menu)),
    [initialWeek.menu]
  );

  const defaultKey = sortedDayKeys[0] ?? "";

  const [dateKey, setDateKey] = React.useState<string>(defaultKey);

  // Set initial dateKey to current/upcoming meal after hydration
  React.useEffect(() => {
    const ptr = findCurrentOrUpcomingMeal(initialWeek);
    if (ptr?.dateKey && initialWeek.menu[ptr.dateKey]) {
      setDateKey(ptr.dateKey);
    }
  }, [initialWeek]);

  // Ensure dateKey is valid for current week
  React.useEffect(() => {
    if (!initialWeek.menu[dateKey]) {
      setDateKey(sortedDayKeys[0] ?? "");
    }
  }, [initialWeek, dateKey, sortedDayKeys]);

  const pointer = findCurrentOrUpcomingMeal(initialWeek);
  const effectiveDateKey = dateKey || pointer?.dateKey || defaultKey;
  const fallbackKey = defaultKey;
  const day = initialWeek.menu[effectiveDateKey] ?? initialWeek.menu[fallbackKey];

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
    const data = initialWeek.extras;
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
  }, [initialWeek.extras]);

  const picked = pickHighlightMealForDay(initialWeek, effectiveDateKey);
  const highlightKey = (picked?.mealKey ?? (meals[0]?.key ?? "breakfast")) as MealKey;
  const isPrimaryUpcoming = Boolean(picked?.isPrimaryUpcoming);

  const dayOptions = sortedDayKeys.map((key) => {
    const entry = initialWeek.menu[key];
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
      <header className="mb-2">
        <div className="text-3xl sm:text-4xl font-semibold tracking-tight">
          {initialWeek.foodCourt}
        </div>
        <p className="text-muted-foreground mt-2 text-lg">(the menu is the same every week)</p>
      </header>
      <div className="flex flex-wrap items-center gap-3 text-base">
        <InlineSelect
          label="Day"
          value={effectiveDateKey}
          options={dayOptions}
          onChange={(v) => setDateKey(String(v))}
        />
      </div>

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
          <Link href={`/week/${initialWeekId}/full`} title="View full week menu">
            <Grid3X3 className="h-4 w-4 mr-2" />
            View Full Week Menu
          </Link>
        </Button>
      </div>
    </div>
  );
}
