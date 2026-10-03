import * as stylex from "@stylexjs/stylex";
import { notFound } from "next/navigation";
import { getWeekMenu } from "@/data/weeks";
import { ComprehensiveWeekView } from "@/components/ComprehensiveWeekView";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export async function generateStaticParams() {
  return [{ weekNumber: "1" }, { weekNumber: "2" }, { weekNumber: "3" }, { weekNumber: "4" }];
}

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
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    rowGap: "1.5rem",
  },
  banner: {
    borderRadius: "var(--radius)",
    borderWidth: "1px",
    borderColor: "var(--border)",
    backgroundColor: "color-mix(in oklab, var(--muted) 30%, transparent)",
    paddingInline: "0.75rem",
    paddingBlock: "0.5rem",
  },
  bannerRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    rowGap: "0.5rem",
    columnGap: "0.75rem",
  },
  title: {
    fontSize: "1.25rem",
    lineHeight: "calc(1.75 / 1.25)",
    fontWeight: 600,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    color: "var(--muted-foreground)",
  },
  icon: {
    height: "1rem",
    width: "1rem",
    marginRight: "0.5rem",
  },
});

/** Load the selected rotation menu for the complete week layout. */
export default async function WeekNumberFullPage({
  params,
}: {
  params: Promise<{ weekNumber: string }>;
}) {
  const { weekNumber } = await params;
  const weekNum = parseInt(weekNumber, 10);
  if (weekNum < 1 || weekNum > 4) return notFound();

  const weekId = `${weekNum}`;
  const week = await getWeekMenu(weekId);

  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.inner)}>
        <div {...stylex.props(styles.banner)}>
          <div {...stylex.props(styles.bannerRow)}>
            <div>
              <h1 {...stylex.props(styles.title)}>Full Week Menu</h1>
              <p {...stylex.props(styles.subtitle)}>
                Week {weekNum} • {week.foodCourt}
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href={`/week/${weekNumber}`} title="Back to daily view">
                <ArrowLeft {...stylex.props(styles.icon)} />
                Daily View
              </Link>
            </Button>
          </div>
        </div>
        <ComprehensiveWeekView week={week} />
      </div>
    </div>
  );
}
