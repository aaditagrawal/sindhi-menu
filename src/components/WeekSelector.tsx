"use client";

import * as stylex from "@stylexjs/stylex";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { getWeekNumberFromDate, getMenuNameForOverriddenWeek } from "@/lib/menuManager";
import { easing } from "@/lib/tokens.stylex";

interface WeekSelectorProps {
  onWeekChange: (weekNumber: number) => void;
  currentOverride: number | null;
}

const styles = stylex.create({
  root: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: "0.5rem",
    rowGap: "0.5rem",
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
  },
  label: {
    color: "color-mix(in oklab, var(--foreground) 90%, transparent)",
  },
  selectWrap: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
  },
  select: {
    appearance: "none",
    borderRadius: "0.25rem",
    borderWidth: "1px",
    borderColor: "color-mix(in oklab, var(--border) 70%, transparent)",
    backgroundColor: "var(--background)",
    paddingInline: "0.5rem",
    paddingRight: "1.75rem",
    paddingBlock: "0.25rem",
    fontWeight: 500,
    cursor: "pointer",
    outlineStyle: {
      default: null,
      ":focus": "none",
    },
    boxShadow: {
      default: null,
      ":focus": "0 0 0 2px var(--ring)",
    },
    transitionProperty: "transform,scale",
    transitionDuration: "150ms",
    transitionTimingFunction: easing.spring,
    scale: {
      default: null,
      ":active": {
        default: "0.98",
        "@media (prefers-reduced-motion: reduce)": "1",
      },
    },
  },
  chevron: {
    position: "absolute",
    right: "0.375rem",
    height: "0.875rem",
    width: "0.875rem",
    color: "var(--muted-foreground)",
    pointerEvents: "none",
  },
  reset: {
    borderRadius: "calc(var(--radius) - 2px)",
    borderWidth: "1px",
    borderColor: "var(--input)",
    backgroundColor: {
      default: "var(--background)",
      ":hover": "var(--accent)",
    },
    paddingInline: "0.5rem",
    paddingBlock: "0.25rem",
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    cursor: "pointer",
  },
  status: {
    color: "var(--muted-foreground)",
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
  },
});

/** Translate a selected menu rotation into the existing week override. */
export function WeekSelector({ onWeekChange, currentOverride }: WeekSelectorProps) {
  const now = new Date();
  const currentWeekNumber = getWeekNumberFromDate(now);

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

  const actualCurrentMenuNumber = React.useMemo(() => {
    const metadata = getMenuNameForOverriddenWeek(null);
    return parseInt(metadata.menuName.replace("menu", ""), 10);
  }, []);

  const displayLabel = currentMetadata.isOverridden
    ? `${currentMetadata.menuName} (Override)`
    : `${currentMetadata.menuName} (Current)`;

  return (
    <div {...stylex.props(styles.root)}>
      <label htmlFor="menu-selector" {...stylex.props(styles.label)}>
        Menu:
      </label>
      <div {...stylex.props(styles.selectWrap)}>
        <select
          id="menu-selector"
          value={currentMenuNumber}
          onChange={(e) => {
            const selectedMenuNumber = parseInt(e.target.value, 10);

            let weekOffset = selectedMenuNumber - actualCurrentMenuNumber;
            if (weekOffset < -2) weekOffset += 4;
            if (weekOffset > 2) weekOffset -= 4;

            const targetWeek = currentWeekNumber + weekOffset;
            onWeekChange(targetWeek === currentWeekNumber ? -1 : targetWeek);
          }}
          {...stylex.props(styles.select)}
          title="Select menu (1-4 in rotation)"
        >
          {menuOptions.map((option) => (
            <option key={`menu-${option.menuNumber}`} value={option.menuNumber}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown {...stylex.props(styles.chevron)} />
      </div>
      {currentMetadata.isOverridden && (
        <button
          type="button"
          onClick={() => onWeekChange(-1)}
          {...stylex.props(styles.reset)}
          title="Reset to current week"
        >
          Reset
        </button>
      )}
      <span {...stylex.props(styles.status)}>{displayLabel}</span>
    </div>
  );
}
