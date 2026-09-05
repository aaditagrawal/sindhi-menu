import * as stylex from "@stylexjs/stylex";
import { styles } from "@/styles/site.stylex";
import { notFound } from "next/navigation";
import { getWeekMenu } from "@/data/weeks";
import { MenuViewer } from "@/components/MenuViewer";

export const revalidate = 604800;

export async function generateStaticParams() {
  return [{ weekNumber: "1" }, { weekNumber: "2" }, { weekNumber: "3" }, { weekNumber: "4" }];
}

export default async function WeekNumberPage({
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
    <div {...stylex.props(styles.rotationPage)}>
      <div {...stylex.props(styles.rotationContent)} data-stack="6">
        <MenuViewer initialWeek={week} initialWeekOverride={weekNum} />
      </div>
    </div>
  );
}
