import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useHydration } from "../../src/features/SmartHydration/useHydration";
import { useDashboardStore } from "../../src/store";

function resetStore() {
  useDashboardStore.setState((state) => ({
    ...state,
    widgetSettings: {},
  }));
}

describe("useHydration", () => {
  beforeEach(() => {
    resetStore();
  });

  it("should return the correct API surface", () => {
    const { result } = renderHook(() => useHydration());
    expect(result.current).toHaveProperty("profile");
    expect(result.current).toHaveProperty("logs");
    expect(result.current).toHaveProperty("dailyGoal");
    expect(result.current).toHaveProperty("totalIntake");
    expect(result.current).toHaveProperty("effectiveIntake");
    expect(result.current).toHaveProperty("progress");
    expect(result.current).toHaveProperty("logIntake");
    expect(result.current).toHaveProperty("updateProfile");
    expect(result.current).toHaveProperty("isSodiumWarning");
    expect(result.current).toHaveProperty("isRestricted");
    expect(result.current).toHaveProperty("disclaimerText");
  });

  it("should start with zero intake and a non-zero daily goal", () => {
    const { result } = renderHook(() => useHydration());
    expect(result.current.totalIntake).toBe(0);
    expect(result.current.effectiveIntake).toBe(0);
    expect(result.current.dailyGoal).toBeGreaterThan(0);
    expect(result.current.progress).toBe(0);
  });

  it("should log intake and update totals", async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {
      result.current.logIntake(250, false);
    });
    expect(result.current.totalIntake).toBe(250);
    expect(result.current.effectiveIntake).toBe(250);
    expect(result.current.logs).toHaveLength(1);
  });

  it("should apply +20% additive multiplier when withAdditives=true", async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {
      result.current.logIntake(250, true);
    });
    // 250 * 1.20 = 300
    expect(result.current.effectiveIntake).toBe(300);
    expect(result.current.totalIntake).toBe(250);
  });

  it("progress should be capped at 1 when over the daily goal", async () => {
    const { result } = renderHook(() => useHydration());
    const goal = result.current.dailyGoal;
    await act(async () => {
      result.current.logIntake(goal * 2, false);
    });
    expect(result.current.progress).toBe(1);
  });

  it("should flag isSodiumWarning for hypertension profile", async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {
      result.current.updateProfile({ chronicConditions: ["hypertension"] });
    });
    expect(result.current.isSodiumWarning).toBe(true);
  });

  it("should flag isRestricted for renal-insufficiency profile and cap goal", async () => {
    const { result } = renderHook(() => useHydration());
    await act(async () => {
      result.current.updateProfile({
        chronicConditions: ["renal-insufficiency"],
      });
    });
    expect(result.current.isRestricted).toBe(true);
    // Cap is 1500 ml
    expect(result.current.dailyGoal).toBe(1500);
  });

  it("altitude flag should increase daily goal vs. no-altitude baseline", async () => {
    const { result } = renderHook(() => useHydration());
    // Default profile has enableAltitude=true, so capture goal with altitude first
    const goalWithAltitude = result.current.dailyGoal;

    // Disable altitude and compare
    await act(async () => {
      result.current.updateProfile({ enableAltitude: false });
    });
    const goalWithoutAltitude = result.current.dailyGoal;

    expect(goalWithAltitude).toBeGreaterThan(goalWithoutAltitude);
  });
});
