"use client";

import * as stylex from "@stylexjs/stylex";
import { styles } from "@/styles/site.stylex";

import * as React from "react";
import type { Meal, MealKey } from "@/lib/types";
import { MealCard } from "@/components/MealCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Position the daily meal cards and preserve previous/next navigation. */
export function MealCarousel({
  meals,
  highlightKey,
  isPrimaryUpcoming,
}: {
  meals: Array<{ key: MealKey; meal: Meal; timeRange: string; title: string }>;
  highlightKey: MealKey;
  isPrimaryUpcoming: boolean;
}) {
  const itemRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const [tilt, setTilt] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [centerIndex, setCenterIndex] = React.useState<number>(() =>
    Math.max(
      0,
      meals.findIndex((m) => m.key === highlightKey),
    ),
  );

  // Keep centered item in sync with highlighted meal
  React.useEffect(() => {
    const idx = meals.findIndex((m) => m.key === highlightKey);
    if (idx >= 0) setCenterIndex(idx);
  }, [highlightKey, meals]);

  // Scroll the focused item into view
  React.useEffect(() => {
    const el = itemRefs.current[centerIndex];
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [centerIndex]);

  React.useEffect(() => {
    function handler(e: DeviceOrientationEvent) {
      const x = (e.beta ?? 0) / 45; // -45..45
      const y = (e.gamma ?? 0) / 45; // -45..45
      setTilt({ x, y });
    }
    window.addEventListener("deviceorientation", handler);
    return () => window.removeEventListener("deviceorientation", handler);
  }, []);

  const goPrev = () => setCenterIndex((i) => Math.max(0, i - 1));
  const goNext = () => setCenterIndex((i) => Math.min(meals.length - 1, i + 1));

  return (
    <div {...stylex.props(styles.carousel)}>
      {/* Arrows */}
      <div {...stylex.props(styles.carouselControls)}>
        <button
          type="button"
          aria-label="Previous"
          onClick={goPrev}
          {...stylex.props(styles.carouselPrevious)}
          disabled={centerIndex === 0}
        >
          <ChevronLeft {...stylex.props(styles.carouselPreviousIcon)} />
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={goNext}
          {...stylex.props(styles.carouselNext)}
          disabled={centerIndex === meals.length - 1}
        >
          <ChevronRight {...stylex.props(styles.carouselNextIcon)} />
        </button>
      </div>

      {/* Track */}
      <div {...stylex.props(styles.carouselTrack)}>
        {meals.map(({ key, meal, timeRange, title }, idx) => {
          const isActive = key === highlightKey;
          return (
            <div
              key={key}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              {...stylex.props(isActive ? styles.carouselActive : styles.carouselInactive)}
            >
              <MealCard
                title={title}
                timeRange={timeRange}
                meal={meal}
                mealKey={key}
                highlight={isActive}
                primaryUpcoming={isActive && isPrimaryUpcoming}
                tilt={tilt}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
