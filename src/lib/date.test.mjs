import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDateKey, getISTNow, getTimeOfDayMinutes } from "./date.ts";
import { getWeekNumberFromDate } from "./menuManager.ts";
import { getWeekMenu } from "../data/weeks/index.ts";
import { buildWeekMenu } from "./menuFile.ts";
import menu1 from "../../public/menu1.json";
import menu2 from "../../public/menu2.json";

test("IST midnight and Monday roll over once for a real instant", () => {
  const sunday = new Date("2026-10-04T15:00:00Z");
  const monday = new Date("2026-10-04T18:30:00Z");
  assert.equal(formatDateKey(sunday), "2026-10-04");
  assert.equal(getTimeOfDayMinutes(sunday), 20 * 60 + 30);
  assert.equal(getWeekNumberFromDate(sunday), 52);
  assert.equal(formatDateKey(monday), "2026-10-05");
  assert.equal(getTimeOfDayMinutes(monday), 0);
  assert.equal(getWeekNumberFromDate(monday), 53);
  const before = Date.now();
  const current = getISTNow().getTime();
  assert.ok(current >= before && current <= Date.now());
});
test("selected full-week rotation loads its own menu", async () => {
  assert.deepEqual(await getWeekMenu("1"), buildWeekMenu(menu1, "menu1"));
  assert.deepEqual(await getWeekMenu("2"), buildWeekMenu(menu2, "menu2"));
  assert.notDeepEqual(await getWeekMenu("1"), await getWeekMenu("2"));
});
