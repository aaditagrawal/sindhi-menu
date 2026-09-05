"use client";

import * as stylex from "@stylexjs/stylex";
import { styles } from "@/styles/site.stylex";

import * as React from "react";
import type { Meal, MealKey, MealSectionKind } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UtensilsCrossed, Moon, Leaf, Beef } from "lucide-react";
import { filterMenuItems } from "@/lib/exceptions";

const sectionTone = {
  specialVeg: styles.mealToneSpecialVeg,
  veg: styles.mealToneVeg,
  vegSides: styles.mealToneVegSides,
  nonVeg: styles.mealToneNonVeg,
  note: styles.mealToneNote,
} satisfies Record<MealSectionKind, stylex.StyleXStyles<Record<string, string | number | null>>>;

// Listed exhaustively so adding a section kind is a type error rather than a silent blank cell.
const sectionIcon = {
  specialVeg: Leaf,
  veg: Leaf,
  vegSides: undefined,
  nonVeg: Beef,
  note: undefined,
} satisfies Record<MealSectionKind, typeof Leaf | undefined>;

const iconTone = {
  specialVeg: styles.mealIconSpecialVeg,
  veg: styles.mealIconVeg,
  vegSides: undefined,
  nonVeg: styles.mealIconNonVeg,
  note: undefined,
} satisfies Record<
  MealSectionKind,
  stylex.StyleXStyles<Record<string, string | number | null>> | undefined
>;

export function MealCard({
  title,
  timeRange,
  meal,
  mealKey,
  highlight,
  primaryUpcoming,
  tilt,
}: {
  title: string;
  timeRange: string;
  meal: Meal;
  mealKey: MealKey;
  highlight?: boolean;
  primaryUpcoming?: boolean;
  tilt?: { x: number; y: number };
}) {
  const Icon = mealKey === "lunch" ? UtensilsCrossed : Moon;
  const glow = highlight
    ? {
        transform: tilt
          ? `translateY(${tilt.x * -2}px) rotateX(${tilt.x * 1.8}deg) rotateY(${tilt.y * 1.8}deg)`
          : undefined,
      }
    : undefined;

  const filteredSections = React.useMemo(() => {
    if (!meal.sections) return [];
    return meal.sections
      .map((section) => ({
        ...section,
        items: filterMenuItems(section.items),
      }))
      .filter((section) => section.items.length > 0);
  }, [meal.sections]);

  const primaryGradient =
    "linear-gradient(135deg, rgba(255, 191, 132, 0.9), rgba(255, 156, 170, 0.88))";
  const secondaryGradient =
    "linear-gradient(135deg, rgba(130, 196, 255, 0.78), rgba(187, 174, 255, 0.78))";

  const card = (
    <Card xstyle={highlight ? styles.mealCardHighlight : styles.mealCard}>
      <CardHeader>
        <CardTitle xstyle={styles.mealTitle}>
          <span {...stylex.props(styles.mealLabel)}>
            <span {...stylex.props(styles.mealBadge)}>
              <Icon {...stylex.props(styles.mealIcon)} />
            </span>
            <span>{title}</span>
          </span>
          <span {...stylex.props(styles.mealTime)}>{timeRange}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredSections.length > 0 ? (
          <ul aria-label="Menu items" {...stylex.props(styles.mealItems)}>
            {filteredSections.flatMap((section, sectionIdx) =>
              section.items.map((item, itemIdx) => {
                const IconComponent = sectionIcon[section.kind];
                const tone = sectionTone[section.kind] ?? sectionTone.note;
                return (
                  <li key={`${section.kind}-${sectionIdx}-${itemIdx}`} {...stylex.props(tone)}>
                    {IconComponent ? (
                      <IconComponent {...stylex.props(iconTone[section.kind])} />
                    ) : null}
                    <span {...stylex.props(styles.mealItemText)}>{item}</span>
                  </li>
                );
              }),
            )}
          </ul>
        ) : (
          <p {...stylex.props(styles.mealEmpty)}>No menu items listed.</p>
        )}
      </CardContent>
    </Card>
  );

  if (!highlight) return card;
  return (
    <div
      {...stylex.props(styles.mealHighlightFrame)}
      style={{
        background: primaryUpcoming ? primaryGradient : secondaryGradient,
        ...glow,
      }}
    >
      {card}
    </div>
  );
}
