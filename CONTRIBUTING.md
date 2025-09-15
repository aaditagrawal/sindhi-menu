## Contributing

Thanks for your interest in improving the Sindhi Menu project! The app uses a static JSON file for data, so contributions focus on code improvements, UI enhancements, and updating the JSON at public/sindhi-menu.json.

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

## Project Conventions

Tech stack: Next.js (App Router), TypeScript, Tailwind v4, lucide-react.

- **TypeScript**: strict mode; avoid `any`. Prefer explicit types on exported APIs.
- **React**: client components only when interaction is needed. Keep hooks dependency arrays correct.
- **Styling**: Tailwind classes; keep UI minimalist and consistent.
- **Data**: Menu is read from a fixed JSON (public/sindhi-menu.json). Handle loading/empty states gracefully.
- **UX**: prioritize "upcoming meal first" logic and responsiveness.

---

## Submitting Changes

1) Fork and create a feature branch.
2) Make your changes and ensure:
   - `bun run lint` passes
   - `bun run build` succeeds
3) Open a PR with a concise description and screenshots if UI changes.

Thank you for contributing!


