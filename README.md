## Food Court Menus

Fast, friendly viewer for weekly mess/food-court menus with time-aware highlighting in Indian Standard Time (IST). The app now integrates with the Food Court API to automatically fetch and display the latest menu data.

## Contributions, Please

The app now uses an external API for data, so contributions focus on code improvements, UI enhancements, and feature development. Data is managed through the Food Court API at https://tikm.coolstuff.work/docs/reference.

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

## Project Structure
- `src/app/` — pages (home, weeks, per-week page) and API routes for week discovery
- `src/components/` — UI components (cards, carousel, inline selectors)
- `src/data/weeks/` — API client functions for fetching menu data
- `src/lib/` — types and IST/time utilities

---

## Future Work (Scope)
- Adding support for other messes
- User-defined local input for their own mess with a client-side OCR pipeline

---

## Deployment
Any Node-compatible host will work. Build with `bun run build` and serve with `bun run start`.

