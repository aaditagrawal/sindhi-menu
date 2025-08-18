## Contributing

Thanks for your interest in improving the Food Court Menus project! The primary contribution is adding/updating weekly menu JSON files. Code contributions are welcome too.

### Code of Conduct
Be kind and respectful. Assume positive intent. Keep discussions constructive and focused on solving problems.

---

## Quick Start (Dev)

Prereqs: Node 18+ and Bun.

```bash
bun install
bun run dev
```
Open http://localhost:3000.

Build & lint:
```bash
bun run build
bun run lint
```

---

## Adding Weekly Menus (Main Contribution)

1) Create a JSON file in `src/data/weeks/` named using:
```
YYYY-MM-DD_to_YYYY-MM-DD.json
```

2) Use this schema:
```jsonc
{
  "foodCourt": "Food Court 2",
  "week": "August 18 - August 24, 2025",
  "menu": {
    "YYYY-MM-DD": {
      "day": "Monday",
      "meals": {
        "breakfast": { "name": "…", "startTime": "07:00", "endTime": "09:30", "items": ["…"] },
        "lunch": { "name": "…", "startTime": "11:45", "endTime": "14:15", "items": ["…"] },
        "snacks": { "name": "…", "startTime": "16:30", "endTime": "18:00", "items": ["…"] },
        "dinner": { "name": "…", "startTime": "19:00", "endTime": "21:30", "items": ["…"] }
      }
    }
  }
}
```

Guidelines:
- Day keys inside `menu` must be dates: `YYYY-MM-DD`.
- Times are `HH:mm` in IST.
- Supported meal keys: `breakfast`, `lunch`, `snacks`, `dinner`.
- Keep arrays of items simple strings; avoid trailing commas.

The app auto-discovers weekly files; no code changes required.

---

## Project Conventions

Tech stack: Next.js (App Router), TypeScript, Tailwind v4, lucide-react.

- TypeScript: strict mode; avoid `any`. Prefer explicit types on exported APIs.
- React: client components only when interaction is needed. Keep hooks dependency arrays correct.
- Styling: Tailwind classes; keep UI minimalist and consistent.
- UX: prioritize “upcoming meal first” logic and responsiveness.

---

## Submitting Changes

1) Fork and create a feature branch.
2) Make your changes and ensure:
   - `bun run lint` passes
   - `bun run build` succeeds
3) Open a PR with a concise description and screenshots if UI changes.

Thank you for contributing!


