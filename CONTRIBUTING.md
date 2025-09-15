## Contributing

Thanks for your interest in improving Sindhi Menu! The project is intentionally lightweight: data comes from a static JSON file bundled in `public/sindhi-menu.json`, while the UI focuses on clarity and time awareness. Contributions typically fall into one of three buckets:

- Refining the menu JSON when the banner changes
- Improving UI/UX or accessibility
- Enhancing tooling, performance, or developer ergonomics

### Code of Conduct
Be kind and respectful. Assume positive intent, keep feedback actionable, and focus conversations on solving the problem at hand.

---

## Quick Start

**Prerequisites**
- Node.js 18+
- [Bun](https://bun.sh)

Install dependencies and run the dev server:

```bash
bun install
bun run dev
```

The app serves from http://localhost:3000. Each reload rebuilds the synthetic week from `public/sindhi-menu.json` using IST timers.

### Build & Lint
```bash
bun run build
bun run lint
```

Run these before opening a PR.

---

## Project Conventions

- **TypeScript** – strict mode enabled. Avoid `any`, prefer explicit return types for exported helpers.
- **React** – mark components with `"use client"` only when interactive. Keep hook dependency arrays exhaustive.
- **Styling** – Tailwind CSS with design tokens defined in `src/app/globals.css`. Light/dark palettes must maintain contrast (check chips for special veg/non-veg).
- **Data** – Menu data lives in `public/sindhi-menu.json`. Strings may contain comma/newline separated items which are split at runtime; keep wording consistent so splitting works predictably.
- **UX** – Preserve the time-aware highlighting. Verify both light and dark themes after UI changes.
- **Accessibility** – Keep ARIA labels when removing headings, ensure interactive elements have discernible text, and test keyboard navigation where applicable.

### Updating the Menu JSON
1. Edit `public/sindhi-menu.json` with the latest banner details.
2. Maintain the `specialVeg`, `veg`, and `nonVeg` keys. Arrays are preferred; single strings are allowed.
3. Run `bun run dev` and check that each meal renders all options (Tuesday dinner is a useful smoke test).
4. Include screenshots in the PR if the banner change noticeably affects layout.

---

## Submitting Changes

1. Create a feature branch.
2. Make updates and ensure `bun run lint` and `bun run build` pass locally.
3. Commit with clear messages. If UI changes are visible, attach before/after screenshots in the PR.
4. Open the PR with a concise summary, mentioning any follow-up work or testing gaps.

Thank you for helping keep Sindhi Menu accurate and delightful!
