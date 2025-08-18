"use client";

import * as React from "react";
import type { MealKey, WeekMenu } from "@/lib/types";
import { findCurrentOrUpcomingMeal } from "@/lib/date";
import { InlineSelect } from "@/components/InlineSelect";
import { MealCarousel } from "@/components/MealCarousel";
import { getWeekMenuClient, type WeekId, fetchWeekIds, getAllYearsFromList, getWeeksByYearFromList, getLatestWeekIdForYearFromList } from "@/data/weeks/client";
import { useRouter } from "next/navigation";

export function MenuViewer({
  initialWeekId,
  initialWeek,
  routingMode = "home",
}: {
  initialWeekId: WeekId;
  initialWeek: WeekMenu;
  routingMode?: "home" | "week";
}) {
  const router = useRouter();
  const [allWeekIds, setAllWeekIds] = React.useState<WeekId[]>([initialWeekId]);
  const [weekId, setWeekId] = React.useState<WeekId>(initialWeekId);
  const [week, setWeek] = React.useState<WeekMenu>(initialWeek);
  const initialYear = React.useMemo(() => initialWeekId.slice(0, 4), [initialWeekId]);
  const [year, setYear] = React.useState<string>(initialYear);
  // Fetch available week ids on mount
  React.useEffect(() => {
    fetchWeekIds().then(setAllWeekIds).catch(() => {});
  }, []);

  const [dateKey, setDateKey] = React.useState<string>(() => {
    const ptr = findCurrentOrUpcomingMeal(initialWeek);
    return ptr?.dateKey ?? Object.keys(initialWeek.menu)[0];
  });

  // When year changes, adjust week list and pick the latest for that year
  React.useEffect(() => {
    const weeks = getWeeksByYearFromList(allWeekIds, year);
    if (weeks.length === 0) return;
    if (!weeks.includes(weekId)) {
      const latestForYear = getLatestWeekIdForYearFromList(allWeekIds, year);
      if (latestForYear) setWeekId(latestForYear);
    }
  }, [year, allWeekIds]);

  // When weekId changes, either route (week mode) or load locally (home mode)
  React.useEffect(() => {
    if (weekId === initialWeekId) return;
    if (routingMode === "week") {
      router.push(`/week/${weekId}`);
      return;
    }
    getWeekMenuClient(weekId).then((w) => {
      setWeek(w);
      const ptr = findCurrentOrUpcomingMeal(w);
      setDateKey(ptr?.dateKey ?? Object.keys(w.menu)[0]);
    });
  }, [weekId]);

  // Ensure dateKey is valid for current week
  React.useEffect(() => {
    if (!week.menu[dateKey]) {
      const keys = Object.keys(week.menu).sort();
      setDateKey(keys[0]);
    }
  }, [week, dateKey]);

  const pointer = findCurrentOrUpcomingMeal(week);
  const effectiveDateKey = dateKey ?? pointer?.dateKey ?? Object.keys(week.menu)[0];
  const day = week.menu[effectiveDateKey];

  const order: MealKey[] = ["breakfast", "lunch", "snacks", "dinner"];
  const meals = order
    .filter((k) => day.meals[k])
    .map((k) => ({
      key: k,
      meal: day.meals[k]!,
      timeRange: `${day.meals[k]!.startTime} – ${day.meals[k]!.endTime} IST`,
      title: k[0].toUpperCase() + k.slice(1),
    }));

  const highlightKey = (pointer && pointer.dateKey === effectiveDateKey
    ? pointer.mealKey
    : (meals[0]?.key ?? "breakfast")) as MealKey;

  const yearOptions = getAllYearsFromList(allWeekIds).map((y) => ({ label: y, value: y }));
  const weekOptions = getWeeksByYearFromList(allWeekIds, year).map((id) => ({ label: id, value: id }));
  const dayOptions = Object.keys(week.menu)
    .sort()
    .map((k) => ({ label: `${week.menu[k].day} • ${k}`, value: k }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <InlineSelect
          label="Year"
          value={year}
          options={yearOptions}
          onChange={(v) => setYear(String(v))}
        />
        <span className="text-muted-foreground">/</span>
        <InlineSelect
          label="Week"
          value={weekId}
          options={weekOptions}
          onChange={(v) => setWeekId(v as WeekId)}
        />
        <span className="text-muted-foreground">/</span>
        <InlineSelect
          label="Day"
          value={effectiveDateKey}
          options={dayOptions}
          onChange={(v) => setDateKey(String(v))}
        />
      </div>

      <MealCarousel meals={meals} highlightKey={highlightKey} />
    </div>
  );
}


