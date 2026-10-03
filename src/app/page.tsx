import * as stylex from "@stylexjs/stylex";
import { loadMenuByName } from "@/data/weeks";
import { MenuViewer } from "@/components/MenuViewer";
import { getMenuNameForDate } from "@/lib/menuManager";
import { getISTNow } from "@/lib/date";
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
  const menuName = getMenuNameForDate(getISTNow());
  const week = await loadMenuByName(menuName);
  return (
    <div {...sxc("scroll-optimized", styles.page)}>
      <div {...stylex.props(styles.inner)}>
        <MenuViewer initialWeek={week} initialMenuName={menuName} />
      </div>
    </div>
  );
}
