import { getLatestWeekId, getWeekMenu } from "@/data/weeks";
import { MenuViewer } from "@/components/MenuViewer";

export default async function Home() {
  // Use build-time data as fallback - MenuViewer will load current week on client side
  const weekId = await getLatestWeekId();
  const week = await getWeekMenu(weekId);
  return (
    <div className="px-4 py-8 sm:px-6 md:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <MenuViewer initialWeekId={weekId} initialWeek={week} />
      </div>
    </div>
  );
}
