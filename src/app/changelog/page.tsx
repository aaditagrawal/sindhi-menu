import { promises as fs } from "fs";
import path from "path";
import { marked } from "marked";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-static";

export default async function ChangelogPage() {
  const markdown = await fs.readFile(
    path.join(process.cwd(), "changelog.md"),
    "utf8",
  );
  const html = marked(markdown);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 md:px-8">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>Changelog</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-zinc dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
