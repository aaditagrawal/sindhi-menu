## Sindhi Menu

Sindhi Menu is a fast, friendly viewer for the Sindhi Mess weekly menu. It ships with a curated JSON snapshot of the mess banner and renders a week-at-a-glance experience that keeps track of the current time in Indian Standard Time (IST).

## Overview
- **Static-first data** – all meals are sourced from `public/sindhi-menu.json` and baked into the build.
- **Time aware** – detects the current or upcoming meal in IST and scrolls/highlights it automatically.
- **Responsive card UI** – swipeable carousel on smaller screens, transposed grid on large displays.
- **Accessible theming** – light and dark palettes with readable chips for special veg / non-veg sections and a manual theme toggle.

## Tech Stack
- Next.js App Router (SSG + ISR) with TypeScript
- Tailwind CSS v4 with CSS variables for themes
- `next-themes` for runtime theme switching
- shadcn-inspired UI primitives (Card, Button) and `lucide-react` icons

---

## Getting Started

**Requirements**
- Node.js 18+
- [Bun](https://bun.sh)

```bash
bun install
bun run dev
```

Visit http://localhost:3000. The current week is generated from the JSON file each time the server starts.

### Production build
```bash
bun run build
bun run start
```

### Linting
```bash
bun run lint
```

---

## Updating Menu Data
1. Edit `public/sindhi-menu.json` with the latest banner contents.
2. Keep each meal’s `specialVeg`, `veg`, and `nonVeg` entries as strings or arrays. Multi-item strings can be comma/newline/semicolon separated; the loader splits them automatically.
3. Run `bun run dev` locally and verify the Tuesday dinner (dinners often expose the splitting) plus light/dark themes.
4. Commit the JSON along with any related UI tweaks.

---

## Project Structure
- `src/app/` – Route handlers, layouts, and pages (home view and full-week view)
- `src/components/` – UI components such as the carousel, cards, selectors, notifications
- `src/data/weeks/` – Static week builder that transforms the JSON snapshot into typed menu objects
- `src/lib/` – Shared utilities (IST date helpers, exceptions filter, type definitions)
- `public/` – Static assets, including the menu JSON and icons

---

## Design Notes
- Cards flatten sections so veg and non-veg items can sit side-by-side while still conveying kind through iconography and color.
- Theme colors are defined once in `src/app/globals.css` with CSS variables, and the body picks up the appropriate color-scheme.
- Accessibility considerations include keeping section metadata through `aria-label`s even when headings are hidden.

---

## Future Ideas
- Add other messes or user-provided menus once reliable data sources exist.
- Allow personal annotations or alerts for favourite dishes.
- Automate JSON updates from banner photos via OCR.

---

## Deployment
Any Node-compatible host (Vercel, Fly.io, Render, etc.) will work. Build with `bun run build` and serve with `bun run start`. Because the data is static, no additional runtime configuration is required.
