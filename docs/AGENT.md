# AGENT Onboarding

## Purpose
This repository contains the **TTI Media Manager v2** frontend prototype built with React + TypeScript.
The app currently runs on a deterministic in-memory mock service and is intended for rapid UI/workflow iteration.

## Quick Start
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Run tests: `npm test`
- Build: `npm run build`
- Preview production build: `npm run preview`

## Tech Stack
- Vite 5
- React 18 + React Router 6
- TypeScript
- TanStack Query (server/cache state)
- Zustand (UI state)
- Zod + React Hook Form (metadata forms)
- Tailwind CSS v4 + tokenized design variables
- Vitest + Testing Library

## App Entry Points
- App bootstrap: `src/main.tsx`
- Routes: `src/app/router.tsx`
- Home page: `src/pages/home/home-page.tsx`
- Media page: `src/pages/media/media-library-page.tsx`

## Media Feature Map
- Main shell composition: `src/features/media/components/media-manager-shell.tsx`
- Domain types/constants/schemas:
  - `src/features/media/domain/media.types.ts`
  - `src/features/media/domain/media.constants.ts`
  - `src/features/media/domain/media.schemas.ts`
- Data hooks:
  - `src/features/media/hooks/use-assets-query.ts`
  - `src/features/media/hooks/use-folders-query.ts`
  - `src/features/media/hooks/use-usage-query.ts`
  - `src/features/media/hooks/use-upload-controller.ts`
  - `src/features/media/hooks/use-asset-mutations.ts`
- Service contract + provider:
  - `src/features/media/services/media-service.ts`
  - `src/features/media/services/media-service-provider.ts`
- Mock implementation and seed dataset:
  - `src/features/media/services/mock/mock-media-service.ts`
  - `src/features/media/services/mock/mock-data.ts`
- UI state store:
  - `src/features/media/state/media-ui.store.ts`

## Current Behavior Baseline (as of 2026-03-17)
- Tests pass: `7/7` via `npm test`
- Media flow integration covers select -> open detail -> edit metadata -> save toast.
- Upload flow is simulated with deterministic progress/failure behavior in `use-upload-controller`.

## Working Guidelines
- Treat `MediaService` interface as the boundary for data-layer changes.
- Keep domain typing aligned across:
  - `media.types.ts`
  - `media.schemas.ts`
  - mock service payloads
- Prefer adding or updating tests when changing:
  - metadata validation
  - upload behavior
  - selection/detail interactions
- Do not break deterministic mock behavior unless intentionally re-baselining tests.

## Static Prototype Reference
A no-build legacy prototype exists under `HTML/`:
- `HTML/index.html`
- `HTML/app.js`
- `HTML/styles.css`

Use it as a behavior/design reference only; `src/` is the active implementation.

## First Tasks for New Contributors
1. Run `npm test` and confirm green baseline.
2. Run `npm run dev` and open `/media`.
3. Inspect `media-manager-shell.tsx` to understand layout orchestration.
4. Trace one action end-to-end (example: upload -> query invalidation -> list refresh).
5. Add/adjust tests before broad refactors.
