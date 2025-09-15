## Sindhi Menu

Fast, friendly viewer for Sindhi Mess weekly menu with time-aware highlighting in Indian Standard Time (IST). The app reads from a static JSON file bundled with the app.

## Contributions, Please

The app uses a static JSON file for data. Contributions focus on code improvements, UI enhancements, and refining the JSON data in public/sindhi-menu.json.

### Highlights
- Time-aware: detects current/upcoming meal using device time converted to IST and auto-focuses it
- Minimal “playing card” UI with tasteful icons for Lunch/Dinner
- Horizontal carousel: highlights the primary meal, dims the rest, auto-scrolls to the current one
- Inline navigation: choose Day; fixed weekly pattern
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

## Project Structure
- `src/app/` — pages (home, weeks, per-week page). API routes removed.
- `src/components/` — UI components (cards, carousel, inline selectors)
- `src/data/weeks/` — static loader that builds a synthetic week from public/sindhi-menu.json
- `src/lib/` — types and IST/time utilities

---

## Future Work (Scope)
- Adding support for other messes
- User-defined local input for their own mess with a client-side OCR pipeline

---

## Deployment
Any Node-compatible host will work. Build with `bun run build` and serve with `bun run start`.

