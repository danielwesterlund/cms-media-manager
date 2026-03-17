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

### 1. Before you start (Windows)

You need **Node.js** installed on your computer.

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download and install the **LTS** version
3. During install, keep the default options
4. Restart your terminal after installation

To check it worked, open **PowerShell** and run:

```powershell
node -v
npm -v
```

If both commands show version numbers, you’re ready.

### 2. Download this project

If you already have the project folder, skip this step.

Otherwise:
- Download ZIP from GitHub and extract it, or
- Clone with Git (for developers)

### 3. Open the project in PowerShell

1. Open the project folder in File Explorer
2. Click the address bar, type `powershell`, and press Enter
3. A PowerShell window opens in that folder

### 4. Install dependencies (one-time)

Run:

```powershell
npm install
```

This may take a few minutes the first time.

### 5. Start the app

Run:

```powershell
npm run dev
```

After it starts, open the local URL shown in the terminal (usually `http://localhost:5173`).

### 6. Stop the app

In the PowerShell window, press:

`Ctrl + C`

## Quick Troubleshooting (Windows)

- If `npm` is not recognized:
  - Node.js is not installed correctly, or terminal was open during install
  - Reinstall Node.js LTS and reopen PowerShell
- If install fails with network errors:
  - Check VPN/proxy/firewall settings
  - Try again on a stable connection
- If the dev server port is busy:
  - Close other running dev servers and run `npm run dev` again

## For Developers (Optional)

- Node.js 18+ (latest LTS recommended)
- Package manager used in this repo: `npm` (works with `pnpm` too)

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
