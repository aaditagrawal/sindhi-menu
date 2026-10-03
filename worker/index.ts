import menu1 from "../public/menu1.json";
import menu2 from "../public/menu2.json";
import menu3 from "../public/menu3.json";
import menu4 from "../public/menu4.json";
import { buildWeekMenu, type MenuFile } from "../src/lib/menuFile";
import { getMenuNameForDate, type MenuName } from "../src/lib/menuManager";

type Env = { ASSETS: { fetch(request: Request): Promise<Response> } };
const menus = new Map<MenuName, MenuFile>([
  ["menu1", menu1],
  ["menu2", menu2],
  ["menu3", menu3],
  ["menu4", menu4],
]);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (new URL(request.url).pathname !== "/api/menu" || request.method !== "GET")
      return env.ASSETS.fetch(request);
    const now = new Date();
    const menuName = getMenuNameForDate(now);
    const week = buildWeekMenu(menus.get(menuName) ?? menu1, menuName, now);
    const keys = Object.keys(week.menu).sort();
    return Response.json(
      {
        id: `${keys[0]}_to_${keys[keys.length - 1]}`,
        generatedAt: now.toISOString(),
        source: `/${menuName}.json`,
        ...week,
        menu: Object.fromEntries(Object.values(week.menu).map((day) => [day.day, day])),
      },
      { headers: { "Access-Control-Allow-Origin": "*" } },
    );
  },
};
