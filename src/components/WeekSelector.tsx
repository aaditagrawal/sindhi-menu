"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import {
  getWeekNumberFromDate,
  getMenuNameForOverriddenWeek,
} from "@/lib/menuManager";

interface WeekSelectorProps {
  onWeekChange: (weekNumber: number) => void;
  currentOverride: number | null;
}

export function WeekSelector({ onWeekChange, currentOverride }: WeekSelectorProps) {
  const now = new Date();
  const currentWeekNumber = getWeekNumberFromDate(now);

  // Generate options for menus 1-4 (the 4-week cycle)
  const menuOptions = React.useMemo(() => {
    return [
      { menuNumber: 1, label: "Menu 1" },
      { menuNumber: 2, label: "Menu 2" },
      { menuNumber: 3, label: "Menu 3" },
      { menuNumber: 4, label: "Menu 4" },
    ];
  }, []);

  const currentMetadata = getMenuNameForOverriddenWeek(currentOverride);
  const currentMenuNumber = parseInt(
    currentMetadata.menuName.replace("menu", ""),
    10
  );

  // Always calculate from the actual current week (not the override)
  const actualCurrentMenuNumber = React.useMemo(() => {
    const metadata = getMenuNameForOverriddenWeek(null);
    return parseInt(metadata.menuName.replace("menu", ""), 10);
  }, []);

  const displayLabel = currentMetadata.isOverridden
    ? `${currentMetadata.menuName} (Override)`
    : `${currentMetadata.menuName} (Current)`;

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="menu-selector" className="text-sm font-medium text-foreground">
        Menu:
      </label>
      <div className="relative">
        <select
          id="menu-selector"
          value={currentMenuNumber}
          onChange={(e) => {
            const selectedMenuNumber = parseInt(e.target.value, 10);
            
            // Calculate the week offset from the actual current week (not the currently displayed menu)
            let weekOffset = selectedMenuNumber - actualCurrentMenuNumber;
            if (weekOffset < -2) weekOffset += 4;
            if (weekOffset > 2) weekOffset -= 4;
            
            const targetWeek = currentWeekNumber + weekOffset;
            onWeekChange(targetWeek === currentWeekNumber ? -1 : targetWeek);
          }}
          className="appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-8 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-input/80 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          title="Select menu (1-4 in rotation)"
        >
          {menuOptions.map((option) => (
            <option key={`menu-${option.menuNumber}`} value={option.menuNumber}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
      {currentMetadata.isOverridden && (
        <button
          onClick={() => onWeekChange(-1)}
          className="ml-2 rounded-md bg-secondary/50 px-2 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary transition-colors"
          title="Reset to current week"
        >
          Reset
        </button>
      )}
      <span className="text-xs text-muted-foreground ml-2">{displayLabel}</span>
    </div>
  );
}
