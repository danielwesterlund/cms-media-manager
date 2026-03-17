# TTI Media Manager (v2)

Design-system aligned Media Manager and CMS page prototype for TTI.

This repository contains the v2 UI for:
- A CMS "New Page" editing screen
- A full-screen Media Manager modal
- Asset browsing in grid/list views
- Folder tree operations (create/rename/move/delete)
- Single and bulk metadata editing
- Taxonomy filtering (file type, domain, license, topics, tags)
- DS-styled notifications and shared design tokens

## Tech Stack

- React 18 + TypeScript
- Vite 5
- TanStack Query
- Zustand
- Radix Dropdown Menu
- Vitest + Testing Library

## Getting Started

### 1. Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm (or pnpm)

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

```bash
npm run dev
```

Open the local URL shown in your terminal (typically `http://localhost:5173`).

## Scripts

```bash
npm run dev      # Start local dev server
npm run build    # Type-check and build production bundle
npm run preview  # Preview production build locally
npm run test     # Run test suite
```

## Project Structure

```text
src/
  components/ui/          # DS-aligned UI primitives
  features/media/         # Media Manager feature (state, hooks, components)
  pages/home/             # CMS "New Page" host screen
  pages/media/            # Standalone media page route
  tokens.css              # Design tokens (Admin theme)
  styles.css              # Global/component styles
```

## Notes

- This project is currently backed by an in-memory mock media service for fast UI iteration.
- The UI is built to stay close to the TTI Design System (Admin theme) and Figma specs.

## Release Notes (v2)

- Replaced standalone media route flow with CMS-integrated, full-screen Media Manager modal workflow.
- Implemented Admin theme token alignment across spacing, typography, colors, and component styling.
- Added/updated DS-aligned primitives in active flows:
  - Buttons + icon buttons
  - Tabs and content switchers
  - Inputs, checkboxes, radios, toggles
  - Popovers and searchable taxonomy filter comboboxes
  - Notifications/toasts (DS-styled)
- Refined Media Manager UX:
  - Top-bar sort popover with directional indicator
  - Horizontal taxonomy filtering (file type, domain, license, topics, tags)
  - Inspector empty/multi/single states
  - Bulk metadata editing for selected assets (domain, license, topics, tags)
- CMS integration improvements:
  - Double-click asset confirmation populates CMS fields
  - `Replace` reopens Media Manager with current asset preselected
  - Selected thumbnails/covers/attachments render directly in the CMS form

## License

Internal project / proprietary unless otherwise specified.
