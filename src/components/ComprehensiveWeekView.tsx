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
    rowGap: "1.5rem",
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
  },
  desktopGrid: {
    display: "grid",
    rowGap: "0.75rem",
    columnGap: "0.75rem",
    minWidth: "max-content",
    paddingBottom: "1rem",
    alignItems: "flex-start",
    scrollSnapType: "x mandatory",
    scrollPadding: "1rem",
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
    paddingInline: "1rem",
    paddingBlock: "0.75rem",
  },
  mealsHeading: {
    fontWeight: 600,
    fontSize: "1.125rem",
    lineHeight: "calc(1.75 / 1.125)",
  },
  dayHeaderCell: {
    textAlign: "center",
  },
  semibold: {
    fontWeight: 600,
  },
  dayHeaderDate: {
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    color: "var(--muted-foreground)",
    marginTop: "0.25rem",
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
    height: "2rem",
    width: "2rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    backgroundColor: "color-mix(in oklab, var(--primary) 15%, transparent)",
  },
  icon16: {
    height: "1rem",
    width: "1rem",
    color: "var(--primary)",
  },
  medium: {
    fontWeight: 500,
  },
  dayCell: {
    paddingBlock: "0.75rem",
    paddingInline: "0.75rem",
    scrollSnapAlign: "start",
    contentVisibility: "auto",
    containIntrinsicSize: "auto 280px 24rem",
  },
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

/** Present the same week as stacked days or a transposed desktop grid. */
export function ComprehensiveWeekView({ week: initialWeek }: ComprehensiveWeekViewProps) {
  const week = initialWeek;

  const sortedDays = React.useMemo(() => Object.keys(week.menu).sort(), [week.menu]);
  const dayCount = sortedDays.length;
  const desktopCols = `200px repeat(${dayCount}, minmax(280px, 1fr))`;

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
                <div>
                  <h3 {...stylex.props(styles.mealsHeading)}>Meals</h3>
                </div>
                {sortedDays.map((dateKey) => {
                  const day = week.menu[dateKey];
                  if (!day) return null;
                  return (
                    <div key={`header-${dateKey}`} {...stylex.props(styles.dayHeaderCell)}>
                      <h3 {...stylex.props(styles.semibold)}>{day.day}</h3>
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
                <div {...stylex.props(styles.mealTypeHeader)}>
                  <div {...stylex.props(styles.mealTypeRow)}>
                    <span {...stylex.props(styles.mealTypeIconCircle)}>
                      {React.createElement(mealIcons[mealKey], {
                        ...stylex.props(styles.icon16),
                      })}
                    </span>
                    <div>
                      <span {...stylex.props(styles.medium)}>{mealTitles[mealKey]}</span>
                    </div>
                  </div>
                </div>

                {sortedDays.map((dateKey) => {
                  const day = week.menu[dateKey];
                  const meal = day?.meals[mealKey];

                  return (
                    <div key={`${mealKey}-${dateKey}`} {...stylex.props(styles.dayCell)}>
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
    rowGap: "1rem",
    columnGap: "1rem",
  },
});

function DaySection({ day }: { day: DayMenu }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle style={dayStyles.titleRow}>
          <span>{day.day}</span>
          <span {...stylex.props(dayStyles.dateLabel)}>{day.displayDate}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
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
    paddingBottom: "0.5rem",
  },
  title: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    rowGap: "0.5rem",
    columnGap: "0.5rem",
    fontSize: "0.875rem",
  },
  titleLeft: {
    display: "flex",
    alignItems: "center",
    rowGap: "0.25rem",
    columnGap: "0.25rem",
  },
  icon12: {
    height: "0.75rem",
    width: "0.75rem",
    color: "var(--primary)",
  },
  medium: {
    fontWeight: 500,
  },
  timeLabel: {
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    color: "var(--muted-foreground)",
    fontWeight: 400,
  },
  contentPad: {
    paddingTop: 0,
  },
  items: {
    display: "flex",
    flexDirection: "column",
    rowGap: "0.25rem",
  },
  item: {
    fontSize: "0.75rem",
    borderRadius: "calc(var(--radius) - 2px)",
    paddingInline: "0.5rem",
    paddingBlock: "0.25rem",
    lineHeight: 1.25,
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
    fontSize: "0.75rem",
    borderRadius: "calc(var(--radius) - 2px)",
    backgroundColor: "color-mix(in oklab, var(--muted) 50%, transparent)",
    paddingInline: "0.5rem",
    paddingBlock: "0.25rem",
    lineHeight: 1.25,
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
