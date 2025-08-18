## Food Court Menus

Fast, friendly viewer for weekly mess/food-court menus with time-aware highlighting in Indian Standard Time (IST). Drop weekly JSON files in `src/data/weeks/` and the site discovers them automatically.

### Highlights
- Time-aware: detects current/upcoming meal using device time converted to IST and auto-focuses it
- Minimal “playing card” UI with tasteful icons for Breakfast/Lunch/Snacks/Dinner
- Horizontal carousel: highlights the primary meal, dims the rest, auto-scrolls to the current one
- Inline navigation: click Year / Week / Day in-place to switch context
- Fully responsive for mobile, tablets, and laptops

### Tech
- Next.js (App Router), TypeScript
- Tailwind CSS v4
- shadcn-inspired components (Cards)
- lucide-react icons

---

## Getting Started

Prereqs: Node 18+ and Bun.

Development server:
```bash
bun run dev
```
Visit `http://localhost:3000`.

Production build & start:
```bash
bun run build
bun run start
```

Lint:
```bash
bun run lint
```

---

## Data: Adding Weekly Menus (Main Contribution)

The main way to contribute is to add a weekly JSON file. No code changes are required.

1) Create a file in `src/data/weeks/` named:
```
YYYY-MM-DD_to_YYYY-MM-DD.json
```

2) Use this shape (example):
```json
{
  "foodCourt": "Food Court 2",
  "week": "August 18 - August 24, 2025",
  "menu": {
    "2025-08-18": {
      "day": "Monday",
      "meals": {
        "breakfast": {
          "name": "Happy Morning Breakfast",
          "startTime": "07:00",
          "endTime": "09:30",
          "items": ["…"]
        },
        "lunch": { "name": "…", "startTime": "11:45", "endTime": "14:15", "items": ["…"] },
        "snacks": { "name": "…", "startTime": "16:30", "endTime": "18:00", "items": ["…"] },
        "dinner": { "name": "…", "startTime": "19:00", "endTime": "21:30", "items": ["…"] }
      }
    }
  }
}
```

Notes:
- Day keys inside `menu` are dates in `YYYY-MM-DD`.
- Times are `HH:mm` in IST.
- Meal keys supported: `breakfast`, `lunch`, `snacks`, `dinner`.

After saving the file, the site will list it automatically in the Year/Week selectors and in `/week/[id]`.

---

## Project Structure
- `src/app/` — pages (home, weeks, per-week page) and API routes for week discovery
- `src/components/` — UI components (cards, carousel, inline selectors)
- `src/data/weeks/` — weekly JSON files (auto-discovered)
- `src/lib/` — types and IST/time utilities

---

## Future Work (Scope)
- Adding support for other messes
- User-defined local input for their own mess with a client-side OCR pipeline

---

## Deployment
Any Node-compatible host will work. Build with `bun run build` and serve with `bun run start`.

