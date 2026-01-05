import { notFound } from "next/navigation";
import { getWeekMenu } from "@/data/weeks";
import { MenuViewer } from "@/components/MenuViewer";

export const revalidate = 604800;

export async function generateStaticParams() {
  return [
    { weekNumber: "1" },
    { weekNumber: "2" },
    { weekNumber: "3" },
    { weekNumber: "4" },
  ];
}

export default async function WeekNumberPage({ params }: { params: Promise<{ weekNumber: string }> }) {
  const { weekNumber } = await params;
  const weekNum = parseInt(weekNumber, 10);
  if (weekNum < 1 || weekNum > 4) return notFound();

  const weekId = `${weekNum}`;
  const week = await getWeekMenu(weekId);

  return (
    <div className="px-4 py-8 sm:px-6 md:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <MenuViewer initialWeek={week} initialWeekOverride={weekNum} />
      </div>
    </div>
  );
}
