import * as stylex from "@stylexjs/stylex";
import { getWeekMenu } from "@/data/weeks";
import { MenuViewer } from "@/components/MenuViewer";
import { sxc } from "@/lib/utils";

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

/** Load the current rotation menu for the daily viewer. */
export default async function Home() {
  const week = await getWeekMenu("current");
  return (
    <div {...sxc("scroll-optimized", styles.page)}>
      <div {...stylex.props(styles.inner)}>
        <MenuViewer initialWeek={week} />
      </div>
    </div>
  );
}
