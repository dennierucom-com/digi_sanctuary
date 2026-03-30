import { WidgetId } from '@/constants';

export interface ManifestWidgetEntry {
  /** Unique instance ID (allows multiple instances of the same type) */
  instanceId: string;
  /** Widget type — must match a WidgetId from the registry */
  type: WidgetId;
  /** Visual order (0-indexed) */
  order: number;
  /** Optional initial props forwarded to the widget component */
  initialProps?: Record<string, unknown>;
}

export interface DashboardManifest {
  version: number;
  widgets: ManifestWidgetEntry[];
}
