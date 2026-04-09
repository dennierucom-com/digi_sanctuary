import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_WIDGET_SETTINGS, DEFAULT_MANIFEST, WidgetId } from '@/constants';
import type { DashboardManifest, ManifestWidgetEntry } from '@/types/manifest';
import { fetchManifest } from './fetchManifest';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface WidgetSettings {
  [key: string]: unknown;
}

export interface DashboardState {
  /** The currently active manifest driving the dashboard layout */
  activeManifest: DashboardManifest | null;

  /** Derived ordered list of widget IDs for backwards compatibility and ease of use */
  widgetOrder: string[];

  /** Per-widget settings keyed by widget ID */
  widgetSettings: Record<string, WidgetSettings>;

  /** ID of the currently expanded widget, or null if none are expanded */
  expandedWidgetId: string | null;

  /* Actions */
  hydrateManifest: () => Promise<void>;
  addWidget: (id: string, initialProps?: Record<string, unknown>) => void;
  removeWidget: (id: string) => void;
  reorderWidgets: (newOrder: string[]) => void;
  updateWidgetSettings: (id: string, patch: Partial<WidgetSettings>) => void;
  setExpandedWidget: (id: string | null) => void;
  resetDashboard: () => void;
}

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      activeManifest: null,
      
      // Derived getter for backward compatibility or simple array needs
      get widgetOrder() {
        const manifest = get().activeManifest;
        if (!manifest) return [];
        return [...manifest.widgets].sort((a, b) => a.order - b.order).map(w => w.type);
      },

      widgetSettings: DEFAULT_WIDGET_SETTINGS,
      expandedWidgetId: null,

      hydrateManifest: async () => {
        try {
          const manifest = await fetchManifest();
          set({ activeManifest: manifest });
        } catch (error) {
          console.error('Manifest hydration failed, falling back to persisted or default', error);
          if (!get().activeManifest) {
            set({ activeManifest: DEFAULT_MANIFEST });
          }
        }
      },

      addWidget: (id: string, initialProps = {}) =>
        set((state) => {
          const manifest = state.activeManifest || DEFAULT_MANIFEST;
          if (manifest.widgets.some(w => w.type === id)) return state;

          const newOrder = manifest.widgets.length;
          const newEntry: ManifestWidgetEntry = {
            instanceId: `${id}-${Date.now()}`,
            type: id as WidgetId,
            order: newOrder,
            initialProps
          };

          return {
            activeManifest: {
              ...manifest,
              widgets: [...manifest.widgets, newEntry]
            },
            widgetSettings: {
              ...state.widgetSettings,
              [id]: { ...(DEFAULT_WIDGET_SETTINGS[id] ?? {}), ...initialProps },
            },
          };
        }),

      removeWidget: (id: string) =>
        set((state) => {
          const manifest = state.activeManifest;
          if (!manifest) return state;

          const filteredWidgets = manifest.widgets.filter((w) => w.type !== id);
          const reorderedWidgets = filteredWidgets
            .sort((a, b) => a.order - b.order)
            .map((w, idx) => ({ ...w, order: idx }));

          return {
            activeManifest: {
              ...manifest,
              widgets: reorderedWidgets
            }
          };
        }),

      reorderWidgets: (newOrder: string[]) =>
        set((state) => {
          const manifest = state.activeManifest;
          if (!manifest) return state;

          const updatedWidgets = manifest.widgets.map(w => {
            const index = newOrder.indexOf(w.type);
            return {
              ...w,
              order: index !== -1 ? index : w.order
            };
          }).sort((a, b) => a.order - b.order);

          return {
            activeManifest: {
              ...manifest,
              widgets: updatedWidgets
            }
          };
        }),

      updateWidgetSettings: (id: string, patch: Partial<WidgetSettings>) =>
        set((state) => ({
          widgetSettings: {
            ...state.widgetSettings,
            [id]: { ...(state.widgetSettings[id] ?? {}), ...patch },
          },
        })),

      setExpandedWidget: (id: string | null) =>
        set({ expandedWidgetId: id }),

      resetDashboard: () =>
        set({
          activeManifest: DEFAULT_MANIFEST,
          widgetSettings: DEFAULT_WIDGET_SETTINGS,
          expandedWidgetId: null,
        }),
    }),
    {
      name: 'digi-sanctuary-dashboard',
      partialize: (state) => ({
        activeManifest: state.activeManifest,
        widgetSettings: state.widgetSettings,
      }),
      merge: (persisted, current) => {
        const stored = persisted as Partial<DashboardState> | undefined;
        if (!stored) return current;

        const manifest = stored.activeManifest ?? DEFAULT_MANIFEST;

        return {
          ...current,
          ...stored,
          activeManifest: manifest,
          widgetSettings: {
            ...DEFAULT_WIDGET_SETTINGS,
            ...(stored.widgetSettings || {}),
          },
        };
      },
    },
  ),
);
