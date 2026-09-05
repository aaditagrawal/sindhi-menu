import * as stylex from "@stylexjs/stylex";
import { styles } from "@/styles/site.stylex";
import { getWeekMenu } from "@/data/weeks";
import { MenuViewer } from "@/components/MenuViewer";

export default async function Home() {
  // Use build-time data as fallback - MenuViewer will load current week on client side
  const week = await getWeekMenu("current");
  return (
    <div {...stylex.props(styles.dailyPage)}>
      <div {...stylex.props(styles.dailyContent)} data-stack="6">
        <MenuViewer initialWeek={week} />
      </div>
    </div>
  );
}
