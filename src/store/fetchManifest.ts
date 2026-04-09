import type { DashboardManifest } from '@/types/manifest';

export async function fetchManifest(): Promise<DashboardManifest> {
  try {
    // In a real app, this would be a fetch() call to a server endpoint.
    // For this refactor, we simulate fetching the local mock JSON.
    const manifestModule = await import('@/mocks/dashboardManifest.json');
    return manifestModule.default as DashboardManifest;
  } catch (error) {
    console.error('Failed to fetch manifest:', error);
    throw new Error('Failed to fetch dashboard manifest');
  }
}
