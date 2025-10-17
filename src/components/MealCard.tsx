"use client";

import * as React from "react";
import type { Meal, MealKey, MealSectionKind } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { UtensilsCrossed, Moon, Leaf, Beef } from "lucide-react";
import { filterMenuItems } from "@/lib/exceptions";

export function MealCard({
  title,
  timeRange,
  meal,
  mealKey,
  highlight,
  primaryUpcoming,
  tilt,
}: {
  title: string;
  timeRange: string;
  meal: Meal;
  mealKey: MealKey;
  highlight?: boolean;
  primaryUpcoming?: boolean;
  tilt?: { x: number; y: number };
}) {
  const Icon = mealKey === "lunch" ? UtensilsCrossed : Moon;
  const glow = highlight
    ? {
        transform: tilt ? `translateY(${tilt.x * -2}px) rotateX(${tilt.x * 1.8}deg) rotateY(${tilt.y * 1.8}deg)` : undefined,
      }
    : undefined;

  const filteredSections = React.useMemo(() => {
    if (!meal.sections) return [];
    return meal.sections
      .map((section) => ({
        ...section,
        items: filterMenuItems(section.items),
      }))
      .filter((section) => section.items.length > 0);
  }, [meal.sections]);

  const sectionTone: Record<MealSectionKind, string> = {
    specialVeg:
      "bg-emerald-100 border-emerald-200 text-emerald-900 dark:bg-emerald-500/10 dark:border-emerald-400/30 dark:text-emerald-100",
    veg: "bg-emerald-100 border-emerald-200 text-emerald-900 dark:bg-emerald-500/10 dark:border-emerald-400/30 dark:text-emerald-100",
    vegSides: "bg-foreground/5 border-foreground/10 text-foreground",
    nonVeg:
      "bg-rose-100 border-rose-200 text-rose-900 dark:bg-rose-500/10 dark:border-rose-400/30 dark:text-rose-100",
    note: "bg-muted/40 border-muted-foreground/20 text-muted-foreground",
  };

  const sectionIcon: Partial<Record<MealSectionKind, typeof Leaf>> = {
    specialVeg: Leaf,
    veg: Leaf,
    nonVeg: Beef,
  };

  const iconTone: Partial<Record<MealSectionKind, string>> = {
    specialVeg: "text-emerald-700 dark:text-emerald-300",
    veg: "text-emerald-700 dark:text-emerald-300",
    nonVeg: "text-rose-700 dark:text-rose-300",
  };

  const primaryGradient = "linear-gradient(135deg, rgba(255, 191, 132, 0.9), rgba(255, 156, 170, 0.88))";
  const secondaryGradient = "linear-gradient(135deg, rgba(130, 196, 255, 0.78), rgba(187, 174, 255, 0.78))";

  const card = (
    <Card className={cn("transition-transform", highlight ? "border-primary ring-1 ring-primary/30" : "")}> 
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-4 text-xl">
          <span className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
              <Icon className="h-5 w-5 text-primary" />
            </span>
            <span>{title}</span>
          </span>
          <span className="text-base font-normal text-muted-foreground">{timeRange}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredSections.length > 0 ? (
          <ul aria-label="Menu items" className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-base leading-relaxed">
            {filteredSections.flatMap((section, sectionIdx) =>
              section.items.map((item, itemIdx) => {
                const IconComponent = sectionIcon[section.kind];
                const tone = sectionTone[section.kind] ?? sectionTone.note;
                return (
                  <li
                    key={`${section.kind}-${sectionIdx}-${itemIdx}`}
                    className={cn(
                      "rounded-lg px-3 py-2 flex items-center gap-3 border backdrop-blur-sm",
                      tone
                    )}
                  >
                    {IconComponent ? (
                      <IconComponent className={cn("h-4 w-4", iconTone[section.kind])} />
                    ) : null}
                    <span className="font-medium">{item}</span>
                  </li>
                );
              })
            )}
          </ul>
        ) : (
          <p className="text-base text-muted-foreground italic">No menu items listed.</p>
        )}
      </CardContent>
    </Card>
  );

  if (!highlight) return card;
  return (
    <div
      className="rounded-2xl p-[6px]"
      style={{
        background: primaryUpcoming ? primaryGradient : secondaryGradient,
        ...glow,
      }}
    >
      {card}
    </div>
  );
}
