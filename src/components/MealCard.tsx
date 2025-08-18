"use client";

import * as React from "react";
import type { Meal, MealKey } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Coffee, UtensilsCrossed, Cookie, Moon } from "lucide-react";

export function MealCard({
  title,
  timeRange,
  meal,
  mealKey,
  highlight,
  tilt,
}: {
  title: string;
  timeRange: string;
  meal: Meal;
  mealKey: MealKey;
  highlight?: boolean;
  tilt?: { x: number; y: number };
}) {
  const Icon = mealKey === "breakfast" ? Coffee : mealKey === "lunch" ? UtensilsCrossed : mealKey === "snacks" ? Cookie : Moon;
  const hue = 220 + (tilt?.y ?? 0) * 40;
  const glow = highlight
    ? {
        transform: tilt ? `translateY(${tilt.x * -2}px) rotateX(${tilt.x * 1.8}deg) rotateY(${tilt.y * 1.8}deg)` : undefined,
      }
    : undefined;

  const card = (
    <Card className={cn("transition-transform", highlight ? "border-primary ring-1 ring-primary/30" : "")}> 
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/15">
              <Icon className="h-4 w-4 text-primary" />
            </span>
            <span>{title}</span>
          </span>
          <span className="text-sm font-normal text-muted-foreground">{timeRange}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {meal.items.map((item, idx) => (
            <li key={idx} className="rounded-md bg-muted px-2 py-1">{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  if (!highlight) return card;
  return (
    <div
      className="rounded-2xl p-[6px]"
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 80% 70% / 0.7), hsl(${(hue + 120) % 360} 80% 70% / 0.7))`,
        ...glow,
      }}
    >
      {card}
    </div>
  );
}


