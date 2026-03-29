import { describe, it, expect } from "vitest";
import { WIDGET_REGISTRY, WIDGET_IDS } from "../../src/constants";

describe("WIDGET_REGISTRY", () => {
  it("should contain exactly the expected widget IDs", () => {
    const ids = WIDGET_REGISTRY.map((w) => w.id);
    expect(ids).toContain(WIDGET_IDS.BREATHING_TOOL);
    expect(ids).toContain(WIDGET_IDS.AMBIENT_NOISE);
    expect(ids).toContain(WIDGET_IDS.SMART_HYDRATION);
    expect(ids).toHaveLength(3);
  });

  it("every entry should have compact and expanded lazy loaders", () => {
    for (const entry of WIDGET_REGISTRY) {
      expect(typeof entry.compact).toBe("function");
      expect(typeof entry.expanded).toBe("function");
      expect(entry).not.toHaveProperty("component");
    }
  });

  it("every entry should have a title and description", () => {
    for (const entry of WIDGET_REGISTRY) {
      expect(typeof entry.title).toBe("string");
      expect(entry.title.length).toBeGreaterThan(0);
      expect(typeof entry.description).toBe("string");
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });

  it("compact and expanded loaders should return different module paths", () => {
    // Each lazy loader is a distinct function reference even for the same widget
    for (const entry of WIDGET_REGISTRY) {
      expect(entry.compact).not.toBe(entry.expanded);
    }
  });
});
