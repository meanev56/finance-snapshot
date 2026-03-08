# Finance Snapshot – Personal Finance Tracker

A clean, modern, client-side personal finance dashboard built with **Next.js 15+ (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **localStorage** persistence.

Live demo: (deploy it yourself on Vercel/Netlify – no backend required)
https://finance-snapshot-umber.vercel.app/


## What I Built

A minimalist monthly personal finance tracker with the following features:

- Monthly income & expense overview (summary cards with color coding)
- Add income/expense transactions (toggle, category picker with icons, smooth UX)
- Category-based spending pie chart (Recharts)
- Per-category monthly budget setting + visual progress bars (green → amber → red)
- Recent transactions list with icons, color-coded amounts, hover states
- Month navigation (previous/next)
- Search & type filter for transactions
- Dark mode support (system preference + manual toggle)
- Category-specific icons and accent colors
- Toast notifications (sonner)
- CSV export (basic implementation)
- Fully responsive, mobile-friendly layout
- No backend – everything persists in localStorage

## Design & Technology Choices – Why?

| Decision                          | Reason / Trade-off                                                                 |
|-------------------------------|-------------------------------------------------------------------------------------|
| Next.js App Router + TypeScript   | Modern Next.js structure, type safety, good DX, easy Vercel deployment              |
| Tailwind CSS v4                   | Fast styling, semantic tokens, excellent dark mode support via CSS variables        |
| localStorage only                 | No backend = instant setup, zero cost, no auth/privacy concerns                     |
| Recharts                          | Lightweight, composable charts, good enough for pie + tooltip needs                 |
| lucide-react icons                | Consistent, modern, tree-shakable, free                                            |
| next-themes                       | Battle-tested, handles system preference + manual toggle cleanly                   |
| sonner for toasts                 | Beautiful, lightweight, accessible toasts without heavy dependencies                |
| Category icons & per-cat colors   | Improves glanceability / delight – users recognize categories faster               |
| Semantic Tailwind tokens          | Future-proof, consistent light/dark mode without fighting hardcoded colors         |
| No heavy form library             | Kept it simple (controlled inputs + basic validation) – enough for this scope      |

## What I Would Improve With More Time

High-priority polish / next features (in rough order):

1. CSV **import** (PapaParse + validation + duplicate prevention)
2. Better date range filtering (calendar picker instead of just month view)
3. Running balance / cash flow chart (line chart over time)
4. Category management (add custom categories, icons)
5. PWA support + offline mode improvements (better service worker)
6. Export/import settings (budgets + categories) as JSON
7. Multi-currency support (at least ₦ / $ / € toggle)
8. Basic goal tracking (e.g. "Save ₦500k for vacation")
9. Animated number counters on summary cards
10. Accessibility audit + keyboard navigation improvements

## Challenges Faced

- Tailwind v4 migration quirks (no more `tailwind.config.js` paths, new `@theme` syntax, oklch colors)
- Making dark mode look good across charts (Recharts doesn't inherit dark mode automatically → custom colors needed)
- Balancing simplicity vs polish (wanted to avoid component libraries like shadcn/ui to keep bundle small)
- localStorage quirks on SSR → all data loading moved to client-side `useEffect`
- Deciding how opinionated to make budgets (only expenses have limits vs also tracking income goals)
- hydration error

## Time Spent (approximate)

Total active development time: **~14–18 hours** spread across several sessions

Most time went into visual polish, dark mode consistency, and making the form feel delightful rather than raw.

npm install
npm run dev