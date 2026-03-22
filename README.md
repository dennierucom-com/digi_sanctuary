# 🧘 Digi Sanctuary

> *Your digital space for mindful disconnection — breathe, listen, relax.*

A **Progressive Web App (PWA)** built with React, TypeScript, Vite, and Material UI. It provides a modular dashboard of wellness-focused widgets such as guided breathing exercises and ambient soundscapes.

---

## ✨ Features

| Widget | Description |
|---|---|
| **Breathing Tool** | Guided breathing exercises (4-7-8, Box, 4-6) with real-time visual feedback and configurable speed |
| **Ambient Noise** | Soothing soundscapes (Rain, Forest, White Noise) with volume control |

- **PWA-Ready** — Install it on any device; works offline via a Service Worker with auto-update.
- **Plug-and-Play Widgets** — A central registry (`WIDGET_REGISTRY`) lets you add new widgets with zero boilerplate.
- **Persisted State** — Dashboard order and per-widget settings are saved to `localStorage` via Zustand's `persist` middleware.
- **Modern SaaS Aesthetic** — Card-based single-column layout with circular icon badges, accent bars, and generous spacing.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 7 |
| **UI Library** | Material UI 7 (MUI) + Emotion |
| **State** | Zustand 5 (persisted) |
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
│   │   ├── Dashboard.tsx       # Main dashboard layout (single-column Stack)
│   │   └── SettingsStepper.tsx  # Reusable multi-step settings wizard
│   ├── constants/
│   │   └── index.ts            # Widget IDs, Registry, Default Settings, App Strings
│   ├── features/               # Feature modules (one folder per widget)
│   │   ├── AmbientNoise/       # AmbientNoise widget (component, hooks, stepper config)
│   │   └── BreathingTool/      # BreathingTool widget (component, hooks, stepper config)
│   ├── store/
│   │   └── dashboardStore.ts   # Zustand store (widget order, settings, persistence)
│   ├── theme/
│   │   ├── theme.ts            # MUI theme (palette, shape, component overrides)
│   │   └── typography.ts       # M3-inspired type scale
│   ├── App.tsx                 # Root component (ThemeProvider + CssBaseline)
│   ├── main.tsx                # Entry point (React root + SW registration)
│   └── index.css               # Global styles & font import
├── tests/
│   ├── unit/                   # Vitest unit tests
│   └── e2e/                    # Playwright E2E tests
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

- **Node.js** ≥ 18
- **npm** ≥ 9 (or compatible package manager)

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

### Build for Production

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

# E2E tests (Playwright — requires dev server)
npm run test:e2e
```

---

## 🔌 Adding a New Widget

1. **Create** a folder at `src/features/<WidgetName>/` with at least:
   - `<WidgetName>.tsx` — the main component (wrapped in a `<BaseCard>`)
   - `index.ts` — default export barrel
   - `hooks.ts` — custom hooks (optional)
   - `StepperConfig.tsx` — settings steps (optional)

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

   // 3. Add default settings & order
   ```

3. **Done** — the `Dashboard` will auto-render it via `React.lazy`.

---

## 🎨 Design Tokens

| Token | Value | Usage |
|---|---|---|
| Primary Brand | `#4006BC` | Icons, accent bars, primary buttons |
| Title Color | `#1A1A1A` | Card headings |
| Description Color | `#666666` | Card subtitles |
| Card Radius | `24px` | All top-level cards |
| Card Shadow | `0 4px 24px rgba(0,0,0,0.05)` | Subtle elevation |
| Action Card BG | `#F9FAF9` | Nested inner cards |
| Accent Bar Width | `4px` | Left border on action cards |

---

## 📎 Path Aliases

The project uses `@/` as an alias for `./src/`. Configured in both `tsconfig.json` and `vite.config.ts`.

```ts
import { BaseCard } from "@/components/common";
```

---

## 📄 License

Private — see `package.json`.
