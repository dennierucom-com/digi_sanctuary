import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBreathingCycle } from "../../src/features/BreathingTool/hooks";

describe("useBreathingCycle", () => {
  it("should initialize with correct phase when inactive", () => {
    const { result } = renderHook(() =>
      useBreathingCycle({
        pattern: "4-7-8",
        speedMultiplier: 1,
        isActive: false,
      }),
    );

    expect(result.current.phase).toBe("inhale");
    expect(result.current.timeLeft).toBe(4);
    expect(result.current.progress).toBe(0);
  });

  // Since we are dealing with timers in the hook, we could use vi.useFakeTimers() for full cycle tests,
  // but for the boilerplate, ensuring initial state and basic API structure is sufficient.
  it("should have the correct API structure", () => {
    const { result } = renderHook(() =>
      useBreathingCycle({ pattern: "box", speedMultiplier: 2, isActive: true }),
    );

    expect(result.current).toHaveProperty("phase");
    expect(result.current).toHaveProperty("timeLeft");
    expect(result.current).toHaveProperty("progress");
  });
});
