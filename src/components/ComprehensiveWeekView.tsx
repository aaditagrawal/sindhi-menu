"use client";

import * as React from "react";
import type { WeekMenu, MealKey, DayMenu, Meal, MealSectionKind } from "@/lib/types";
import { MealCard } from "@/components/MealCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, UtensilsCrossed, Cookie, Moon } from "lucide-react";
import { filterMenuItems } from "@/lib/exceptions";

interface ComprehensiveWeekViewProps {
  week: WeekMenu;
}

const mealOrder: MealKey[] = ["lunch", "dinner"];

const mealIcons = {
  breakfast: Coffee,
  lunch: UtensilsCrossed,
  snacks: Cookie,
  dinner: Moon,
};

const mealTitles = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  snacks: "Snacks",
  dinner: "Dinner",
};

const sectionTone: Record<MealSectionKind, string> = {
  specialVeg:
    "bg-emerald-100 border-emerald-200 text-emerald-900 dark:bg-emerald-500/10 dark:border-emerald-400/30 dark:text-emerald-100",
  veg: "bg-foreground/5 border-border/30 text-foreground",
  nonVeg:
    "bg-rose-100 border-rose-200 text-rose-900 dark:bg-rose-500/10 dark:border-rose-400/30 dark:text-rose-100",
  note: "bg-muted/40 border-muted-foreground/20 text-muted-foreground",
};

export function ComprehensiveWeekView({ week }: ComprehensiveWeekViewProps) {
  // Sort days chronologically
  const sortedDays = React.useMemo(() => Object.keys(week.menu).sort(), [week.menu]);
  const dayCount = sortedDays.length;

  return (
    <div className="space-y-8">
      {/* Mobile/Tablet View - Days stacked vertically */}
      <div className="block lg:hidden space-y-6">
        {sortedDays.map((dateKey) => {
          const day = week.menu[dateKey];
          return <DaySection key={dateKey} day={day} />;
        })}
      </div>

      {/* Desktop View - Transposed grid: Meals as rows, Days as columns */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <div
            className="grid gap-3 min-w-max pb-4 items-start"
            style={{
              gridTemplateColumns: `200px repeat(${dayCount}, minmax(280px, 1fr))`
            }}
          >
            {/* Header row with days */}
            <div className="sticky top-0 bg-background z-10 p-3">
              <h3 className="font-semibold text-lg">Meals</h3>
            </div>
            {sortedDays.map((dateKey) => {
              const day = week.menu[dateKey];
              return (
                <div key={dateKey} className="sticky top-0 bg-background z-10 p-3 text-center border-l border-border/50">
                  <h3 className="font-semibold text-lg">{day.day}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{day.displayDate}</p>
                </div>
              );
            })}

            {/* Meal rows */}
            {mealOrder.map((mealKey) => (
              <React.Fragment key={mealKey}>
                {/* Meal type header */}
                <div className="p-3 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15">
                      {React.createElement(mealIcons[mealKey], {
                        className: "h-4 w-4 text-primary"
                      })}
                    </span>
                    <div>
                      <span className="font-medium">{mealTitles[mealKey]}</span>
                    </div>
                  </div>
                </div>

                {/* Meal content for each day */}
                {sortedDays.map((dateKey) => {
                  const day = week.menu[dateKey];
                  const meal = day.meals[mealKey];

                  return (
                    <div key={`${mealKey}-${dateKey}`} className="p-3 border-t border-l border-border/50">
                      {meal ? (
                        <MealGridCard
                          meal={meal}
                          mealKey={mealKey}
                          timeRange={`${meal.startTime} – ${meal.endTime} IST`}
                        />
                      ) : (
                        <div className="p-4 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center min-h-32">
                          <span className="text-sm text-muted-foreground">No meal</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DaySection({ day }: { day: DayMenu }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{day.day}</span>
          <span className="text-sm font-normal text-muted-foreground">{day.displayDate}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mealOrder.map((mealKey) => {
            const meal = day.meals[mealKey];
            if (!meal) return null;

            return (
              <MealCard
                key={mealKey}
                title={mealTitles[mealKey]}
                timeRange={`${meal.startTime} – ${meal.endTime} IST`}
                meal={meal}
                mealKey={mealKey}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

const MealGridCard = React.memo(function MealGridCard({
  meal,
  mealKey,
  timeRange
}: {
  meal: Meal;
  mealKey: MealKey;
  timeRange: string;
}) {
  const Icon = mealIcons[mealKey];
  const filteredSections = React.useMemo(() => {
    if (!meal.sections) return [];
    return meal.sections
      .map((section) => ({
        ...section,
        items: filterMenuItems(section.items),
      }))
      .filter((section) => section.items.length > 0);
  }, [meal.sections]);

  const fallbackItems = React.useMemo(() => filterMenuItems(meal.items), [meal.items]);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between gap-2 text-sm">
          <span className="flex items-center gap-1">
            <Icon className="h-3 w-3 text-primary" />
            <span className="font-medium">{mealTitles[mealKey]}</span>
          </span>
          <span className="text-xs text-muted-foreground font-normal">{timeRange}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm">
          {filteredSections.length > 0
            ? (
                <ul aria-label="Menu items" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredSections.flatMap((section) =>
                    section.items.map((item, idx) => (
                      <li
                        key={`${section.kind}-${idx}`}
                        className={`rounded-md border px-2 py-1 ${sectionTone[section.kind] ?? sectionTone.note}`}
                      >
                        {item}
                      </li>
                    ))
                  )}
                </ul>
              )
            : fallbackItems.length > 0
            ? fallbackItems.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-md border border-border/30 bg-foreground/5 px-2 py-1"
                >
                  {item}
                </div>
              ))
            : (
                <div className="text-xs text-muted-foreground italic py-2">
                  No items available
                </div>
              )}
        </div>
      </CardContent>
    </Card>
  );
});
