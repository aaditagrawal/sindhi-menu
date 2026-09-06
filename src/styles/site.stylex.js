import * as stylex from "@stylexjs/stylex";
export const themeMarker = stylex.defaultMarker();
export const styles = stylex.create({
  contributingPage: {
    minHeight: "100vh",
    paddingInline: {
      default: "calc(var(--spacing) * 4)",
      "@media (width >= 40rem) and (width < 48rem)": "calc(var(--spacing) * 6)",
      "@media (min-width:48rem)": "calc(var(--spacing) * 8)",
    },
    paddingBlock: "calc(var(--spacing) * 8)",
  },
  contributingContent: {
    marginInline: "auto",
    maxWidth: "var(--container-3xl)",
  },
  themeControl: {
    position: "fixed",
    top: "calc(var(--spacing) * 4)",
    right: "calc(var(--spacing) * 4)",
    zIndex: "50",
  },
  main: {
    flex: "1",
  },
  footer: {
    borderTopStyle: "var(--tw-border-style)",
    borderTopWidth: "1px",
    backgroundColor: {
      default: "var(--secondary)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--secondary) 40%, transparent)",
    },
  },
  footerContent: {
    marginInline: "auto",
    maxWidth: "var(--container-4xl)",
    "--stack-space": "calc(var(--spacing) * 2)",
    paddingInline: "calc(var(--spacing) * 4)",
    paddingBlock: "calc(var(--spacing) * 3)",
  },
  footerText: {
    textAlign: "center",
    fontSize: "var(--text-sm)",
    lineHeight: "var(--tw-leading,var(--text-sm--line-height))",
    color: "var(--foreground)",
  },
  authorLink: {
    textDecorationLine: {
      default: "underline",
      "@media (hover:hover)": {
        default: null,
        ":hover": "none",
      },
    },
  },
  sourceLink: {
    textDecorationLine: {
      default: "underline",
      "@media (hover:hover)": {
        default: null,
        ":hover": "none",
      },
    },
  },
  apiLink: {
    textDecorationLine: {
      default: "underline",
      "@media (hover:hover)": {
        default: null,
        ":hover": "none",
      },
    },
  },
  body: {
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },
  dailyPage: {
    paddingInline: {
      default: "calc(var(--spacing) * 4)",
      "@media (width >= 40rem) and (width < 48rem)": "calc(var(--spacing) * 6)",
      "@media (min-width:48rem)": "calc(var(--spacing) * 8)",
    },
    paddingBlock: "calc(var(--spacing) * 8)",
  },
  dailyContent: {
    marginInline: "auto",
    maxWidth: "var(--container-4xl)",
    "--stack-space": "calc(var(--spacing) * 6)",
  },
  fullPage: {
    paddingInline: {
      default: "calc(var(--spacing) * 4)",
      "@media (width >= 40rem) and (width < 48rem)": "calc(var(--spacing) * 6)",
      "@media (min-width:48rem)": "calc(var(--spacing) * 8)",
    },
    paddingBlock: "calc(var(--spacing) * 8)",
  },
  fullContent: {
    marginInline: "auto",
    maxWidth: "100%",
    "--stack-space": "calc(var(--spacing) * 6)",
  },
  fullHeader: {
    "--stack-space": "calc(var(--spacing) * 2)",
  },
  fullTitle: {
    display: "flex",
    flexDirection: {
      default: "column",
      "@media (min-width:40rem)": "row",
    },
    justifyContent: "space-between",
    gap: "calc(var(--spacing) * 4)",
    alignItems: {
      default: null,
      "@media (min-width:40rem)": "center",
    },
  },
  fullDescription: {
    fontSize: {
      default: "var(--text-2xl)",
      "@media (min-width:40rem)": "var(--text-3xl)",
    },
    lineHeight: {
      default: "var(--tw-leading,var(--text-2xl--line-height))",
      "@media (min-width:40rem)": "var(--tw-leading,var(--text-3xl--line-height))",
    },
    "--tw-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
  },
  fullActions: {
    color: "var(--muted-foreground)",
  },
  dailyIcon: {
    alignSelf: {
      default: "flex-start",
      "@media (min-width:40rem)": "auto",
    },
  },
  homeIcon: {
    marginRight: "calc(var(--spacing) * 2)",
    height: "calc(var(--spacing) * 4)",
    width: "calc(var(--spacing) * 4)",
  },
  rotationPage: {
    paddingInline: {
      default: "calc(var(--spacing) * 4)",
      "@media (width >= 40rem) and (width < 48rem)": "calc(var(--spacing) * 6)",
      "@media (min-width:48rem)": "calc(var(--spacing) * 8)",
    },
    paddingBlock: "calc(var(--spacing) * 8)",
  },
  rotationContent: {
    marginInline: "auto",
    maxWidth: "var(--container-4xl)",
    "--stack-space": "calc(var(--spacing) * 6)",
  },
  weeksPage: {
    paddingInline: {
      default: "calc(var(--spacing) * 4)",
      "@media (width >= 40rem) and (width < 48rem)": "calc(var(--spacing) * 6)",
      "@media (min-width:48rem)": "calc(var(--spacing) * 8)",
    },
    paddingBlock: "calc(var(--spacing) * 8)",
  },
  weeksContent: {
    marginInline: "auto",
    maxWidth: "var(--container-3xl)",
    "--stack-space": "calc(var(--spacing) * 6)",
  },
  weeksHeading: {
    fontSize: "var(--text-2xl)",
    lineHeight: "var(--tw-leading,var(--text-2xl--line-height))",
    "--tw-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
  },
  weeksDescription: {
    color: "var(--muted-foreground)",
  },
  weeksList: {
    "--stack-space": "calc(var(--spacing) * 3)",
  },
  weekRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "var(--radius)",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    padding: "calc(var(--spacing) * 3)",
  },
  weekLink: {
    "--tw-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    textDecorationLine: "underline",
  },
  weekActions: {
    display: "flex",
    gap: "calc(var(--spacing) * 2)",
  },
  weekDailyIcon: {
    marginRight: "var(--spacing)",
    height: "calc(var(--spacing) * 3)",
    width: "calc(var(--spacing) * 3)",
  },
  weekFullIcon: {
    marginRight: "var(--spacing)",
    height: "calc(var(--spacing) * 3)",
    width: "calc(var(--spacing) * 3)",
  },
  dayTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  gridCard: {
    transitionProperty: "box-shadow",
    transitionTimingFunction: "var(--tw-ease,var(--default-transition-timing-function))",
    transitionDuration: "var(--tw-duration,var(--default-transition-duration))",
    "--tw-shadow": {
      default: null,
      "@media (hover:hover)": {
        default: null,
        ":hover":
          "0 4px 6px -1px var(--tw-shadow-color,#0000001a), 0 2px 4px -2px var(--tw-shadow-color,#0000001a)",
      },
    },
    boxShadow: {
      default: null,
      "@media (hover:hover)": {
        default: null,
        ":hover":
          "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
      },
    },
  },
  gridCardHeader: {
    paddingBottom: "calc(var(--spacing) * 2)",
  },
  gridCardTitle: {
    "--tw-leading": null,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "calc(var(--spacing) * 2)",
    fontSize: "var(--text-sm)",
    lineHeight: "var(--tw-leading,var(--text-sm--line-height))",
  },
  gridCardContent: {
    paddingTop: "0",
  },
  weekView: {
    "--stack-space": "calc(var(--spacing) * 8)",
  },
  mobileWeek: {
    display: {
      default: "block",
      "@media (min-width:64rem)": "none",
    },
    "--stack-space": "calc(var(--spacing) * 6)",
  },
  desktopWeek: {
    display: {
      default: "none",
      "@media (min-width:64rem)": "block",
    },
  },
  weekScroll: {
    overflowX: "auto",
  },
  weekGrid: {
    display: "grid",
    minWidth: "max-content",
    alignItems: "flex-start",
    gap: "calc(var(--spacing) * 3)",
    paddingBottom: "calc(var(--spacing) * 4)",
  },
  mealColumnHeading: {
    position: "sticky",
    top: "0",
    zIndex: "10",
    backgroundColor: "var(--background)",
    padding: "calc(var(--spacing) * 3)",
  },
  mealColumnTitle: {
    fontSize: "var(--text-lg)",
    lineHeight: "var(--tw-leading,var(--text-lg--line-height))",
    "--tw-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
  },
  dayColumnHeading: {
    position: "sticky",
    top: "0",
    zIndex: "10",
    borderLeftStyle: "var(--tw-border-style)",
    borderLeftWidth: "1px",
    borderColor: {
      default: "var(--border)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--border) 50%, transparent)",
    },
    backgroundColor: "var(--background)",
    padding: "calc(var(--spacing) * 3)",
    textAlign: "center",
  },
  dayColumnTitle: {
    fontSize: "var(--text-lg)",
    lineHeight: "var(--tw-leading,var(--text-lg--line-height))",
    "--tw-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
  },
  dayDate: {
    marginTop: "var(--spacing)",
    fontSize: "var(--text-sm)",
    lineHeight: "var(--tw-leading,var(--text-sm--line-height))",
    color: "var(--muted-foreground)",
  },
  mealRowHeading: {
    borderTopStyle: "var(--tw-border-style)",
    borderTopWidth: "1px",
    borderColor: {
      default: "var(--border)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--border) 50%, transparent)",
    },
    padding: "calc(var(--spacing) * 3)",
  },
  mealRowLabel: {
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
  },
  mealRowBadge: {
    display: "inline-flex",
    height: "calc(var(--spacing) * 8)",
    width: "calc(var(--spacing) * 8)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "3.40282e38px",
    backgroundColor: {
      default: "var(--primary)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--primary) 15%, transparent)",
    },
  },
  mealRowTitle: {
    "--tw-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
  },
  mealCell: {
    borderTopStyle: "var(--tw-border-style)",
    borderTopWidth: "1px",
    borderLeftStyle: "var(--tw-border-style)",
    borderLeftWidth: "1px",
    borderColor: {
      default: "var(--border)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--border) 50%, transparent)",
    },
    padding: "calc(var(--spacing) * 3)",
  },
  missingMeal: {
    display: "flex",
    minHeight: "calc(var(--spacing) * 32)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "var(--radius)",
    borderStyle: "dashed",
    borderWidth: "2px",
    "--tw-border-style": "dashed",
    borderColor: {
      default: "var(--muted-foreground)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--muted-foreground) 20%, transparent)",
    },
    padding: "calc(var(--spacing) * 4)",
  },
  missingMealText: {
    fontSize: "var(--text-sm)",
    lineHeight: "var(--tw-leading,var(--text-sm--line-height))",
    color: "var(--muted-foreground)",
  },
  weekExtras: {
    borderRadius: "calc(var(--radius) + 4px)",
    borderStyle: "dashed",
    borderWidth: "1px",
    "--tw-border-style": "dashed",
    borderColor: {
      default: "var(--muted-foreground)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--muted-foreground) 40%, transparent)",
    },
    backgroundColor: {
      default: "var(--muted)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--muted) 40%, transparent)",
    },
    paddingInline: {
      default: "calc(var(--spacing) * 4)",
      "@media (min-width:40rem)": "calc(var(--spacing) * 5)",
    },
    paddingBlock: "calc(var(--spacing) * 3)",
  },
  weekExtrasTitle: {
    fontSize: {
      default: "var(--text-base)",
      "@media (min-width:40rem)": "var(--text-lg)",
    },
    lineHeight: {
      default: "var(--tw-leading,var(--text-base--line-height))",
      "@media (min-width:40rem)": "var(--tw-leading,var(--text-lg--line-height))",
    },
    "--tw-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--muted-foreground)",
  },
  weekExtrasDescription: {
    marginTop: "var(--spacing)",
    fontSize: {
      default: "var(--text-xs)",
      "@media (min-width:40rem)": "var(--text-sm)",
    },
    lineHeight: {
      default: "var(--tw-leading,var(--text-xs--line-height))",
      "@media (min-width:40rem)": "var(--tw-leading,var(--text-sm--line-height))",
    },
    color: {
      default: "var(--muted-foreground)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--muted-foreground) 80%, transparent)",
    },
  },
  weekExtrasGrid: {
    marginTop: "calc(var(--spacing) * 3)",
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(1,minmax(0,1fr))",
      "@media (width >= 40rem) and (width < 48rem)": "repeat(2,minmax(0,1fr))",
      "@media (min-width:48rem)": "repeat(3,minmax(0,1fr))",
    },
    gap: "calc(var(--spacing) * 2)",
  },
  weekExtra: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "var(--radius)",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    borderColor: {
      default: "var(--border)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--border) 40%, transparent)",
    },
    backgroundColor: {
      default: "var(--card)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--card) 80%, transparent)",
    },
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 2)",
    fontSize: "var(--text-sm)",
    lineHeight: "var(--tw-leading,var(--text-sm--line-height))",
  },
  weekExtraName: {
    "--tw-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: {
      default: "var(--foreground)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--foreground) 90%, transparent)",
    },
  },
  weekExtraPrice: {
    "--tw-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--primary)",
  },
  dayDisplayDate: {
    fontSize: "var(--text-sm)",
    lineHeight: "var(--tw-leading,var(--text-sm--line-height))",
    "--tw-font-weight": "var(--font-weight-normal)",
    fontWeight: "var(--font-weight-normal)",
    color: "var(--muted-foreground)",
  },
  dayMeals: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(1,minmax(0,1fr))",
      "@media (min-width:40rem)": "repeat(2,minmax(0,1fr))",
    },
    gap: "calc(var(--spacing) * 4)",
  },
  gridMealLabel: {
    display: "flex",
    alignItems: "center",
    gap: "var(--spacing)",
  },
  gridMealIcon: {
    height: "calc(var(--spacing) * 3)",
    width: "calc(var(--spacing) * 3)",
    color: "var(--primary)",
  },
  gridMealName: {
    "--tw-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
  },
  gridMealTime: {
    fontSize: "var(--text-xs)",
    lineHeight: "var(--tw-leading,var(--text-xs--line-height))",
    "--tw-font-weight": "var(--font-weight-normal)",
    fontWeight: "var(--font-weight-normal)",
    color: "var(--muted-foreground)",
  },
  gridMealSections: {
    "--stack-space": "calc(var(--spacing) * 2)",
    fontSize: "var(--text-sm)",
    lineHeight: "var(--tw-leading,var(--text-sm--line-height))",
  },
  gridMealItems: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(1,minmax(0,1fr))",
      "@media (min-width:40rem)": "repeat(2,minmax(0,1fr))",
    },
    gap: "calc(var(--spacing) * 2)",
  },
  gridFallbackItem: {
    borderRadius: "calc(var(--radius) - 2px)",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    borderColor: {
      default: "var(--border)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--border) 30%, transparent)",
    },
    backgroundColor: {
      default: "var(--foreground)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--foreground) 5%, transparent)",
    },
    paddingInline: "calc(var(--spacing) * 2)",
    paddingBlock: "var(--spacing)",
  },
  gridNoItems: {
    paddingBlock: "calc(var(--spacing) * 2)",
    fontSize: "var(--text-xs)",
    lineHeight: "var(--tw-leading,var(--text-xs--line-height))",
    color: "var(--muted-foreground)",
    fontStyle: "italic",
  },
  mealRowIcon: {
    height: "calc(var(--spacing) * 4)",
    width: "calc(var(--spacing) * 4)",
    color: "var(--primary)",
  },
  gridToneSpecialVeg: {
    borderRadius: "calc(var(--radius) - 2px)",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    borderColor: {
      default: "var(--color-emerald-200)",
      [stylex.when.ancestor(":is(.dark)")]: "#00d2944d",
      "@supports (color:color-mix(in lab, red, red))": {
        default: null,
        [stylex.when.ancestor(":is(.dark)")]:
          "color-mix(in oklab, var(--color-emerald-400) 30%, transparent)",
      },
    },
    backgroundColor: {
      default: "var(--color-emerald-100)",
      [stylex.when.ancestor(":is(.dark)")]: "#00bb7f1a",
      "@supports (color:color-mix(in lab, red, red))": {
        default: null,
        [stylex.when.ancestor(":is(.dark)")]:
          "color-mix(in oklab, var(--color-emerald-500) 10%, transparent)",
      },
    },
    paddingInline: "calc(var(--spacing) * 2)",
    paddingBlock: "var(--spacing)",
    color: {
      default: "var(--color-emerald-900)",
      [stylex.when.ancestor(":is(.dark)")]: "var(--color-emerald-100)",
    },
  },
  gridToneVeg: {
    borderRadius: "calc(var(--radius) - 2px)",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    borderColor: {
      default: "var(--color-emerald-200)",
      [stylex.when.ancestor(":is(.dark)")]: "#00d2944d",
      "@supports (color:color-mix(in lab, red, red))": {
        default: null,
        [stylex.when.ancestor(":is(.dark)")]:
          "color-mix(in oklab, var(--color-emerald-400) 30%, transparent)",
      },
    },
    backgroundColor: {
      default: "var(--color-emerald-100)",
      [stylex.when.ancestor(":is(.dark)")]: "#00bb7f1a",
      "@supports (color:color-mix(in lab, red, red))": {
        default: null,
        [stylex.when.ancestor(":is(.dark)")]:
          "color-mix(in oklab, var(--color-emerald-500) 10%, transparent)",
      },
    },
    paddingInline: "calc(var(--spacing) * 2)",
    paddingBlock: "var(--spacing)",
    color: {
      default: "var(--color-emerald-900)",
      [stylex.when.ancestor(":is(.dark)")]: "var(--color-emerald-100)",
    },
  },
  gridToneVegSides: {
    borderRadius: "calc(var(--radius) - 2px)",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    borderColor: {
      default: "var(--border)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--border) 30%, transparent)",
    },
    backgroundColor: {
      default: "var(--foreground)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--foreground) 5%, transparent)",
    },
    paddingInline: "calc(var(--spacing) * 2)",
    paddingBlock: "var(--spacing)",
    color: "var(--foreground)",
  },
  gridToneNonVeg: {
    borderRadius: "calc(var(--radius) - 2px)",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    borderColor: {
      default: "var(--color-rose-200)",
      [stylex.when.ancestor(":is(.dark)")]: "#ff667f4d",
      "@supports (color:color-mix(in lab, red, red))": {
        default: null,
        [stylex.when.ancestor(":is(.dark)")]:
          "color-mix(in oklab, var(--color-rose-400) 30%, transparent)",
      },
    },
    backgroundColor: {
      default: "var(--color-rose-100)",
      [stylex.when.ancestor(":is(.dark)")]: "#ff23571a",
      "@supports (color:color-mix(in lab, red, red))": {
        default: null,
        [stylex.when.ancestor(":is(.dark)")]:
          "color-mix(in oklab, var(--color-rose-500) 10%, transparent)",
      },
    },
    paddingInline: "calc(var(--spacing) * 2)",
    paddingBlock: "var(--spacing)",
    color: {
      default: "var(--color-rose-900)",
      [stylex.when.ancestor(":is(.dark)")]: "var(--color-rose-100)",
    },
  },
  gridToneNote: {
    borderRadius: "calc(var(--radius) - 2px)",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    borderColor: {
      default: "var(--muted-foreground)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--muted-foreground) 20%, transparent)",
    },
    backgroundColor: {
      default: "var(--muted)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--muted) 40%, transparent)",
    },
    paddingInline: "calc(var(--spacing) * 2)",
    paddingBlock: "var(--spacing)",
    color: "var(--muted-foreground)",
  },
  selectValue: {
    "--tw-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
  },
  selectWrapper: {
    position: "relative",
    display: "inline-block",
  },
  selectEnabled: {
    borderRadius: ".25rem",
    paddingInline: "calc(var(--spacing) * 1.5)",
    paddingBlock: "var(--spacing)",
    fontSize: {
      default: "var(--text-base)",
      "@media (min-width:40rem)": "var(--text-lg)",
    },
    lineHeight: {
      default: "var(--tw-leading,var(--text-base--line-height))",
      "@media (min-width:40rem)": "var(--tw-leading,var(--text-lg--line-height))",
    },
    "--tw-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: {
      default: "var(--foreground)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--foreground) 90%, transparent)",
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--foreground)",
      },
    },
    textDecorationLine: "underline",
    textDecorationStyle: "dotted",
    textUnderlineOffset: "4px",
    "--tw-ring-shadow": {
      default: null,
      ":focus":
        "var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor)",
    },
    boxShadow: {
      default: null,
      ":focus":
        "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
    },
    "--tw-ring-color": {
      default: null,
      ":focus": "var(--ring)",
    },
    "--tw-outline-style": {
      default: null,
      ":focus": "none",
    },
    outlineStyle: {
      default: null,
      ":focus": "none",
    },
  },
  selectDisabled: {
    cursor: "not-allowed",
    borderRadius: ".25rem",
    paddingInline: "calc(var(--spacing) * 1.5)",
    paddingBlock: "var(--spacing)",
    fontSize: {
      default: "var(--text-base)",
      "@media (min-width:40rem)": "var(--text-lg)",
    },
    lineHeight: {
      default: "var(--tw-leading,var(--text-base--line-height))",
      "@media (min-width:40rem)": "var(--tw-leading,var(--text-lg--line-height))",
    },
    "--tw-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: {
      default: "var(--foreground)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--foreground) 90%, transparent)",
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--foreground)",
        "@supports (color:color-mix(in lab, red, red))": {
          default: null,
          ":hover": "color-mix(in oklab, var(--foreground) 90%, transparent)",
        },
      },
    },
    textDecorationLine: "underline",
    textDecorationStyle: "dotted",
    textUnderlineOffset: "4px",
    opacity: ".5",
    "--tw-ring-shadow": {
      default: null,
      ":focus":
        "var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor)",
    },
    boxShadow: {
      default: null,
      ":focus":
        "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
    },
    "--tw-ring-color": {
      default: null,
      ":focus": "var(--ring)",
    },
    "--tw-outline-style": {
      default: null,
      ":focus": "none",
    },
    outlineStyle: {
      default: null,
      ":focus": "none",
    },
  },
  selectMenu: {
    position: "absolute",
    zIndex: "50",
    marginTop: "calc(var(--spacing) * 2)",
    minWidth: "220px",
    borderRadius: "var(--radius)",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    backgroundColor: "var(--popover)",
    padding: "var(--spacing)",
    "--tw-shadow":
      "0 10px 15px -3px var(--tw-shadow-color,#0000001a), 0 4px 6px -4px var(--tw-shadow-color,#0000001a)",
    boxShadow:
      "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
  },
  selectSelected: {
    display: "block",
    width: "100%",
    borderRadius: "calc(var(--radius) - 2px)",
    backgroundColor: "var(--muted)",
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 2)",
    textAlign: "left",
    fontSize: "var(--text-base)",
    lineHeight: "var(--tw-leading,var(--text-base--line-height))",
  },
  selectOption: {
    display: "block",
    width: "100%",
    borderRadius: "calc(var(--radius) - 2px)",
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 2)",
    textAlign: "left",
    fontSize: "var(--text-base)",
    lineHeight: "var(--tw-leading,var(--text-base--line-height))",
    backgroundColor: {
      default: null,
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--muted)",
      },
    },
  },
  mealTitle: {
    "--tw-leading": null,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "calc(var(--spacing) * 4)",
    fontSize: "var(--text-xl)",
    lineHeight: "var(--tw-leading,var(--text-xl--line-height))",
  },
  mealLabel: {
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
  },
  mealBadge: {
    display: "inline-flex",
    height: "calc(var(--spacing) * 9)",
    width: "calc(var(--spacing) * 9)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "3.40282e38px",
    backgroundColor: {
      default: "var(--primary)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--primary) 20%, transparent)",
    },
  },
  mealIcon: {
    height: "calc(var(--spacing) * 5)",
    width: "calc(var(--spacing) * 5)",
    color: "var(--primary)",
  },
  mealTime: {
    fontSize: "var(--text-base)",
    lineHeight: "var(--tw-leading,var(--text-base--line-height))",
    "--tw-font-weight": "var(--font-weight-normal)",
    fontWeight: "var(--font-weight-normal)",
    color: "var(--muted-foreground)",
  },
  mealItems: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(1,minmax(0,1fr))",
      "@media (min-width:40rem)": "repeat(2,minmax(0,1fr))",
    },
    gap: "calc(var(--spacing) * 2)",
    fontSize: "var(--text-base)",
    lineHeight: "var(--leading-relaxed)",
    "--tw-leading": "var(--leading-relaxed)",
  },
  mealItemText: {
    "--tw-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
  },
  mealEmpty: {
    fontSize: "var(--text-base)",
    lineHeight: "var(--tw-leading,var(--text-base--line-height))",
    color: "var(--muted-foreground)",
    fontStyle: "italic",
  },
  mealHighlightFrame: {
    borderRadius: "var(--radius-2xl)",
    padding: "6px",
  },
  mealToneSpecialVeg: {
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 3)",
    borderRadius: "var(--radius)",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    borderColor: {
      default: "var(--color-emerald-200)",
      [stylex.when.ancestor(":is(.dark)")]: "#00d2944d",
      "@supports (color:color-mix(in lab, red, red))": {
        default: null,
        [stylex.when.ancestor(":is(.dark)")]:
          "color-mix(in oklab, var(--color-emerald-400) 30%, transparent)",
      },
    },
    backgroundColor: {
      default: "var(--color-emerald-100)",
      [stylex.when.ancestor(":is(.dark)")]: "#00bb7f1a",
      "@supports (color:color-mix(in lab, red, red))": {
        default: null,
        [stylex.when.ancestor(":is(.dark)")]:
          "color-mix(in oklab, var(--color-emerald-500) 10%, transparent)",
      },
    },
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 2)",
    color: {
      default: "var(--color-emerald-900)",
      [stylex.when.ancestor(":is(.dark)")]: "var(--color-emerald-100)",
    },
    "--tw-backdrop-blur": "blur(var(--blur-sm))",
    WebkitBackdropFilter:
      "var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)",
    backdropFilter:
      "var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)",
  },
  mealToneVeg: {
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 3)",
    borderRadius: "var(--radius)",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    borderColor: {
      default: "var(--color-emerald-200)",
      [stylex.when.ancestor(":is(.dark)")]: "#00d2944d",
      "@supports (color:color-mix(in lab, red, red))": {
        default: null,
        [stylex.when.ancestor(":is(.dark)")]:
          "color-mix(in oklab, var(--color-emerald-400) 30%, transparent)",
      },
    },
    backgroundColor: {
      default: "var(--color-emerald-100)",
      [stylex.when.ancestor(":is(.dark)")]: "#00bb7f1a",
      "@supports (color:color-mix(in lab, red, red))": {
        default: null,
        [stylex.when.ancestor(":is(.dark)")]:
          "color-mix(in oklab, var(--color-emerald-500) 10%, transparent)",
      },
    },
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 2)",
    color: {
      default: "var(--color-emerald-900)",
      [stylex.when.ancestor(":is(.dark)")]: "var(--color-emerald-100)",
    },
    "--tw-backdrop-blur": "blur(var(--blur-sm))",
    WebkitBackdropFilter:
      "var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)",
    backdropFilter:
      "var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)",
  },
  mealToneVegSides: {
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 3)",
    borderRadius: "var(--radius)",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    borderColor: {
      default: "var(--foreground)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--foreground) 10%, transparent)",
    },
    backgroundColor: {
      default: "var(--foreground)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--foreground) 5%, transparent)",
    },
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 2)",
    color: "var(--foreground)",
    "--tw-backdrop-blur": "blur(var(--blur-sm))",
    WebkitBackdropFilter:
      "var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)",
    backdropFilter:
      "var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)",
  },
  mealToneNonVeg: {
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 3)",
    borderRadius: "var(--radius)",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    borderColor: {
      default: "var(--color-rose-200)",
      [stylex.when.ancestor(":is(.dark)")]: "#ff667f4d",
      "@supports (color:color-mix(in lab, red, red))": {
        default: null,
        [stylex.when.ancestor(":is(.dark)")]:
          "color-mix(in oklab, var(--color-rose-400) 30%, transparent)",
      },
    },
    backgroundColor: {
      default: "var(--color-rose-100)",
      [stylex.when.ancestor(":is(.dark)")]: "#ff23571a",
      "@supports (color:color-mix(in lab, red, red))": {
        default: null,
        [stylex.when.ancestor(":is(.dark)")]:
          "color-mix(in oklab, var(--color-rose-500) 10%, transparent)",
      },
    },
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 2)",
    color: {
      default: "var(--color-rose-900)",
      [stylex.when.ancestor(":is(.dark)")]: "var(--color-rose-100)",
    },
    "--tw-backdrop-blur": "blur(var(--blur-sm))",
    WebkitBackdropFilter:
      "var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)",
    backdropFilter:
      "var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)",
  },
  mealToneNote: {
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 3)",
    borderRadius: "var(--radius)",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    borderColor: {
      default: "var(--muted-foreground)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--muted-foreground) 20%, transparent)",
    },
    backgroundColor: {
      default: "var(--muted)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--muted) 40%, transparent)",
    },
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 2)",
    color: "var(--muted-foreground)",
    "--tw-backdrop-blur": "blur(var(--blur-sm))",
    WebkitBackdropFilter:
      "var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)",
    backdropFilter:
      "var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)",
  },
  mealIconSpecialVeg: {
    height: "calc(var(--spacing) * 4)",
    width: "calc(var(--spacing) * 4)",
    color: {
      default: "var(--color-emerald-700)",
      [stylex.when.ancestor(":is(.dark)")]: "var(--color-emerald-300)",
    },
  },
  mealIconVeg: {
    height: "calc(var(--spacing) * 4)",
    width: "calc(var(--spacing) * 4)",
    color: {
      default: "var(--color-emerald-700)",
      [stylex.when.ancestor(":is(.dark)")]: "var(--color-emerald-300)",
    },
  },
  mealIconNonVeg: {
    height: "calc(var(--spacing) * 4)",
    width: "calc(var(--spacing) * 4)",
    color: {
      default: "var(--color-rose-700)",
      [stylex.when.ancestor(":is(.dark)")]: "var(--color-rose-300)",
    },
  },
  mealCard: {
    transitionProperty: "transform,translate,scale,rotate",
    transitionTimingFunction: "var(--tw-ease,var(--default-transition-timing-function))",
    transitionDuration: "var(--tw-duration,var(--default-transition-duration))",
  },
  mealCardHighlight: {
    borderColor: "var(--primary)",
    "--tw-ring-shadow":
      "var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor)",
    boxShadow:
      "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
    "--tw-ring-color": {
      default: "var(--primary)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--primary) 30%, transparent)",
    },
    transitionProperty: "transform,translate,scale,rotate",
    transitionTimingFunction: "var(--tw-ease,var(--default-transition-timing-function))",
    transitionDuration: "var(--tw-duration,var(--default-transition-duration))",
  },
  carousel: {
    position: "relative",
    overflow: "visible",
  },
  carouselControls: {
    pointerEvents: "none",
    position: "absolute",
    insetBlock: "0",
    right: "0",
    left: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingInline: {
      default: "var(--spacing)",
      "@media (min-width:40rem)": "calc(var(--spacing) * 4)",
    },
  },
  carouselPrevious: {
    pointerEvents: "auto",
    display: "inline-flex",
    height: {
      default: "calc(var(--spacing) * 10)",
      "@media (min-width:40rem)": "calc(var(--spacing) * 12)",
    },
    width: {
      default: "calc(var(--spacing) * 10)",
      "@media (min-width:40rem)": "calc(var(--spacing) * 12)",
    },
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "3.40282e38px",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "2px",
    borderColor: {
      default: "var(--primary)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--primary) 20%, transparent)",
    },
    backgroundColor: {
      default: "var(--background)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--background) 95%, transparent)",
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--primary)",
      },
    },
    "--tw-shadow":
      "0 10px 15px -3px var(--tw-shadow-color,#0000001a), 0 4px 6px -4px var(--tw-shadow-color,#0000001a)",
    boxShadow:
      "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
    "--tw-backdrop-blur": "blur(8px)",
    WebkitBackdropFilter:
      "var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)",
    backdropFilter:
      "var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)",
    transitionProperty: "all",
    transitionTimingFunction: "var(--tw-ease,var(--default-transition-timing-function))",
    transitionDuration: ".2s",
    "--tw-duration": ".2s",
    "--tw-scale-x": {
      default: null,
      "@media (hover:hover)": {
        default: null,
        ":hover": "105%",
        ":disabled:hover": "100%",
      },
    },
    "--tw-scale-y": {
      default: null,
      "@media (hover:hover)": {
        default: null,
        ":hover": "105%",
        ":disabled:hover": "100%",
      },
    },
    "--tw-scale-z": {
      default: null,
      "@media (hover:hover)": {
        default: null,
        ":hover": "105%",
        ":disabled:hover": "100%",
      },
    },
    scale: {
      default: null,
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--tw-scale-x) var(--tw-scale-y)",
        ":disabled:hover": "var(--tw-scale-x) var(--tw-scale-y)",
      },
    },
    color: {
      default: null,
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--primary-foreground)",
      },
    },
    opacity: {
      default: null,
      ":disabled": ".3",
    },
  },
  carouselPreviousIcon: {
    height: {
      default: "calc(var(--spacing) * 5)",
      "@media (min-width:40rem)": "calc(var(--spacing) * 6)",
    },
    width: {
      default: "calc(var(--spacing) * 5)",
      "@media (min-width:40rem)": "calc(var(--spacing) * 6)",
    },
  },
  carouselNext: {
    pointerEvents: "auto",
    display: "inline-flex",
    height: {
      default: "calc(var(--spacing) * 10)",
      "@media (min-width:40rem)": "calc(var(--spacing) * 12)",
    },
    width: {
      default: "calc(var(--spacing) * 10)",
      "@media (min-width:40rem)": "calc(var(--spacing) * 12)",
    },
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "3.40282e38px",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "2px",
    borderColor: {
      default: "var(--primary)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--primary) 20%, transparent)",
    },
    backgroundColor: {
      default: "var(--background)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--background) 95%, transparent)",
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--primary)",
      },
    },
    "--tw-shadow":
      "0 10px 15px -3px var(--tw-shadow-color,#0000001a), 0 4px 6px -4px var(--tw-shadow-color,#0000001a)",
    boxShadow:
      "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
    "--tw-backdrop-blur": "blur(8px)",
    WebkitBackdropFilter:
      "var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)",
    backdropFilter:
      "var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)",
    transitionProperty: "all",
    transitionTimingFunction: "var(--tw-ease,var(--default-transition-timing-function))",
    transitionDuration: ".2s",
    "--tw-duration": ".2s",
    "--tw-scale-x": {
      default: null,
      "@media (hover:hover)": {
        default: null,
        ":hover": "105%",
        ":disabled:hover": "100%",
      },
    },
    "--tw-scale-y": {
      default: null,
      "@media (hover:hover)": {
        default: null,
        ":hover": "105%",
        ":disabled:hover": "100%",
      },
    },
    "--tw-scale-z": {
      default: null,
      "@media (hover:hover)": {
        default: null,
        ":hover": "105%",
        ":disabled:hover": "100%",
      },
    },
    scale: {
      default: null,
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--tw-scale-x) var(--tw-scale-y)",
        ":disabled:hover": "var(--tw-scale-x) var(--tw-scale-y)",
      },
    },
    color: {
      default: null,
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--primary-foreground)",
      },
    },
    opacity: {
      default: null,
      ":disabled": ".3",
    },
  },
  carouselNextIcon: {
    height: {
      default: "calc(var(--spacing) * 5)",
      "@media (min-width:40rem)": "calc(var(--spacing) * 6)",
    },
    width: {
      default: "calc(var(--spacing) * 5)",
      "@media (min-width:40rem)": "calc(var(--spacing) * 6)",
    },
  },
  carouselTrack: {
    display: "flex",
    scrollSnapType: "x var(--tw-scroll-snap-strictness)",
    "--tw-scroll-snap-strictness": "mandatory",
    gap: "calc(var(--spacing) * 4)",
    overflow: "visible",
    overflowX: "auto",
    paddingInline: {
      default: "calc(var(--spacing) * 3)",
      "@media (min-width:40rem)": "0",
    },
    paddingBlock: "calc(var(--spacing) * 2)",
  },
  carouselActive: {
    minWidth: {
      default: "92%",
      "@media (width >= 40rem) and (width < 48rem)": "55%",
      "@media (width >= 48rem) and (width < 64rem)": "48%",
      "@media (min-width:64rem)": "36%",
    },
    "--tw-scale-x": "100%",
    "--tw-scale-y": "100%",
    "--tw-scale-z": "100%",
    scale: "var(--tw-scale-x) var(--tw-scale-y)",
    scrollSnapAlign: "center",
    overflow: "visible",
    paddingInline: "var(--spacing)",
    opacity: "1",
    transitionProperty:
      "color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,content-visibility,overlay,pointer-events",
    transitionTimingFunction: "var(--tw-ease,var(--default-transition-timing-function))",
    transitionDuration: "var(--tw-duration,var(--default-transition-duration))",
  },
  carouselInactive: {
    minWidth: {
      default: "92%",
      "@media (width >= 40rem) and (width < 48rem)": "55%",
      "@media (width >= 48rem) and (width < 64rem)": "48%",
      "@media (min-width:64rem)": "36%",
    },
    scale: ".98",
    scrollSnapAlign: "center",
    overflow: "visible",
    paddingInline: "var(--spacing)",
    opacity: ".6",
    transitionProperty:
      "color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,content-visibility,overlay,pointer-events",
    transitionTimingFunction: "var(--tw-ease,var(--default-transition-timing-function))",
    transitionDuration: "var(--tw-duration,var(--default-transition-duration))",
  },
  viewer: {
    "--stack-space": "calc(var(--spacing) * 4)",
  },
  viewerHeader: {
    marginBottom: "calc(var(--spacing) * 4)",
  },
  viewerTitle: {
    fontSize: {
      default: "var(--text-3xl)",
      "@media (min-width:40rem)": "var(--text-4xl)",
    },
    lineHeight: {
      default: "var(--tw-leading,var(--text-3xl--line-height))",
      "@media (min-width:40rem)": "var(--tw-leading,var(--text-4xl--line-height))",
    },
    "--tw-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    "--tw-tracking": "var(--tracking-tight)",
    letterSpacing: "var(--tracking-tight)",
  },
  viewerDescription: {
    marginTop: "calc(var(--spacing) * 2)",
    fontSize: "var(--text-lg)",
    lineHeight: "var(--tw-leading,var(--text-lg--line-height))",
    color: "var(--muted-foreground)",
  },
  viewerNote: {
    marginTop: "var(--spacing)",
    fontSize: "var(--text-sm)",
    lineHeight: "var(--tw-leading,var(--text-sm--line-height))",
    color: {
      default: "var(--muted-foreground)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--muted-foreground) 70%, transparent)",
    },
    fontStyle: "italic",
  },
  viewerControls: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "calc(var(--spacing) * 4)",
    fontSize: "var(--text-base)",
    lineHeight: "var(--tw-leading,var(--text-base--line-height))",
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingBlock: "calc(var(--spacing) * 4)",
  },
  loadingSpinner: {
    height: "calc(var(--spacing) * 6)",
    width: "calc(var(--spacing) * 6)",
    animation: "var(--animate-spin)",
    borderRadius: "3.40282e38px",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "2px",
    borderColor: "var(--primary)",
    borderTopColor: "#0000",
  },
  loadingText: {
    marginLeft: "calc(var(--spacing) * 2)",
    fontSize: "var(--text-sm)",
    lineHeight: "var(--tw-leading,var(--text-sm--line-height))",
    color: "var(--muted-foreground)",
  },
  extras: {
    borderRadius: "calc(var(--radius) + 4px)",
    borderStyle: "dashed",
    borderWidth: "1px",
    "--tw-border-style": "dashed",
    borderColor: {
      default: "var(--muted-foreground)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--muted-foreground) 40%, transparent)",
    },
    backgroundColor: {
      default: "var(--muted)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--muted) 30%, transparent)",
    },
    paddingInline: {
      default: "calc(var(--spacing) * 4)",
      "@media (min-width:40rem)": "calc(var(--spacing) * 5)",
    },
    paddingBlock: "calc(var(--spacing) * 3)",
  },
  extrasTitle: {
    fontSize: {
      default: "var(--text-base)",
      "@media (min-width:40rem)": "var(--text-lg)",
    },
    lineHeight: {
      default: "var(--tw-leading,var(--text-base--line-height))",
      "@media (min-width:40rem)": "var(--tw-leading,var(--text-lg--line-height))",
    },
    "--tw-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--muted-foreground)",
  },
  extrasDescription: {
    marginTop: "var(--spacing)",
    fontSize: {
      default: "var(--text-xs)",
      "@media (min-width:40rem)": "var(--text-sm)",
    },
    lineHeight: {
      default: "var(--tw-leading,var(--text-xs--line-height))",
      "@media (min-width:40rem)": "var(--tw-leading,var(--text-sm--line-height))",
    },
    color: {
      default: "var(--muted-foreground)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--muted-foreground) 80%, transparent)",
    },
  },
  extrasGrid: {
    marginTop: "calc(var(--spacing) * 3)",
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(1,minmax(0,1fr))",
      "@media (min-width:40rem)": "repeat(2,minmax(0,1fr))",
    },
    gap: "calc(var(--spacing) * 2)",
  },
  extra: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "var(--radius)",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    borderColor: {
      default: "var(--border)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--border) 40%, transparent)",
    },
    backgroundColor: {
      default: "var(--card)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--card) 80%, transparent)",
    },
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 2)",
    fontSize: "var(--text-sm)",
    lineHeight: "var(--tw-leading,var(--text-sm--line-height))",
  },
  extraName: {
    "--tw-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: {
      default: "var(--foreground)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--foreground) 90%, transparent)",
    },
  },
  extraPrice: {
    "--tw-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--primary)",
  },
  viewerActions: {
    marginTop: "calc(var(--spacing) * 6)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
  },
  fullWeekIcon: {
    marginRight: "calc(var(--spacing) * 2)",
    height: "calc(var(--spacing) * 4)",
    width: "calc(var(--spacing) * 4)",
  },
  themePlaceholderIcon: {
    height: "1.2rem",
    width: "1.2rem",
  },
  themePlaceholderLabel: {
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
    borderWidth: "0",
    width: "1px",
    height: "1px",
    margin: "-1px",
    padding: "0",
    position: "absolute",
    overflow: "hidden",
  },
  themeSun: {
    height: "1.2rem",
    width: "1.2rem",
  },
  themeMoon: {
    height: "1.2rem",
    width: "1.2rem",
  },
  themeSystem: {
    height: "1.2rem",
    width: "1.2rem",
  },
  // Exact sr-only declarations; the theme label remains visually hidden.
  themeLabel: {
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
    borderWidth: "0",
    width: "1px",
    height: "1px",
    margin: "-1px",
    padding: "0",
    position: "absolute",
    overflow: "hidden",
  },
  weekSelector: {
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
  },
  weekSelectorLabel: {
    fontSize: "var(--text-sm)",
    lineHeight: "var(--tw-leading,var(--text-sm--line-height))",
    "--tw-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--foreground)",
  },
  weekSelectWrapper: {
    position: "relative",
  },
  weekSelect: {
    appearance: "none",
    borderRadius: "var(--radius)",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    borderColor: {
      default: "var(--input)",
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--input)",
        "@supports (color:color-mix(in lab, red, red))": {
          default: null,
          ":hover": "color-mix(in oklab, var(--input) 80%, transparent)",
        },
      },
    },
    backgroundColor: {
      default: "var(--background)",
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--accent)",
      },
    },
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 2)",
    paddingRight: "calc(var(--spacing) * 8)",
    fontSize: "var(--text-sm)",
    lineHeight: "var(--tw-leading,var(--text-sm--line-height))",
    "--tw-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: {
      default: "var(--foreground)",
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--accent-foreground)",
      },
    },
    "--tw-shadow":
      "0 1px 3px 0 var(--tw-shadow-color,#0000001a), 0 1px 2px -1px var(--tw-shadow-color,#0000001a)",
    boxShadow: {
      default:
        "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
      ":focus":
        "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
    },
    transitionProperty:
      "color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to",
    transitionTimingFunction: "var(--tw-ease,var(--default-transition-timing-function))",
    transitionDuration: "var(--tw-duration,var(--default-transition-duration))",
    "--tw-ring-shadow": {
      default: null,
      ":focus":
        "var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor)",
    },
    "--tw-ring-color": {
      default: null,
      ":focus": "var(--ring)",
    },
    "--tw-ring-offset-width": {
      default: null,
      ":focus": "2px",
    },
    "--tw-ring-offset-shadow": {
      default: null,
      ":focus":
        "var(--tw-ring-inset,) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)",
    },
    "--tw-outline-style": {
      default: null,
      ":focus": "none",
    },
    outlineStyle: {
      default: null,
      ":focus": "none",
    },
  },
  weekSelectChevron: {
    pointerEvents: "none",
    position: "absolute",
    top: "50%",
    right: "calc(var(--spacing) * 2)",
    height: "calc(var(--spacing) * 4)",
    width: "calc(var(--spacing) * 4)",
    "--tw-translate-y": "calc(calc(1 / 2 * 100%) * -1)",
    translate: "var(--tw-translate-x) var(--tw-translate-y)",
    color: "var(--muted-foreground)",
  },
  weekReset: {
    marginLeft: "calc(var(--spacing) * 2)",
    borderRadius: "calc(var(--radius) - 2px)",
    backgroundColor: {
      default: "var(--secondary)",
      "@supports (color:color-mix(in lab, red, red))":
        "color-mix(in oklab, var(--secondary) 50%, transparent)",
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--secondary)",
      },
    },
    paddingInline: "calc(var(--spacing) * 2)",
    paddingBlock: "var(--spacing)",
    fontSize: "var(--text-xs)",
    lineHeight: "var(--tw-leading,var(--text-xs--line-height))",
    "--tw-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--secondary-foreground)",
    transitionProperty:
      "color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to",
    transitionTimingFunction: "var(--tw-ease,var(--default-transition-timing-function))",
    transitionDuration: "var(--tw-duration,var(--default-transition-duration))",
  },
  weekStatus: {
    marginLeft: "calc(var(--spacing) * 2)",
    fontSize: "var(--text-xs)",
    lineHeight: "var(--tw-leading,var(--text-xs--line-height))",
    color: "var(--muted-foreground)",
  },
  Card: {
    borderRadius: "calc(var(--radius) + 4px)",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    backgroundColor: "var(--card)",
    color: "var(--card-foreground)",
  },
  CardHeader: {
    display: "flex",
    flexDirection: "column",
    "--stack-space": "calc(var(--spacing) * 1.5)",
    padding: "calc(var(--spacing) * 6)",
  },
  CardTitle: {
    fontSize: "var(--text-xl)",
    lineHeight: "1",
    "--tw-leading": "1",
    "--tw-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    "--tw-tracking": "var(--tracking-tight)",
    letterSpacing: "var(--tracking-tight)",
  },
  CardDescription: {
    fontSize: "var(--text-sm)",
    lineHeight: "var(--tw-leading,var(--text-sm--line-height))",
    color: "var(--muted-foreground)",
  },
  CardContent: {
    padding: "calc(var(--spacing) * 6)",
    paddingTop: "0",
  },
  CardFooter: {
    display: "flex",
    alignItems: "center",
    padding: "calc(var(--spacing) * 6)",
    paddingTop: "0",
  },
  buttonBase: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "calc(var(--radius) - 2px)",
    fontSize: "var(--text-sm)",
    lineHeight: "var(--tw-leading,var(--text-sm--line-height))",
    "--tw-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    whiteSpace: "nowrap",
    "--tw-ring-offset-color": "var(--background)",
    transitionProperty:
      "color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to",
    transitionTimingFunction: "var(--tw-ease,var(--default-transition-timing-function))",
    transitionDuration: "var(--tw-duration,var(--default-transition-duration))",
    "--tw-ring-shadow": {
      default: null,
      ":focus-visible":
        "var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor)",
    },
    boxShadow: {
      default: null,
      ":focus-visible":
        "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
    },
    "--tw-ring-color": {
      default: null,
      ":focus-visible": "var(--ring)",
    },
    "--tw-ring-offset-width": {
      default: null,
      ":focus-visible": "2px",
    },
    "--tw-ring-offset-shadow": {
      default: null,
      ":focus-visible":
        "var(--tw-ring-inset,) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)",
    },
    "--tw-outline-style": {
      default: null,
      ":focus-visible": "none",
    },
    outlineStyle: {
      default: null,
      ":focus-visible": "none",
    },
    pointerEvents: {
      default: null,
      ":disabled": "none",
    },
    opacity: {
      default: null,
      ":disabled": ".5",
    },
  },
  buttonVariant_default: {
    backgroundColor: {
      default: "var(--primary)",
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--primary)",
        "@supports (color:color-mix(in lab, red, red))": {
          default: null,
          ":hover": "color-mix(in oklab, var(--primary) 90%, transparent)",
        },
      },
    },
    color: "var(--primary-foreground)",
  },
  buttonVariant_destructive: {
    backgroundColor: {
      default: "var(--destructive)",
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--destructive)",
        "@supports (color:color-mix(in lab, red, red))": {
          default: null,
          ":hover": "color-mix(in oklab, var(--destructive) 90%, transparent)",
        },
      },
    },
  },
  buttonVariant_outline: {
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    borderColor: "var(--input)",
    backgroundColor: {
      default: "var(--background)",
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--accent)",
      },
    },
    color: {
      default: null,
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--accent-foreground)",
      },
    },
  },
  buttonVariant_secondary: {
    backgroundColor: {
      default: "var(--secondary)",
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--secondary)",
        "@supports (color:color-mix(in lab, red, red))": {
          default: null,
          ":hover": "color-mix(in oklab, var(--secondary) 80%, transparent)",
        },
      },
    },
    color: "var(--secondary-foreground)",
  },
  buttonVariant_ghost: {
    backgroundColor: {
      default: null,
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--accent)",
      },
    },
    color: {
      default: null,
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--accent-foreground)",
      },
    },
  },
  buttonVariant_link: {
    color: "var(--primary)",
    textUnderlineOffset: "4px",
    textDecorationLine: {
      default: null,
      "@media (hover:hover)": {
        default: null,
        ":hover": "underline",
      },
    },
  },
  buttonSize_default: {
    height: "calc(var(--spacing) * 10)",
    paddingInline: "calc(var(--spacing) * 4)",
    paddingBlock: "calc(var(--spacing) * 2)",
  },
  buttonSize_sm: {
    height: "calc(var(--spacing) * 9)",
    paddingInline: "calc(var(--spacing) * 3)",
  },
  buttonSize_lg: {
    height: "calc(var(--spacing) * 11)",
    paddingInline: "calc(var(--spacing) * 8)",
  },
  buttonSize_icon: {
    height: "calc(var(--spacing) * 10)",
    width: "calc(var(--spacing) * 10)",
  },
});
