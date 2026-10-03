"use client";

import * as stylex from "@stylexjs/stylex";
import * as React from "react";
import type { WeekMenu, MealKey, DayMenu, Meal, MealSectionKind } from "@/lib/types";
import { MealCard } from "@/components/MealCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UtensilsCrossed, Moon } from "lucide-react";
import { filterMenuItems } from "@/lib/exceptions";
import { useMountEffect } from "@/hooks/useMountEffect";
import { sxc } from "@/lib/utils";
import { easing } from "@/lib/tokens.stylex";

interface ComprehensiveWeekViewProps {
  week: WeekMenu;
}

const mealOrder: MealKey[] = ["lunch", "dinner"];

const mealIcons = {
  lunch: UtensilsCrossed,
  dinner: Moon,
};

const mealTitles = {
  lunch: "Lunch",
  dinner: "Dinner",
};

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    rowGap: "2rem",
  },
  mobileWrap: {
    display: {
      default: "flex",
      "@media (min-width: 1024px)": "none",
    },
    flexDirection: "column",
    rowGap: {
      default: "1rem",
      "@media (min-width: 640px)": "1.5rem",
    },
  },
  desktopWrap: {
    display: {
      default: "none",
      "@media (min-width: 1024px)": "block",
    },
  },
  desktopScroll: {
    overflowX: "auto",
    scrollBehavior: "auto",
    overscrollBehaviorX: "contain",
    paddingBottom: "0.5rem",
    scrollbarWidth: "auto",
    scrollbarColor: "color-mix(in oklab, var(--muted-foreground) 45%, transparent) transparent",
  },
  desktopGrid: {
    display: "grid",
    rowGap: "0.75rem",
    columnGap: "0.75rem",
    width: "max-content",
    paddingBottom: "0.5rem",
    alignItems: "flex-start",
  },
  gridCols: (cols: string) => ({
    gridTemplateColumns: cols,
  }),
  stickyHeaderRow: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    backgroundColor: "color-mix(in oklab, var(--background) 95%, transparent)",
    WebkitBackdropFilter: "blur(8px)",
    backdropFilter: "blur(8px)",
    borderBottomWidth: "1px",
    borderBottomColor: "color-mix(in oklab, var(--border) 50%, transparent)",
    gridColumn: "1 / -1",
  },
  headerGrid: {
    display: "grid",
    rowGap: "0.75rem",
    columnGap: "0.75rem",
    alignItems: "flex-start",
    paddingBlock: "0.75rem",
  },
  mealsHeading: {
    paddingInline: "0.75rem",
    fontWeight: 600,
    fontSize: "0.8125rem",
    lineHeight: 1.5,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "var(--muted-foreground)",
  },
  // Line the day name up with the dish text: cell padding + card border + card padding.
  dayHeaderCell: {
    paddingInline: "calc(0.75rem + 1px + 1.125rem)",
  },
  dayName: {
    fontWeight: 600,
    fontSize: "1.0625rem",
    lineHeight: 1.3,
    letterSpacing: "-0.01em",
  },
  dayHeaderDate: {
    fontSize: "0.8125rem",
    lineHeight: 1.4,
    color: "var(--muted-foreground)",
    marginTop: "0.125rem",
  },
  mealRowGrid: {
    display: "grid",
    rowGap: "0.75rem",
    columnGap: "0.75rem",
    alignItems: "flex-start",
    borderTopWidth: "1px",
    borderTopColor: "color-mix(in oklab, var(--border) 50%, transparent)",
    gridColumn: "1 / -1",
  },
  // The label column stays pinned while the day columns scroll under it.
  stickyLabel: {
    position: "sticky",
    left: 0,
    zIndex: 1,
    alignSelf: "stretch",
    backgroundColor: "var(--background)",
  },
  mealTypeHeader: {
    paddingBlock: "0.75rem",
    paddingInline: "0.75rem",
  },
  mealTypeRow: {
    display: "flex",
    alignItems: "center",
    rowGap: "0.5rem",
    columnGap: "0.5rem",
  },
  mealTypeIconCircle: {
    display: "inline-flex",
    flexShrink: 0,
    height: "2.25rem",
    width: "2.25rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    backgroundColor: "color-mix(in oklab, var(--primary) 15%, transparent)",
  },
  icon16: {
    height: "1.125rem",
    width: "1.125rem",
    color: "var(--meal-type-icon)",
  },
  mealTypeLabel: {
    fontWeight: 600,
    fontSize: "1.0625rem",
    letterSpacing: "-0.01em",
  },
  dayCell: {
    paddingBlock: "0.75rem",
    paddingInline: "0.75rem",
    contentVisibility: "auto",
  },
  // Offscreen cells skip rendering, so give each one a height estimate from its dish count;
  // otherwise one placeholder size inflates short rows. `auto` keeps the real size once seen.
  dayCellSize: (height: number) => ({
    containIntrinsicSize: `auto 320px auto ${height}px`,
  }),
  noMealCell: {
    paddingBlock: "1rem",
    paddingInline: "1rem",
    borderRadius: "var(--radius)",
    borderWidth: "2px",
    borderStyle: "dashed",
    borderColor: "color-mix(in oklab, var(--muted-foreground) 20%, transparent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "8rem",
  },
  mutedSm: {
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    color: "var(--muted-foreground)",
  },
  extras: {
    display: "flex",
    flexDirection: "column",
    rowGap: "0.75rem",
  },
  extrasTitle: {
    fontSize: "1.125rem",
    lineHeight: "calc(1.75 / 1.125)",
    fontWeight: 600,
  },
  extrasDescription: {
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    color: "var(--muted-foreground)",
  },
  extrasGrid: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(1, minmax(0, 1fr))",
      "@media (min-width: 640px)": "repeat(2, minmax(0, 1fr))",
      "@media (min-width: 1024px)": "repeat(3, minmax(0, 1fr))",
    },
    rowGap: "0.5rem",
    columnGap: "0.5rem",
  },
  extra: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: "0.75rem",
    borderRadius: "calc(var(--radius) - 2px)",
    borderWidth: "1px",
    borderColor: "color-mix(in oklab, var(--border) 60%, transparent)",
    backgroundColor: "var(--card)",
    paddingInline: "0.75rem",
    paddingBlock: "0.5rem",
  },
  extraName: {
    fontSize: "0.875rem",
  },
  extraPrice: {
    fontSize: "0.875rem",
    color: "var(--muted-foreground)",
    fontVariantNumeric: "tabular-nums",
  },
});

function verticalWheelPixels(event: WheelEvent, el: HTMLElement) {
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return 0;
  if (event.deltaY === 0) return 0;
  if (event.deltaMode === 1) return event.deltaY * 16;
  if (event.deltaMode === 2) return event.deltaY * el.clientWidth;
  return event.deltaY;
}

/** Rough rendered height of a desktop grid cell, used only as the offscreen placeholder. */
function estimateCellHeight(meal: Meal | undefined) {
  if (!meal) return 160;
  const sectionItems = meal.sections?.reduce((count, section) => count + section.items.length, 0);
  const items = sectionItems || meal.items.length || 1;
  return 88 + items * 36;
}

/** Present the same week as stacked days or a transposed desktop grid. */
export function ComprehensiveWeekView({ week: initialWeek }: ComprehensiveWeekViewProps) {
  const week = initialWeek;

  const sortedDays = React.useMemo(() => Object.keys(week.menu).sort(), [week.menu]);
  const dayCount = sortedDays.length;
  // Fixed tracks: a `1fr` track would grow to its content as offscreen cells render, shifting the scrollbar.
  const desktopCols = `clamp(140px, 12vw, 176px) repeat(${dayCount}, clamp(300px, 30vw, 440px))`;

  const scrollerRef = React.useRef<HTMLDivElement>(null);
  useMountEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let max = 0;
    let left = el.scrollLeft;
    let queued = 0;
    let frame = 0;

    function measure() {
      const node = scrollerRef.current;
      if (!node) return;
      max = Math.max(0, node.scrollWidth - node.clientWidth);
      if (frame === 0) left = node.scrollLeft;
    }
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    const grid = el.firstElementChild;
    if (grid) observer.observe(grid);

    function flush() {
      const node = scrollerRef.current;
      frame = 0;
      if (!node) return;
      const next = Math.min(max, Math.max(0, left + queued));
      queued = 0;
      if (next === left) return;
      left = next;
      node.scrollLeft = next;
    }

    function onWheel(event: WheelEvent) {
      const node = scrollerRef.current;
      if (!node) return;
      const delta = verticalWheelPixels(event, node);
      if (delta === 0 || max <= 1) return;
      const next = Math.min(max, Math.max(0, left + queued + delta));
      if (next === left + queued) return;
      event.preventDefault();
      queued += delta;
      if (frame === 0) frame = requestAnimationFrame(flush);
    }

    function onScroll() {
      const node = scrollerRef.current;
      if (!node || frame !== 0) return;
      left = node.scrollLeft;
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", onScroll);
      observer.disconnect();
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  });

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
    <div {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.mobileWrap)}>
        {sortedDays.map((dateKey) => {
          const day = week.menu[dateKey];
          if (!day) return null;
          return <DaySection key={dateKey} day={day} />;
        })}
      </div>

      <div {...stylex.props(styles.desktopWrap)}>
        <div ref={scrollerRef} {...stylex.props(styles.desktopScroll)}>
          <div {...sxc("scroll-grid", styles.desktopGrid, styles.gridCols(desktopCols))}>
            <div {...stylex.props(styles.stickyHeaderRow)}>
              <div {...stylex.props(styles.headerGrid, styles.gridCols(desktopCols))}>
                <div {...stylex.props(styles.stickyLabel)}>
                  <h3 {...stylex.props(styles.mealsHeading)}>Meals</h3>
                </div>
                {sortedDays.map((dateKey) => {
                  const day = week.menu[dateKey];
                  if (!day) return null;
                  return (
                    <div key={`header-${dateKey}`} {...stylex.props(styles.dayHeaderCell)}>
                      <h3 {...stylex.props(styles.dayName)}>{day.day}</h3>
                      <p {...stylex.props(styles.dayHeaderDate)}>{day.displayDate}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {mealOrder.map((mealKey) => (
              <div
                key={mealKey}
                {...stylex.props(styles.mealRowGrid, styles.gridCols(desktopCols))}
              >
                <div {...stylex.props(styles.stickyLabel, styles.mealTypeHeader)}>
                  <div {...stylex.props(styles.mealTypeRow)}>
                    <span {...stylex.props(styles.mealTypeIconCircle)}>
                      {React.createElement(mealIcons[mealKey], {
                        ...stylex.props(styles.icon16),
                      })}
                    </span>
                    <div>
                      <span {...stylex.props(styles.mealTypeLabel)}>{mealTitles[mealKey]}</span>
                    </div>
                  </div>
                </div>

                {sortedDays.map((dateKey) => {
                  const day = week.menu[dateKey];
                  const meal = day?.meals[mealKey];

                  return (
                    <div
                      key={`${mealKey}-${dateKey}`}
                      {...stylex.props(
                        styles.dayCell,
                        styles.dayCellSize(estimateCellHeight(meal)),
                      )}
                    >
                      {meal ? (
                        <MealGridCard
                          meal={meal}
                          mealKey={mealKey}
                          timeRange={`${meal.startTime} – ${meal.endTime} IST`}
                        />
                      ) : (
                        <div {...stylex.props(styles.noMealCell)}>
                          <span {...stylex.props(styles.mutedSm)}>No meal</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {extras ? (
        <section {...stylex.props(styles.extras)}>
          <h2 {...stylex.props(styles.extrasTitle)}>{extras.data.category}</h2>
          <p {...stylex.props(styles.extrasDescription)}>
            Add-ons available for any meal. Prices listed in {extras.data.currency}.
          </p>
          <ul {...stylex.props(styles.extrasGrid)} aria-label={`${extras.data.category} add-ons`}>
            {extras.data.items.map((item) => (
              <li key={item.name} {...stylex.props(styles.extra)}>
                <span {...stylex.props(styles.extraName)}>{item.name}</span>
                <span {...stylex.props(styles.extraPrice)}>
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

const dayStyles = stylex.create({
  header: {
    paddingInline: {
      default: "1rem",
      "@media (min-width: 640px)": "1.5rem",
    },
    paddingTop: {
      default: "1.25rem",
      "@media (min-width: 640px)": "1.5rem",
    },
    paddingBottom: "1rem",
  },
  content: {
    paddingInline: {
      default: "0.75rem",
      "@media (min-width: 640px)": "1.5rem",
    },
    paddingBottom: {
      default: "0.75rem",
      "@media (min-width: 640px)": "1.5rem",
    },
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: "0.75rem",
  },
  dateLabel: {
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    fontWeight: 400,
    color: "var(--muted-foreground)",
  },
  mealsGrid: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(1, minmax(0, 1fr))",
      "@media (min-width: 640px)": "repeat(2, minmax(0, 1fr))",
    },
    rowGap: "0.75rem",
    columnGap: "1rem",
  },
});

function DaySection({ day }: { day: DayMenu }) {
  return (
    <Card>
      <CardHeader style={dayStyles.header}>
        <CardTitle style={dayStyles.titleRow}>
          <span>{day.day}</span>
          <span {...stylex.props(dayStyles.dateLabel)}>{day.displayDate}</span>
        </CardTitle>
      </CardHeader>
      <CardContent style={dayStyles.content}>
        <div {...stylex.props(dayStyles.mealsGrid)}>
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

const gridCardStyles = stylex.create({
  card: {
    boxShadow: {
      default: null,
      ":hover": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    },
    transitionProperty: "transform, opacity, box-shadow",
    transitionDuration: "0.12s",
    transitionTimingFunction: easing.spring,
  },
  headerPad: {
    padding: "1.125rem",
    paddingBottom: "0.75rem",
  },
  title: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    rowGap: "0.5rem",
    columnGap: "0.5rem",
    fontSize: "0.9375rem",
    letterSpacing: "-0.01em",
  },
  titleLeft: {
    display: "flex",
    alignItems: "center",
    rowGap: "0.375rem",
    columnGap: "0.375rem",
  },
  icon12: {
    height: "0.875rem",
    width: "0.875rem",
    color: "var(--meal-type-icon)",
  },
  medium: {
    fontWeight: 600,
  },
  timeLabel: {
    fontSize: "0.75rem",
    lineHeight: 1.4,
    color: "var(--muted-foreground)",
    fontWeight: 400,
    letterSpacing: 0,
  },
  contentPad: {
    padding: "1.125rem",
    paddingTop: 0,
  },
  items: {
    display: "flex",
    flexDirection: "column",
    rowGap: "0.375rem",
  },
  item: {
    fontSize: "0.8125rem",
    borderRadius: "calc(var(--radius) - 2px)",
    paddingInline: "0.625rem",
    paddingBlock: "0.3125rem",
    lineHeight: 1.4,
    borderWidth: "1px",
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
  fallbackItem: {
    fontSize: "0.8125rem",
    borderRadius: "calc(var(--radius) - 2px)",
    backgroundColor: "color-mix(in oklab, var(--muted) 50%, transparent)",
    paddingInline: "0.625rem",
    paddingBlock: "0.3125rem",
    lineHeight: 1.4,
    borderWidth: "1px",
    borderColor: "color-mix(in oklab, var(--border) 20%, transparent)",
  },
  noItems: {
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    color: "var(--muted-foreground)",
    fontStyle: "italic",
    paddingBlock: "0.5rem",
  },
});

const sectionTone = {
  specialVeg: gridCardStyles.badgeBlue,
  veg: gridCardStyles.badgeGreen,
  vegSides: gridCardStyles.badgeSide,
  nonVeg: gridCardStyles.badgeRed,
  note: gridCardStyles.badgeNeutral,
} satisfies Record<MealSectionKind, stylex.StyleXStyles>;

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
    <Card style={gridCardStyles.card}>
      <CardHeader style={gridCardStyles.headerPad}>
        <CardTitle style={gridCardStyles.title}>
          <span {...stylex.props(gridCardStyles.titleLeft)}>
            <Icon {...stylex.props(gridCardStyles.icon12)} />
            <span {...stylex.props(gridCardStyles.medium)}>{mealTitles[mealKey]}</span>
          </span>
          <span {...sxc("tabular-nums", gridCardStyles.timeLabel)}>{timeRange}</span>
        </CardTitle>
      </CardHeader>
      <CardContent style={gridCardStyles.contentPad}>
        <div {...stylex.props(gridCardStyles.items)}>
          {filteredSections.length > 0 ? (
            <ul aria-label="Menu items" {...stylex.props(gridCardStyles.items)}>
              {filteredSections.flatMap((section, sectionIdx) =>
                section.items.map((item, idx) => (
                  <li
                    key={`${section.kind}-${sectionIdx}-${idx}`}
                    {...stylex.props(gridCardStyles.item, sectionTone[section.kind])}
                  >
                    {item}
                  </li>
                )),
              )}
            </ul>
          ) : fallbackItems.length > 0 ? (
            fallbackItems.map((item, idx) => (
              <div key={`fallback-${idx}`} {...stylex.props(gridCardStyles.fallbackItem)}>
                {item}
              </div>
            ))
          ) : (
            <div {...stylex.props(gridCardStyles.noItems)}>No items available</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
