import { describe, it, expect, beforeEach } from "vitest";
import { useDashboardStore } from "../../src/store";

function resetStore() {
  // Reset expansion state between tests
  useDashboardStore.setState((state) => ({
    ...state,
    expandedWidgetId: null,
  }));
}

describe("dashboardStore – expansion state", () => {
  beforeEach(() => {
    resetStore();
  });

  it("should start with expandedWidgetId as null", () => {
    const { expandedWidgetId } = useDashboardStore.getState();
    expect(expandedWidgetId).toBeNull();
  });

  it("should set expandedWidgetId via setExpandedWidget", () => {
    const { setExpandedWidget } = useDashboardStore.getState();
    setExpandedWidget("smart-hydration");
    expect(useDashboardStore.getState().expandedWidgetId).toBe("smart-hydration");
  });

  it("should clear expandedWidgetId when set to null", () => {
    const { setExpandedWidget } = useDashboardStore.getState();
    setExpandedWidget("breathing-tool");
    setExpandedWidget(null);
    expect(useDashboardStore.getState().expandedWidgetId).toBeNull();
  });

  it("should replace a previously expanded widget id", () => {
    const { setExpandedWidget } = useDashboardStore.getState();
    setExpandedWidget("ambient-noise");
    setExpandedWidget("smart-hydration");
    expect(useDashboardStore.getState().expandedWidgetId).toBe("smart-hydration");
  });
});
