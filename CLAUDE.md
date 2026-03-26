# CLAUDE.md

Project context for AI assistants.

## Overview

3D portfolio website for Michael Arabskiy (Product Manager).
Domain: michaelpm.ru

## Tech Stack

- **Framework:** Next.js 15.5.7 + React 19 + TypeScript
- **3D Scene:** React Three Fiber 9 + DREI 10 (scroll-driven camera movement)
- **Animations:** GSAP 3.12
- **State Management:** Zustand 5 (3 stores: portalStore, scrollStore, themeStore)
- **Styling:** Tailwind CSS 3.4
- **Linting:** ESLint 9 + Husky + lint-staged (pre-commit)

## Project Structure

```
app/
  components/   # UI components (hero, models, common, etc.)
  constants/    # Static data (projects, work experience, footer links)
  stores/       # Zustand stores (portalStore, scrollStore, themeStore)
  types/        # TypeScript interfaces
  layout.tsx    # Root layout
  page.tsx      # Main page
public/         # Static assets (icons, images, fonts)
```

## Commands

- `npm run dev` — start dev server (localhost:3000)
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — run ESLint

## Environment Variables

- `GA_MEASUREMENT_ID` — Google Analytics Measurement ID (optional)

## Notes

- `WorkTimelinePoint` (in `app/types/work.ts`) has an optional `description` field for displaying work experience details in the 3D timeline.
