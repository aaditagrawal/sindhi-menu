import * as stylex from "@stylexjs/stylex";
import { notFound } from "next/navigation";
import { loadMenuByName } from "@/data/weeks";
import { getMenuNameForWeek } from "@/lib/menuManager";
import { MenuViewer } from "@/components/MenuViewer";
import { sxc } from "@/lib/utils";

export const revalidate = 604800;

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
    maxWidth: "56rem",
    display: "flex",
    flexDirection: "column",
    rowGap: "1.5rem",
  },
});

/** Load the selected rotation menu into the daily viewer. */
export default async function WeekNumberPage({
  params,
}: {
  params: Promise<{ weekNumber: string }>;
}) {
  const { weekNumber } = await params;
  const weekNum = parseInt(weekNumber, 10);
  if (weekNum < 1 || weekNum > 4) return notFound();

  const menuName = getMenuNameForWeek(weekNum);
  const week = await loadMenuByName(menuName);

  return (
    <div {...sxc("scroll-optimized", styles.page)}>
      <div {...stylex.props(styles.inner)}>
        <MenuViewer initialWeek={week} initialMenuName={menuName} initialWeekOverride={weekNum} />
      </div>
    </div>
  );
}
