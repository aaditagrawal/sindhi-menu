import { notFound } from "next/navigation";
import { getAllWeeks, getWeekMenu } from "@/data/weeks";
import { MenuViewer } from "@/components/MenuViewer";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return getAllWeeks().map((id) => ({ id }));
}

export default async function WeekPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const weeks = getAllWeeks();
  if (!weeks.includes(id)) return notFound();
  const week = await getWeekMenu(id);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 md:px-8">
      <header className="mx-auto max-w-4xl mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">{week.foodCourt}</h1>
        <p className="text-muted-foreground">{week.week}</p>
      </header>
      <main className="mx-auto max-w-4xl space-y-6">
        <MenuViewer initialWeekId={id} initialWeek={week} routingMode="week" />
      </main>
    </div>
  );
}


