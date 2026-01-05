import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Grid3X3, Calendar } from "lucide-react";

export default function WeeksPage() {
  return (
    <div className="px-4 py-8 sm:px-6 md:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-semibold">4-Week Menu Rotation</h1>
        <p className="text-muted-foreground">Sindhi Mess follows a 4-week rotating menu cycle.</p>
        <ul className="space-y-3">
          {[1, 2, 3, 4].map((weekNum) => (
            <li key={weekNum} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <Link href={`/week/${weekNum}`} className="underline font-medium">Week {weekNum}</Link>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/week/${weekNum}`} title="View daily menu">
                    <Calendar className="h-3 w-3 mr-1" />
                    Daily
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/week/${weekNum}/full`} title="View full week menu">
                    <Grid3X3 className="h-3 w-3 mr-1" />
                    Full
                  </Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


