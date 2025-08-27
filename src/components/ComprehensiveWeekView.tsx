"use client";

import * as React from "react";
import type { WeekMenu, MealKey, DayMenu, Meal } from "@/lib/types";
import { MealCard } from "@/components/MealCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, UtensilsCrossed, Cookie, Moon } from "lucide-react";
import { filterMenuItems } from "@/lib/exceptions";

interface ComprehensiveWeekViewProps {
  week: WeekMenu;
}

const mealOrder: MealKey[] = ["breakfast", "lunch", "snacks", "dinner"];

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

export function ComprehensiveWeekView({ week }: ComprehensiveWeekViewProps) {
  // Sort days chronologically
  const sortedDays = Object.keys(week.menu).sort();

  return (
    <div className="space-y-8">
      {/* Mobile/Tablet View - Days stacked vertically */}
      <div className="block lg:hidden space-y-6">
        {sortedDays.map((dateKey) => {
          const day = week.menu[dateKey];
          return (
            <DaySection key={dateKey} day={day} dateKey={dateKey} />
          );
        })}
      </div>

      {/* Desktop View - All meals in a grid */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-8 gap-4 mb-6">
          {/* Header row with meal types */}
          <div className="col-span-1"></div>
          {mealOrder.map((mealKey) => (
            <div key={mealKey} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15">
                  {React.createElement(mealIcons[mealKey], {
                    className: "h-3 w-3 text-primary"
                  })}
                </span>
                <span className="font-medium text-sm">{mealTitles[mealKey]}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Days and meals grid */}
        {sortedDays.map((dateKey) => {
          const day = week.menu[dateKey];
          return (
            <div key={dateKey} className="grid grid-cols-8 gap-4 mb-4">
              {/* Day header */}
              <div className="col-span-1">
                <div className="sticky top-0 bg-background py-2">
                  <h3 className="font-medium">{day.day}</h3>
                  <p className="text-xs text-muted-foreground">{dateKey}</p>
                </div>
              </div>

              {/* Meals for this day */}
              {mealOrder.map((mealKey) => {
                const meal = day.meals[mealKey];
                if (!meal) {
                  return (
                    <div key={mealKey} className="col-span-1 p-4 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">No meal</span>
                    </div>
                  );
                }

                return (
                  <div key={mealKey} className="col-span-1">
                    <MealGridCard
                      meal={meal}
                      mealKey={mealKey}
                      timeRange={`${meal.startTime} – ${meal.endTime} IST`}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DaySection({ day, dateKey }: { day: DayMenu; dateKey: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{day.day}</span>
          <span className="text-sm font-normal text-muted-foreground">{dateKey}</span>
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

function MealGridCard({
  meal,
  mealKey,
  timeRange
}: {
  meal: Meal;
  mealKey: MealKey;
  timeRange: string;
}) {
  const Icon = mealIcons[mealKey];

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between gap-2 text-sm">
          <span className="flex items-center gap-1">
            <Icon className="h-3 w-3 text-primary" />
            <span>{mealTitles[mealKey]}</span>
          </span>
          <span className="text-xs text-muted-foreground">{timeRange}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-1">
          {filterMenuItems(meal.items).map((item, idx) => (
            <li key={idx} className="text-xs rounded bg-muted px-1.5 py-0.5 leading-tight">
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
