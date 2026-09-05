"use client";

import * as stylex from "@stylexjs/stylex";
import { styles } from "@/styles/site.stylex";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { getWeekNumberFromDate, getMenuNameForOverriddenWeek } from "@/lib/menuManager";

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
  const currentMenuNumber = parseInt(currentMetadata.menuName.replace("menu", ""), 10);

  // Always calculate from the actual current week (not the override)
  const actualCurrentMenuNumber = React.useMemo(() => {
    const metadata = getMenuNameForOverriddenWeek(null);
    return parseInt(metadata.menuName.replace("menu", ""), 10);
  }, []);

  const displayLabel = currentMetadata.isOverridden
    ? `${currentMetadata.menuName} (Override)`
    : `${currentMetadata.menuName} (Current)`;

  return (
    <div {...stylex.props(styles.weekSelector)}>
      <label htmlFor="menu-selector" {...stylex.props(styles.weekSelectorLabel)}>
        Menu:
      </label>
      <div {...stylex.props(styles.weekSelectWrapper)}>
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
          {...stylex.props(styles.weekSelect)}
          title="Select menu (1-4 in rotation)"
        >
          {menuOptions.map((option) => (
            <option key={`menu-${option.menuNumber}`} value={option.menuNumber}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown {...stylex.props(styles.weekSelectChevron)} />
      </div>
      {currentMetadata.isOverridden && (
        <button
          onClick={() => onWeekChange(-1)}
          {...stylex.props(styles.weekReset)}
          title="Reset to current week"
        >
          Reset
        </button>
      )}
      <span {...stylex.props(styles.weekStatus)}>{displayLabel}</span>
    </div>
  );
}
