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
  const [activeIndex, setActiveIndex] = React.useState(() =>
    Math.max(0, meals.findIndex((m) => m.key === highlightKey))
  );

  React.useEffect(() => {
    const idx = meals.findIndex((m) => m.key === highlightKey);
    if (idx >= 0) setActiveIndex(idx);
  }, [highlightKey, meals]);

  const onSwipe = React.useRef<{ startX: number; startY: number; t: number } | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    onSwipe.current = { startX: t.clientX, startY: t.clientY, t: Date.now() };
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (!onSwipe.current) return;
    const dx = (e.changedTouches[0].clientX - onSwipe.current.startX) || 0;
    const dy = (e.changedTouches[0].clientY - onSwipe.current.startY) || 0;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);
    if (adx > ady && adx > 30) {
      if (dx < 0 && activeIndex < meals.length - 1) setActiveIndex(activeIndex + 1);
      if (dx > 0 && activeIndex > 0) setActiveIndex(activeIndex - 1);
    }
    onSwipe.current = null;
  }

  // Parallax/tilt using deviceorientation if available for highlight effect
  const [tilt, setTilt] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
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
    <div className="relative" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="relative h-[560px] sm:h-[520px]">
        {meals.map(({ key, meal, timeRange, title }, idx) => {
          const isActive = idx === activeIndex;
          const offset = idx - activeIndex;
          const z = 50 - Math.abs(offset);
          const translateY = Math.min(Math.abs(offset) * 24, 120);
          const scale = isActive ? 1 : 1 - Math.min(Math.abs(offset) * 0.04, 0.16);
          const opacity = isActive ? 1 : 0.6;

          // Shiny gradient + colorful shadow for active card
          const activeGlow = isActive
            ? {
                boxShadow: `0 12px 40px 0 oklch(0.75 0.2 ${220 + tilt.y * 40}) / 0.35`,
                background:
                  "linear-gradient(135deg, color-mix(in oklch, var(--card) 95%, oklch(0.85 0.1 250)), color-mix(in oklch, var(--card) 95%, oklch(0.9 0.12 120)))",
                transform: `translateY(${tilt.x * -2}px) rotateX(${tilt.x * 2}deg) rotateY(${tilt.y * 2}deg)`,
              }
            : undefined;

          return (
            <div
              key={key}
              className="absolute inset-0 flex items-start justify-center"
              style={{ zIndex: z, transform: `translateY(${translateY}px) scale(${scale})`, opacity }}
            >
              <div className="w-full max-w-2xl" style={activeGlow}>
                <MealCard title={title} timeRange={timeRange} meal={meal} highlight={isActive} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-2 mt-2">
        {meals.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to ${i + 1}`}
            className={cn(
              "h-2 w-2 rounded-full",
              i === activeIndex ? "bg-primary" : "bg-muted"
            )}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}


