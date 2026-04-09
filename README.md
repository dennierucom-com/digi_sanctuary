# 🧘 Digi Sanctuary

> *Your digital space for mindful disconnection — breathe, listen, relax.*

A **Progressive Web App (PWA)** built with React, TypeScript, Vite, and Material UI. It provides a modular dashboard of wellness-focused widgets such as guided breathing exercises and ambient soundscapes.

---

## ✨ Features

| Widget | Description |
|---|---|
| **Breathing Tool** | Guided breathing exercises (4-7-8, Box, 4-6) with real-time visual feedback and configurable cycle speeds. |
| **Ambient Noise** | Soothing soundscapes (Rain, Forest, White Noise) with an animated visualizer and volume control. |

- **Offline-First PWA** — Install it on any device; works offline via a Service Worker with auto-update caching the app shell.
- **Plug-and-Play Widgets** — A central registry (`WIDGET_REGISTRY`) lets you add new widgets with minimal boilerplate. The dashboard lazy-loads them!
- **Persisted State** — Dashboard widget order and individual widget settings are saved locally to `localStorage` via Zustand's `persist` middleware.
- **Material Design 3 Pastels** — Sleek and calming M3-inspired aesthetic using a Soft Lavender and Sage Green tonal palette.
- **Dynamic Configuration** — A reusable `SettingsStepper` to easily configure each widget safely.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **UI Library** | Material UI (MUI) + Emotion |
| **State** | Zustand 5 (with persist) |
| **PWA** | `vite-plugin-pwa` (Workbox) |
| **Unit Testing** | Vitest + React Testing Library + jsdom |
| **E2E Testing** | Playwright |
| **Typography** | Outfit (Google Fonts) |

---

## 📁 Project Structure

```
digi_sanctuary/
├── public/                     # Static assets (icons, offline.html)
├── src/
│   ├── components/             # Shared UI components
│   │   ├── common/             # BaseCard, M3Button, M3TextField
│   │   ├── Dashboard.tsx       # Main dashboard layout (Grid of active widgets)
│   │   └── SettingsStepper.tsx  # Reusable multi-step settings wizard
│   ├── constants/
│   │   └── index.ts            # Widget IDs, Registry, Default Settings, App Strings
│   ├── features/               # Feature modules (one folder per widget)
│   │   ├── AmbientNoise/       # Widget UI, hooks, stepper config
│   │   └── BreathingTool/      # Widget UI, hooks, stepper config
│   ├── store/
│   │   └── dashboardStore.ts   # Zustand store (widget order, settings, persistence)
│   ├── theme/
│   │   ├── theme.ts            # MUI M3 theme (Soft Lavender, Sage Green)
│   │   └── typography.ts       # M3-inspired type scale (Outfit)
│   ├── App.tsx                 # Root component (ThemeProvider + CssBaseline)
│   ├── main.tsx                # Entry point (React root + SW registration)
│   └── index.css               # Global styles & font import
├── tests/
│   ├── unit/                   # Vitest unit tests (e.g. Hooks testing)
│   └── e2e/                    # Playwright E2E tests (e.g. Stepper flows, PWA)
├── index.html                  # HTML shell
├── vite.config.ts              # Vite + PWA plugin config
├── vitest.config.ts            # Vitest config
├── playwright.config.ts        # Playwright config
├── tsconfig.json               # TypeScript config (@ path alias → ./src/)
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (LTS recommended)
- **npm** 

### Installation

```bash
git clone <your-repo-url>
cd digi_sanctuary
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build & Preview for Production

```bash
npm run build
npm run preview   # Preview the production build locally
```

---

## 🧪 Testing

```bash
# Unit tests (Vitest)
npm run test          # Single run
npm run test:watch    # Watch mode

# E2E tests (Playwright — requires dev server to be running)
npm run test:e2e
```

---

## 🔌 Adding a New Widget

1. **Create** a folder at `src/features/<WidgetName>/` with at least:
   - `<WidgetName>.tsx` — the main component (typically utilizing `BaseCard`)
   - `index.ts` — default export barrel
   - `hooks.ts` — custom logical hooks (optional)
   - `StepperConfig.tsx` — specific configuration via `useStepperList` (optional)

2. **Register** it in `src/constants/index.ts`:
   ```ts
   // 1. Add the ID
   export const WIDGET_IDS = {
     // ...existing
     MY_WIDGET: 'my-widget',
   } as const;

   // 2. Add to the WIDGET_REGISTRY array
   {
     id: WIDGET_IDS.MY_WIDGET,
     title: 'My Widget',
     description: '...',
     component: () => import('@/features/MyWidget'),
   }

   // 3. Add default config to DEFAULT_WIDGET_SETTINGS 
   // 4. Add the ID to DEFAULT_WIDGET_ORDER to show by default
   ```

3. **Done** — the `Dashboard` will auto-render it via `React.lazy` and `Suspense`.

---

## 🎨 Theme Overview

| Element | Specification |
|---|---|
| Primary Color | **Soft Lavender** (`#C4B5E0` base, `#9373B5` main) |
| Secondary Color | **Sage Green** (`#A8C4A2` base, `#6B9E6B` main) |
| Card Radius | `24px` |
| Hover State | Gentle `translateY(-2px)` with expanded shadow |
| Typography | Google's **Outfit** font mapping exactly to Material Design 3 Scales |
| Surface Background | **Warm Near-White** (`#FAF8FF`) |

---

## 📎 Path Aliases

The project uses `@/` as an alias for `./src/`. Configured in both `tsconfig.json` and `vite.config.ts`.

```ts
import { BaseCard } from "@/components/common";
```

---

## 📄 License

Private / Custom 
