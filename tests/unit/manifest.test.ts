import { describe, it, expect, beforeEach, vi } from "vitest";
import { useDashboardStore } from "../../src/store";
import { fetchManifest } from "../../src/store/fetchManifest";
import { DEFAULT_MANIFEST } from "../../src/constants";

// Mock the fetchManifest function
vi.mock("../../src/store/fetchManifest", () => ({
  fetchManifest: vi.fn()
}));

function resetStore() {
  useDashboardStore.setState({
    activeManifest: null,
    expandedWidgetId: null,
    widgetSettings: {}
  });
}

describe("Dashboard Manifest Offline Support", () => {
  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
  });

  it("should start with activeManifest as null", () => {
    const { activeManifest } = useDashboardStore.getState();
    expect(activeManifest).toBeNull();
  });

  it("should populate activeManifest on a successful hydrateManifest", async () => {
    const mockManifest = {
      version: 1,
      widgets: [
        { instanceId: "test-1", type: "breathing-tool", order: 0 }
      ]
    };
    (fetchManifest as any).mockResolvedValueOnce(mockManifest);

    await useDashboardStore.getState().hydrateManifest();

    expect(fetchManifest).toHaveBeenCalled();
    expect(useDashboardStore.getState().activeManifest).toEqual(mockManifest);
  });

  it("should fallback to DEFAULT_MANIFEST if hydrateManifest fails and there is no persisted manifest", async () => {
    (fetchManifest as any).mockRejectedValueOnce(new Error("Network Error"));

    await useDashboardStore.getState().hydrateManifest();

    expect(fetchManifest).toHaveBeenCalled();
    expect(useDashboardStore.getState().activeManifest).toEqual(DEFAULT_MANIFEST);
  });

  it("should keep the persisted manifest if hydrateManifest fails and activeManifest is already present", async () => {
    const persistedManifest = {
      version: 1,
      widgets: [
        { instanceId: "test-2", type: "ambient-noise", order: 0 }
      ]
    };
    useDashboardStore.setState({ activeManifest: persistedManifest as any });

    (fetchManifest as any).mockRejectedValueOnce(new Error("Network Error"));

    await useDashboardStore.getState().hydrateManifest();

    expect(fetchManifest).toHaveBeenCalled();
    expect(useDashboardStore.getState().activeManifest).toEqual(persistedManifest);
  });
});
