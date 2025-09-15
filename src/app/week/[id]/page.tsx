import { notFound } from "next/navigation";
import { getAllWeeks, getWeekMenu } from "@/data/weeks";
import { MenuViewer } from "@/components/MenuViewer";

// Regenerate individual week pages every 7 days in background
export const revalidate = 604800; // 7 days

export async function generateStaticParams() {
  const all = await getAllWeeks();
  return all.map((id) => ({ id }));
}

export default async function WeekPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const weeks = await getAllWeeks();
  if (!weeks.includes(id)) return notFound();
  const week = await getWeekMenu(id);

  return (
    <div className="px-4 py-8 sm:px-6 md:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <MenuViewer initialWeekId={id} initialWeek={week} />
      </div>
    </div>
  );
}


