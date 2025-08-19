export const dynamic = "force-static";

export default function ContributingPage() {
  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 md:px-8">
      <div className="mx-auto max-w-3xl prose prose-zinc dark:prose-invert">
        <h1>Contributing</h1>
        <p className="lead">
          Thanks for your interest in improving this menu viewer! Use this guide to add or update weekly menu data and to contribute code changes.
        </p>

        <nav>
          <ul>
            <li><a href="#json-schema">JSON schema</a></li>
            <li><a href="#adding-data">Adding data for other messes</a></li>
            <li><a href="#guidelines">Guidelines</a></li>
            <li><a href="#submitting-changes">Submitting changes</a></li>
          </ul>
        </nav>

        <h2 id="json-schema">JSON schema</h2>
        <p>
          Each week is one JSON file under <code>src/data/weeks</code>, named <code>YYYY-MM-DD_to_YYYY-MM-DD.json</code>.
          The app auto-discovers these files and the list of messes from the <code>foodCourt</code> value.
        </p>
        <pre>
          <code className="language-json">{`
{
  "foodCourt": "Food Court 2",
  "week": "August 18 - August 24, 2025",
  "menu": {
    "2025-08-18": {
      "day": "Monday",
      "meals": {
        "breakfast": { "name": "…", "startTime": "07:00", "endTime": "09:30", "items": ["…"] },
        "lunch":     { "name": "…", "startTime": "11:45", "endTime": "14:15", "items": ["…"] },
        "snacks":    { "name": "…", "startTime": "16:30", "endTime": "18:00", "items": ["…"] },
        "dinner":    { "name": "…", "startTime": "19:00", "endTime": "21:30", "items": ["…"] }
      }
    }
  }
}
          `}</code>
        </pre>

        <h3>Schema reference</h3>
        <ul>
          <li><strong>foodCourt</strong>: string — The mess name shown in the UI and used for filtering.</li>
          <li><strong>week</strong>: string — Human‑readable week range (e.g. <code>August 18 - August 24, 2025</code>).</li>
          <li><strong>menu</strong>: object — Keys are ISO dates (<code>YYYY-MM-DD</code>), values describe a day.</li>
          <li><strong>menu[date].day</strong>: string — Day label (e.g. <code>Monday</code>).</li>
          <li><strong>menu[date].meals</strong>: object — Optional keys: <code>breakfast</code>, <code>lunch</code>, <code>snacks</code>, <code>dinner</code>.</li>
          <li><strong>meal.name</strong>: string; <strong>meal.startTime</strong>/<strong>endTime</strong>: <code>HH:mm</code> IST; <strong>meal.items</strong>: string array.</li>
        </ul>

        <blockquote>
          <p><strong>Tip:</strong> Keep <code>foodCourt</code> names consistent across files to avoid duplicate entries in the selector.</p>
        </blockquote>

        <h2 id="adding-data">Adding data for other messes</h2>
        <ol>
          <li>Create a new file under <code>src/data/weeks</code> (e.g. <code>2025-09-01_to_2025-09-07.json</code>).</li>
          <li>Copy the structure above and set <code>foodCourt</code> to the exact mess name (e.g. <code>&quot;Food Court 1&quot;</code>, <code>&quot;Food Court 2&quot;</code>, <code>&quot;Annex Mess&quot;</code>).</li>
          <li>Fill the <code>week</code> range and each date in <code>menu</code> with the correct meals, times, and items.</li>
          <li>Save and commit. The app will automatically list the new week and expose the mess in the selector.</li>
        </ol>

        <h2 id="guidelines">Guidelines</h2>
        <ul>
          <li>Times are in IST using 24‑hour format <code>HH:mm</code>.</li>
          <li>Use ISO dates (<code>YYYY-MM-DD</code>) for <code>menu</code> keys.</li>
          <li>Only include meals that are actually served on that day.</li>
          <li>Prefer concise, consistent naming for dishes and messes.</li>
        </ul>

        <h2 id="submitting-changes">Submitting changes</h2>
        <p>
          Open a pull request with your JSON updates or UI improvements. See the repository README for local setup and contribution etiquette.
        </p>

        <h2 id="PS">PS</h2>
        <p>
          You can use any LLM (with vision) that you use - like Gemini, ChatGPT, Claude etc. - to convert the data into the JSON spec listed above.
        </p>
      </div>
    </div>
  );
}


