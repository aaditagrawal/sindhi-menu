import * as stylex from "@stylexjs/stylex";
import { styles } from "@/styles/site.stylex";
import { notFound } from "next/navigation";
import { getWeekMenu } from "@/data/weeks";
import { ComprehensiveWeekView } from "@/components/ComprehensiveWeekView";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const revalidate = 604800;

export async function generateStaticParams() {
  return [{ weekNumber: "1" }, { weekNumber: "2" }, { weekNumber: "3" }, { weekNumber: "4" }];
}

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
    <div {...stylex.props(styles.fullPage)}>
      <div {...stylex.props(styles.fullContent)} data-stack="6">
        <div {...stylex.props(styles.fullHeader)} data-stack="2">
          <div {...stylex.props(styles.fullTitle)}>
            <div>
              <h1 {...stylex.props(styles.fullDescription)}>Full Week Menu</h1>
              <p {...stylex.props(styles.fullActions)}>
                Week {weekNum} • {week.foodCourt}
              </p>
            </div>
            <Button asChild variant="outline" {...stylex.props(styles.dailyIcon)}>
              <Link href={`/week/${weekNumber}`} title="Back to daily view">
                <ArrowLeft {...stylex.props(styles.homeIcon)} />
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
