import { notFound } from "next/navigation";
import { getWeekMenu } from "@/data/weeks";
import { ComprehensiveWeekView } from "@/components/ComprehensiveWeekView";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const revalidate = 604800;

export async function generateStaticParams() {
  return [
    { weekNumber: "1" },
    { weekNumber: "2" },
    { weekNumber: "3" },
    { weekNumber: "4" },
  ];
}

export default async function WeekNumberFullPage({ params }: { params: Promise<{ weekNumber: string }> }) {
  const { weekNumber } = await params;
  const weekNum = parseInt(weekNumber, 10);
  if (weekNum < 1 || weekNum > 4) return notFound();

  const weekId = `${weekNum}`;
  const week = await getWeekMenu(weekId);

  return (
    <div className="px-4 py-8 sm:px-6 md:px-8">
      <div className="mx-auto max-w-full space-y-6">
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold">Full Week Menu</h1>
              <p className="text-muted-foreground">Week {weekNum} • {week.foodCourt}</p>
            </div>
            <Button asChild variant="outline" className="self-start sm:self-auto">
              <Link href={`/week/${weekNumber}`} title="Back to daily view">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Daily View
              </Link>
            </Button>
          </div>
        </div>
        <ComprehensiveWeekView week={week} />
      </div>
    </div>
  );
}
