"use client";

import * as stylex from "@stylexjs/stylex";
import { styles } from "@/styles/site.stylex";

import * as React from "react";
import type { WeekMenu, MealKey, DayMenu, Meal, MealSectionKind } from "@/lib/types";
import { MealCard } from "@/components/MealCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, UtensilsCrossed, Cookie, Moon } from "lucide-react";
import { filterMenuItems } from "@/lib/exceptions";

interface ComprehensiveWeekViewProps {
  week: WeekMenu;
}

const mealOrder: MealKey[] = ["lunch", "dinner"];

const mealIcons = {
  breakfast: Coffee,
  lunch: UtensilsCrossed,
  snacks: Cookie,
  dinner: Moon,
};

const mealTitles = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  snacks: "Snacks",
  dinner: "Dinner",
};

const sectionTone = {
  specialVeg: styles.gridToneSpecialVeg,
  veg: styles.gridToneVeg,
  vegSides: styles.gridToneVegSides,
  nonVeg: styles.gridToneNonVeg,
  note: styles.gridToneNote,
} satisfies Record<MealSectionKind, stylex.StyleXStyles<Record<string, string | number | null>>>;

export function ComprehensiveWeekView({ week }: ComprehensiveWeekViewProps) {
  // Sort days chronologically
  const sortedDays = React.useMemo(() => Object.keys(week.menu).sort(), [week.menu]);
  const dayCount = sortedDays.length;

  const extras = React.useMemo(() => {
    const data = week.extras;
    if (!data || data.items.length === 0) return undefined;
    let formatter: Intl.NumberFormat | undefined;
    try {
      formatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: data.currency,
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      });
    } catch {
      formatter = undefined;
    }
    return { data, formatter };
  }, [week.extras]);

  return (
    <div {...stylex.props(styles.weekView)} data-stack="8">
      {/* Mobile/Tablet View - Days stacked vertically */}
      <div {...stylex.props(styles.mobileWeek)} data-stack="6">
        {sortedDays.map((dateKey) => {
          const day = week.menu[dateKey];
          return <DaySection key={dateKey} day={day} />;
        })}
      </div>

      {/* Desktop View - Transposed grid: Meals as rows, Days as columns */}
      <div {...stylex.props(styles.desktopWeek)}>
        <div {...stylex.props(styles.weekScroll)}>
          <div
            {...stylex.props(styles.weekGrid)}
            style={{
              gridTemplateColumns: `200px repeat(${dayCount}, minmax(280px, 1fr))`,
            }}
          >
            {/* Header row with days */}
            <div {...stylex.props(styles.mealColumnHeading)}>
              <h3 {...stylex.props(styles.mealColumnTitle)}>Meals</h3>
            </div>
            {sortedDays.map((dateKey) => {
              const day = week.menu[dateKey];
              return (
                <div key={dateKey} {...stylex.props(styles.dayColumnHeading)}>
                  <h3 {...stylex.props(styles.dayColumnTitle)}>{day.day}</h3>
                  <p {...stylex.props(styles.dayDate)}>{day.displayDate}</p>
                </div>
              );
            })}

            {/* Meal rows */}
            {mealOrder.map((mealKey) => (
              <React.Fragment key={mealKey}>
                {/* Meal type header */}
                <div {...stylex.props(styles.mealRowHeading)}>
                  <div {...stylex.props(styles.mealRowLabel)}>
                    <span {...stylex.props(styles.mealRowBadge)}>
                      {React.createElement(mealIcons[mealKey], {
                        ...stylex.props(styles.mealRowIcon),
                      })}
                    </span>
                    <div>
                      <span {...stylex.props(styles.mealRowTitle)}>{mealTitles[mealKey]}</span>
                    </div>
                  </div>
                </div>

                {/* Meal content for each day */}
                {sortedDays.map((dateKey) => {
                  const day = week.menu[dateKey];
                  const meal = day.meals[mealKey];

                  return (
                    <div key={`${mealKey}-${dateKey}`} {...stylex.props(styles.mealCell)}>
                      {meal ? (
                        <MealGridCard
                          meal={meal}
                          mealKey={mealKey}
                          timeRange={`${meal.startTime} – ${meal.endTime} IST`}
                        />
                      ) : (
                        <div {...stylex.props(styles.missingMeal)}>
                          <span {...stylex.props(styles.missingMealText)}>No meal</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {extras ? (
        <section {...stylex.props(styles.weekExtras)}>
          <h2 {...stylex.props(styles.weekExtrasTitle)}>{extras.data.category}</h2>
          <p {...stylex.props(styles.weekExtrasDescription)}>
            Add-ons available for any meal. Prices listed in {extras.data.currency}.
          </p>
          <ul
            {...stylex.props(styles.weekExtrasGrid)}
            aria-label={`${extras.data.category} add-ons`}
          >
            {extras.data.items.map((item) => (
              <li key={item.name} {...stylex.props(styles.weekExtra)}>
                <span {...stylex.props(styles.weekExtraName)}>{item.name}</span>
                <span {...stylex.props(styles.weekExtraPrice)}>
                  {extras.formatter?.format(item.price) ?? `${extras.data.currency} ${item.price}`}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function DaySection({ day }: { day: DayMenu }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle xstyle={styles.dayTitle}>
          <span>{day.day}</span>
          <span {...stylex.props(styles.dayDisplayDate)}>{day.displayDate}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div {...stylex.props(styles.dayMeals)}>
          {mealOrder.map((mealKey) => {
            const meal = day.meals[mealKey];
            if (!meal) return null;

            return (
              <MealCard
                key={mealKey}
                title={mealTitles[mealKey]}
                timeRange={`${meal.startTime} – ${meal.endTime} IST`}
                meal={meal}
                mealKey={mealKey}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

const MealGridCard = React.memo(function MealGridCard({
  meal,
  mealKey,
  timeRange,
}: {
  meal: Meal;
  mealKey: MealKey;
  timeRange: string;
}) {
  const Icon = mealIcons[mealKey];
  const filteredSections = React.useMemo(() => {
    if (!meal.sections) return [];
    return meal.sections
      .map((section) => ({
        ...section,
        items: filterMenuItems(section.items),
      }))
      .filter((section) => section.items.length > 0);
  }, [meal.sections]);

  const fallbackItems = React.useMemo(() => filterMenuItems(meal.items), [meal.items]);

  return (
    <Card xstyle={styles.gridCard}>
      <CardHeader xstyle={styles.gridCardHeader}>
        <CardTitle xstyle={styles.gridCardTitle}>
          <span {...stylex.props(styles.gridMealLabel)}>
            <Icon {...stylex.props(styles.gridMealIcon)} />
            <span {...stylex.props(styles.gridMealName)}>{mealTitles[mealKey]}</span>
          </span>
          <span {...stylex.props(styles.gridMealTime)}>{timeRange}</span>
        </CardTitle>
      </CardHeader>
      <CardContent xstyle={styles.gridCardContent}>
        <div {...stylex.props(styles.gridMealSections)} data-stack="2">
          {filteredSections.length > 0 ? (
            <ul aria-label="Menu items" {...stylex.props(styles.gridMealItems)}>
              {filteredSections.flatMap((section, sectionIdx) =>
                section.items.map((item, idx) => (
                  <li
                    key={`${section.kind}-${sectionIdx}-${idx}`}
                    {...stylex.props(sectionTone[section.kind] ?? sectionTone.note)}
                  >
                    {item}
                  </li>
                )),
              )}
            </ul>
          ) : fallbackItems.length > 0 ? (
            fallbackItems.map((item, idx) => (
              <div key={`fallback-${idx}`} {...stylex.props(styles.gridFallbackItem)}>
                {item}
              </div>
            ))
          ) : (
            <div {...stylex.props(styles.gridNoItems)}>No items available</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
