"use client";

import * as React from "react";
import type { Meal, MealKey } from "@/lib/types";
import { MealCard } from "@/components/MealCard";
import { cn } from "@/lib/utils";

export function MealCarousel({
  meals,
  highlightKey,
}: {
  meals: Array<{ key: MealKey; meal: Meal; timeRange: string; title: string }>;
  highlightKey: MealKey;
}) {
  const itemRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const [tilt, setTilt] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });

  React.useEffect(() => {
    const el = itemRefs.current[highlightKey];
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [highlightKey]);

  React.useEffect(() => {
    function handler(e: DeviceOrientationEvent) {
      const x = (e.beta ?? 0) / 45; // -45..45
      const y = (e.gamma ?? 0) / 45; // -45..45
      setTilt({ x, y });
    }
    window.addEventListener("deviceorientation", handler);
    return () => window.removeEventListener("deviceorientation", handler);
  }, []);

  return (
    <div className="relative overflow-visible">
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory overflow-visible">
        {meals.map(({ key, meal, timeRange, title }) => {
          const isActive = key === highlightKey;
          return (
            <div
              key={key}
              ref={(el) => {
                itemRefs.current[key] = el;
              }}
              className={cn(
                "min-w-[85%] sm:min-w-[48%] md:min-w-[42%] lg:min-w-[32%] snap-center transition overflow-visible",
                isActive ? "opacity-100 scale-100" : "opacity-60 scale-[0.98]"
              )}
            >
              <MealCard
                title={title}
                timeRange={timeRange}
                meal={meal}
                mealKey={key}
                highlight={isActive}
                tilt={tilt}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}


