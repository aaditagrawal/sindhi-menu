"use client";

import * as React from "react";
import type { Meal } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MealCard({
  title,
  timeRange,
  meal,
  highlight,
}: {
  title: string;
  timeRange: string;
  meal: Meal;
  highlight?: boolean;
}) {
  return (
    <Card className={cn(highlight ? "border-primary ring-1 ring-primary/30" : "")}> 
      <CardHeader>
        <CardTitle className="flex items-baseline justify-between gap-4">
          <span>{title}</span>
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
}


