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
      "@media (min-width: 1280px)": "3rem",
    },
    paddingBlock: {
      default: "1.5rem",
      "@media (min-width: 768px)": "2.5rem",
      "@media (min-width: 1280px)": "3.5rem",
    },
  },
  inner: {
    marginInline: "auto",
    maxWidth: {
      default: "56rem",
      "@media (min-width: 1024px)": "64rem",
      "@media (min-width: 1440px)": "70rem",
    },
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
