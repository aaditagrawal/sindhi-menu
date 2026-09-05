import * as stylex from "@stylexjs/stylex";
import { styles } from "@/styles/site.stylex";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Grid3X3, Calendar } from "lucide-react";

export default function WeeksPage() {
  return (
    <div {...stylex.props(styles.weeksPage)}>
      <div {...stylex.props(styles.weeksContent)} data-stack="6">
        <h1 {...stylex.props(styles.weeksHeading)}>4-Week Menu Rotation</h1>
        <p {...stylex.props(styles.weeksDescription)}>
          Sindhi Mess follows a 4-week rotating menu cycle.
        </p>
        <ul {...stylex.props(styles.weeksList)} data-stack="3">
          {[1, 2, 3, 4].map((weekNum) => (
            <li key={weekNum} {...stylex.props(styles.weekRow)}>
              <div>
                <Link href={`/week/${weekNum}`} {...stylex.props(styles.weekLink)}>
                  Week {weekNum}
                </Link>
              </div>
              <div {...stylex.props(styles.weekActions)}>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/week/${weekNum}`} title="View daily menu">
                    <Calendar {...stylex.props(styles.weekDailyIcon)} />
                    Daily
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/week/${weekNum}/full`} title="View full week menu">
                    <Grid3X3 {...stylex.props(styles.weekFullIcon)} />
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
