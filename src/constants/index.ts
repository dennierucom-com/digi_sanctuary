import type { ComponentType } from 'react';
import type { DashboardManifest } from '@/types/manifest';

/* ------------------------------------------------------------------ */
/*  Widget IDs                                                         */
/* ------------------------------------------------------------------ */

export const WIDGET_IDS = {
  BREATHING_TOOL: 'breathing-tool',
  AMBIENT_NOISE: 'ambient-noise',
  SMART_HYDRATION: 'smart-hydration',
} as const;

export type WidgetId = (typeof WIDGET_IDS)[keyof typeof WIDGET_IDS];

/* ------------------------------------------------------------------ */
/*  Widget Registry                                                    */
/* ------------------------------------------------------------------ */

export interface WidgetRegistryEntry {
  id: WidgetId;
  title: string;
  description: string;
  compact: () => Promise<{ default: ComponentType }>;
  expanded: () => Promise<{ default: ComponentType }>;
}

/**
 * Central widget registry – the ONLY place to register new widgets.
 *
 * To add a new widget:
 *   1. Create its folder in /src/features/<WidgetName>/
 *   2. Add an entry below with a lazy component import.
 */
export const WIDGET_REGISTRY: WidgetRegistryEntry[] = [
  {
    id: WIDGET_IDS.BREATHING_TOOL,
    title: 'Breathing Tool',
    description: 'Guided breathing exercises with customizable patterns',
    compact: () => import('@/features/BreathingTool/CompactView'),
    expanded: () => import('@/features/BreathingTool/ExpandedView'),
  },
  {
    id: WIDGET_IDS.AMBIENT_NOISE,
    title: 'Ambient Noise',
    description: 'Relaxing ambient soundscapes to help you focus',
    compact: () => import('@/features/AmbientNoise/CompactView'),
    expanded: () => import('@/features/AmbientNoise/ExpandedView'),
  },
  {
    id: WIDGET_IDS.SMART_HYDRATION,
    title: 'Smart Hydration',
    description: 'Personalized hydration tracking with medical-grade calculations',
    compact: () => import('@/features/SmartHydration/CompactView'),
    expanded: () => import('@/features/SmartHydration/ExpandedView'),
  },
];

/* ------------------------------------------------------------------ */
/*  Default Settings                                                   */
/* ------------------------------------------------------------------ */

export const DEFAULT_WIDGET_ORDER: string[] = [
  WIDGET_IDS.BREATHING_TOOL,
  WIDGET_IDS.AMBIENT_NOISE,
  WIDGET_IDS.SMART_HYDRATION,
];

export const DEFAULT_WIDGET_SETTINGS: Record<string, Record<string, unknown>> = {
  [WIDGET_IDS.BREATHING_TOOL]: {
    pattern: '4-7-8',
    speed: 1,
    visualStyle: 'circle',
  },
  [WIDGET_IDS.AMBIENT_NOISE]: {
    activeSound: 'rain',
    volume: 0.5,
  },
  [WIDGET_IDS.SMART_HYDRATION]: {
    profile: {
      weightKg: 70,
      bodyComposition: 'average',
      enableAltitude: true,
      isPregnant: false,
      isBreastfeeding: false,
      chronicConditions: [],
    },
    logs: [],
    lastActiveDate: '',
  },
};

export const DEFAULT_MANIFEST: DashboardManifest = {
  version: 1,
  widgets: [
    {
      instanceId: 'breathing-tool-default',
      type: WIDGET_IDS.BREATHING_TOOL,
      order: 0,
      initialProps: DEFAULT_WIDGET_SETTINGS[WIDGET_IDS.BREATHING_TOOL],
    },
    {
      instanceId: 'ambient-noise-default',
      type: WIDGET_IDS.AMBIENT_NOISE,
      order: 1,
      initialProps: DEFAULT_WIDGET_SETTINGS[WIDGET_IDS.AMBIENT_NOISE],
    },
    {
      instanceId: 'smart-hydration-default',
      type: WIDGET_IDS.SMART_HYDRATION,
      order: 2,
      initialProps: DEFAULT_WIDGET_SETTINGS[WIDGET_IDS.SMART_HYDRATION],
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  App-wide Strings                                                   */
/* ------------------------------------------------------------------ */

export const APP_STRINGS = {
  APP_NAME: 'Digi Sanctuary',
  TAGLINE: 'Your digital space for mindful disconnection',
  DASHBOARD_TITLE: 'My Sanctuary',
  SETTINGS_TITLE: 'Settings',
  STEPPER_NEXT: 'Next',
  STEPPER_BACK: 'Back',
  STEPPER_FINISH: 'Done',
} as const;
