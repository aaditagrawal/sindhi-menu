import { getLatestWeekId, getWeekMenu } from "@/data/weeks";
import { MenuViewer } from "@/components/MenuViewer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const weekId = getLatestWeekId();
  const week = await getWeekMenu(weekId);
  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 md:px-8">
      <header className="mx-auto max-w-4xl mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">{week.foodCourt}</h1>
        <p className="text-muted-foreground">{week.week}</p>
      </header>
      <main className="mx-auto max-w-4xl space-y-6">
        <MenuViewer initialWeekId={weekId} initialWeek={week} routingMode="home" />
      </main>
    </div>
  );
}
