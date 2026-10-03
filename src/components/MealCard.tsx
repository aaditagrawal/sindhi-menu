"use client";

import * as React from "react";
import * as stylex from "@stylexjs/stylex";
import type { Meal, MealKey, MealSection, MealSectionKind } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { sxc } from "@/lib/utils";
import { UtensilsCrossed, Moon, Leaf, Beef } from "lucide-react";
import { filterMenuItems } from "@/lib/exceptions";

const styles = stylex.create({
  itemsGrid: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(1, minmax(0, 1fr))",
      "@media (min-width: 640px)": "repeat(2, minmax(0, 1fr))",
    },
    rowGap: "0.5rem",
    columnGap: "0.5rem",
  },
  item: {
    display: "flex",
    alignItems: "center",
    columnGap: "0.5rem",
    borderRadius: "calc(var(--radius) - 2px)",
    borderWidth: "1px",
    paddingInline: "0.75rem",
    paddingBlock: "0.5rem",
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    overflowWrap: "break-word",
  },
  itemBackdrop: {
    WebkitBackdropFilter: "blur(8px)",
    backdropFilter: "blur(8px)",
  },
  badgeGreen: {
    backgroundColor: "var(--badge-green-bg)",
    borderColor: "var(--badge-green-border)",
    color: "var(--badge-green-text)",
  },
  badgeRed: {
    backgroundColor: "var(--badge-red-bg)",
    borderColor: "var(--badge-red-border)",
    color: "var(--badge-red-text)",
  },
  badgeBlue: {
    backgroundColor: "var(--badge-blue-bg)",
    borderColor: "var(--badge-blue-border)",
    color: "var(--badge-blue-text)",
  },
  badgeNeutral: {
    backgroundColor: "color-mix(in oklab, var(--muted) 40%, transparent)",
    borderColor: "color-mix(in oklab, var(--muted-foreground) 20%, transparent)",
    color: "var(--muted-foreground)",
  },
  badgeSide: {
    backgroundColor: "color-mix(in oklab, var(--foreground) 5%, transparent)",
    borderColor: "color-mix(in oklab, var(--foreground) 10%, transparent)",
    color: "var(--foreground)",
  },
  itemIcon: {
    height: "1rem",
    width: "1rem",
    flexShrink: 0,
  },
  headerRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "1.25rem",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    rowGap: "0.75rem",
    columnGap: "0.75rem",
  },
  iconCircle: {
    display: "inline-flex",
    height: "2.25rem",
    width: "2.25rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    backgroundColor: "color-mix(in oklab, var(--primary) 10%, transparent)",
    boxShadow: "0 0 0 1px color-mix(in oklab, var(--primary) 10%, transparent)",
  },
  iconCircleOnGradient: {
    WebkitBackdropFilter: "blur(8px)",
    backdropFilter: "blur(8px)",
    boxShadow: "0 0 0 1px color-mix(in oklab, #fff 20%, transparent)",
  },
  icon: {
    height: "18px",
    width: "18px",
    color: "var(--meal-type-icon)",
  },
  titleBlock: {
    display: "flex",
    flexDirection: "column",
    rowGap: "0.125rem",
  },
  title: {
    fontWeight: 600,
    fontSize: "17px",
    letterSpacing: "-0.01em",
    lineHeight: 1,
  },
  time: {
    fontSize: "13px",
    color: "var(--muted-foreground)",
    lineHeight: 1,
  },
  cardShell: {
    borderRadius: "1rem",
    borderWidth: "1px",
    backgroundColor: "var(--card)",
    color: "var(--card-foreground)",
  },
  cardShellHighlight: {
    borderColor: "color-mix(in oklab, var(--border) 70%, transparent)",
  },
  cardShellIdle: {
    borderColor: "color-mix(in oklab, var(--border) 40%, transparent)",
    boxShadow: "none",
  },
  cardPad: {
    position: "relative",
    paddingBlock: "1.5rem",
    paddingInline: "1.5rem",
  },
  gradientShell: {
    borderRadius: "1rem",
    paddingBlock: "1.5px",
    paddingInline: "1.5px",
    position: "relative",
  },
  gradientBg: (image: string) => ({
    backgroundImage: image,
  }),
  gradientInner: {
    borderRadius: "calc(1rem - 1.5px)",
    backgroundColor: "var(--card)",
    height: "100%",
    width: "100%",
  },
  innerCard: {
    backgroundColor: "transparent",
    borderWidth: 0,
    boxShadow: "none",
    borderRadius: "inherit",
  },
  empty: {
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    color: "var(--muted-foreground)",
    fontStyle: "italic",
  },
});

const sectionTone = {
  specialVeg: styles.badgeBlue,
  veg: styles.badgeGreen,
  vegSides: styles.badgeSide,
  nonVeg: styles.badgeRed,
  note: styles.badgeNeutral,
} satisfies Record<MealSectionKind, stylex.StyleXStyles>;

const sectionIcon = {
  specialVeg: Leaf,
  veg: Leaf,
  vegSides: undefined,
  nonVeg: Beef,
  note: undefined,
} satisfies Record<MealSectionKind, typeof Leaf | undefined>;

function MealSections({
  sections,
  withBackdrop,
}: {
  sections: MealSection[];
  withBackdrop: boolean;
}) {
  return (
    <ul aria-label="Menu items" {...stylex.props(styles.itemsGrid)}>
      {sections.flatMap((section, sectionIdx) =>
        section.items.map((item, itemIdx) => {
          const IconComponent = sectionIcon[section.kind];
          return (
            <li
              key={`${section.kind}-${sectionIdx}-${itemIdx}`}
              {...stylex.props(
                styles.item,
                withBackdrop && styles.itemBackdrop,
                sectionTone[section.kind],
              )}
            >
              {IconComponent ? <IconComponent {...stylex.props(styles.itemIcon)} /> : null}
              <span>{item}</span>
            </li>
          );
        }),
      )}
    </ul>
  );
}

function MealCardBase({
  title,
  timeRange,
  meal,
  mealKey,
  highlight,
  primaryUpcoming,
  isLive,
}: {
  title: string;
  timeRange: string;
  meal: Meal;
  mealKey: MealKey;
  highlight?: boolean;
  primaryUpcoming?: boolean;
  isLive?: boolean;
}) {
  const Icon = mealKey === "lunch" ? UtensilsCrossed : Moon;
  const filteredSections = React.useMemo(() => {
    if (!meal.sections) return [];
    return meal.sections
      .map((section) => ({
        ...section,
        items: filterMenuItems(section.items),
      }))
      .filter((section) => section.items.length > 0);
  }, [meal.sections]);

  const gradient = React.useMemo(() => {
    if (!highlight || !primaryUpcoming) return undefined;
    if (isLive) {
      return "linear-gradient(135deg, hsl(50 95% 70% / 0.85), hsl(330 95% 70% / 0.85))";
    }
    return "linear-gradient(135deg, black, rgba(255, 255, 255, 0.85))";
  }, [highlight, primaryUpcoming, isLive]);
  const hasGradient = Boolean(gradient);

  const content = (
    <>
      <div {...stylex.props(styles.headerRow)}>
        <div {...stylex.props(styles.headerLeft)}>
          <div {...stylex.props(styles.iconCircle, hasGradient && styles.iconCircleOnGradient)}>
            <Icon {...stylex.props(styles.icon)} strokeWidth={1.75} />
          </div>
          <div {...stylex.props(styles.titleBlock)}>
            <h3 {...stylex.props(styles.title)}>{title}</h3>
            <p {...sxc("tabular-nums", styles.time)}>{timeRange}</p>
          </div>
        </div>
      </div>
      {filteredSections.length > 0 ? (
        <MealSections sections={filteredSections} withBackdrop={hasGradient} />
      ) : (
        <p {...stylex.props(styles.empty)}>No menu items listed.</p>
      )}
    </>
  );

  if (!gradient) {
    return (
      <div
        {...sxc(
          highlight ? "press smooth-transition elevated-card" : "smooth-transition",
          styles.cardShell,
          highlight ? styles.cardShellHighlight : styles.cardShellIdle,
        )}
      >
        <div {...stylex.props(styles.cardPad)}>{content}</div>
      </div>
    );
  }

  return (
    <div
      {...sxc(
        "press smooth-transition elevated-card",
        styles.gradientShell,
        styles.gradientBg(gradient),
      )}
    >
      <div {...stylex.props(styles.gradientInner)}>
        <Card style={styles.innerCard}>
          <div {...stylex.props(styles.cardPad)}>{content}</div>
        </Card>
      </div>
    </div>
  );
}

export const MealCard = React.memo(MealCardBase);
