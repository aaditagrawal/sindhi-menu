import Link from "next/link";
import { getAllWeeks } from "@/data/weeks";

export default function WeeksPage() {
  const weeks = getAllWeeks();
  return (
    <div className="px-4 py-8 sm:px-6 md:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-semibold">Past & Upcoming Weeks</h1>
        <ul className="space-y-3">
          {weeks.map((id) => (
            <li key={id}>
              <Link href={`/week/${id}`} className="underline">{id}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


