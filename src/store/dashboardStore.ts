import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_WIDGET_ORDER, DEFAULT_WIDGET_SETTINGS } from '@/constants';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface WidgetSettings {
  [key: string]: unknown;
}

export interface DashboardState {
  /** Ordered list of widget IDs currently shown on the dashboard */
  widgetOrder: string[];

  /** Per-widget settings keyed by widget ID */
  widgetSettings: Record<string, WidgetSettings>;

  /* Actions */
  addWidget: (id: string) => void;
  removeWidget: (id: string) => void;
  reorderWidgets: (newOrder: string[]) => void;
  updateWidgetSettings: (id: string, patch: Partial<WidgetSettings>) => void;
  resetDashboard: () => void;
}

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      widgetOrder: DEFAULT_WIDGET_ORDER,
      widgetSettings: DEFAULT_WIDGET_SETTINGS,

      addWidget: (id: string) =>
        set((state) => {
          if (state.widgetOrder.includes(id)) return state;
          return {
            widgetOrder: [...state.widgetOrder, id],
            widgetSettings: {
              ...state.widgetSettings,
              [id]: DEFAULT_WIDGET_SETTINGS[id] ?? {},
            },
          };
        }),

      removeWidget: (id: string) =>
        set((state) => ({
          widgetOrder: state.widgetOrder.filter((w) => w !== id),
        })),

      reorderWidgets: (newOrder: string[]) =>
        set({ widgetOrder: newOrder }),

      updateWidgetSettings: (id: string, patch: Partial<WidgetSettings>) =>
        set((state) => ({
          widgetSettings: {
            ...state.widgetSettings,
            [id]: { ...(state.widgetSettings[id] ?? {}), ...patch },
          },
        })),

      resetDashboard: () =>
        set({
          widgetOrder: DEFAULT_WIDGET_ORDER,
          widgetSettings: DEFAULT_WIDGET_SETTINGS,
        }),
    }),
    {
      name: 'digi-sanctuary-dashboard',
      merge: (persisted, current) => {
        const stored = persisted as DashboardState | undefined;
        if (!stored) return current;

        // Inject any newly-registered widget IDs that are missing from the persisted order
        const missingWidgets = DEFAULT_WIDGET_ORDER.filter(
          (id) => !stored.widgetOrder.includes(id),
        );

        return {
          ...current,
          ...stored,
          widgetOrder: [...stored.widgetOrder, ...missingWidgets],
          widgetSettings: {
            ...DEFAULT_WIDGET_SETTINGS,
            ...stored.widgetSettings,
          },
        };
      },
    },
  ),
);
