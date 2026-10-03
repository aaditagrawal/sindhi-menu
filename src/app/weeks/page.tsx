import * as stylex from "@stylexjs/stylex";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Grid3X3, Calendar } from "lucide-react";

const styles = stylex.create({
  page: {
    paddingInline: {
      default: "1rem",
      "@media (min-width: 640px)": "1.5rem",
      "@media (min-width: 768px)": "2rem",
    },
    paddingBlock: "2rem",
  },
  inner: {
    marginInline: "auto",
    maxWidth: "48rem",
    display: "flex",
    flexDirection: "column",
    rowGap: "1.5rem",
  },
  heading: {
    fontSize: "1.5rem",
    lineHeight: "calc(2 / 1.5)",
    fontWeight: 600,
    letterSpacing: "-0.02em",
  },
  description: {
    color: "var(--muted-foreground)",
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    rowGap: "0.75rem",
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: "0.75rem",
    paddingInline: "0.75rem",
    paddingBlock: "0.75rem",
    borderRadius: "var(--radius)",
    borderWidth: "1px",
    borderColor: "color-mix(in oklab, var(--border) 70%, transparent)",
    backgroundColor: "var(--card)",
  },
  weekLink: {
    textDecorationLine: "underline",
    textUnderlineOffset: "4px",
    fontWeight: 500,
  },
  actions: {
    display: "flex",
    columnGap: "0.5rem",
  },
  icon: {
    height: "0.75rem",
    width: "0.75rem",
    marginRight: "0.25rem",
  },
});

/** Link each rotation week to its daily and full-week views. */
export default function WeeksPage() {
  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.inner)}>
        <h1 {...stylex.props(styles.heading)}>4-Week Menu Rotation</h1>
        <p {...stylex.props(styles.description)}>
          Sindhi Mess follows a 4-week rotating menu cycle.
        </p>
        <ul {...stylex.props(styles.list)}>
          {[1, 2, 3, 4].map((weekNum) => (
            <li key={weekNum} {...stylex.props(styles.listItem)}>
              <div>
                <Link href={`/week/${weekNum}`} {...stylex.props(styles.weekLink)}>
                  Week {weekNum}
                </Link>
              </div>
              <div {...stylex.props(styles.actions)}>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/week/${weekNum}`} title="View daily menu">
                    <Calendar {...stylex.props(styles.icon)} />
                    Daily
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/week/${weekNum}/full`} title="View full week menu">
                    <Grid3X3 {...stylex.props(styles.icon)} />
                    Full
                  </Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
