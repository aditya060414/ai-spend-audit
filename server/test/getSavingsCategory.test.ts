import { describe, it, expect } from "vitest";
import { getSavingsCategory } from "../services/audit/qualificationEngine.js";

describe("getSavingsCategory", () => {
  it("should return 'optimal' for $0 savings", () => {
    expect(getSavingsCategory(0)).toBe("optimal");
  });

  it("should return 'low' for $50 savings", () => {
    expect(getSavingsCategory(50)).toBe("low");
  });

  it("should return 'medium' for $150 savings", () => {
    expect(getSavingsCategory(150)).toBe("medium");
  });

  it("should return 'high' for $300 savings", () => {
    expect(getSavingsCategory(300)).toBe("high");
  });

  it("should return 'critical' for $700 savings", () => {
    expect(getSavingsCategory(700)).toBe("critical");
  });

  it("should handle negative savings as 'optimal'", () => {
    expect(getSavingsCategory(-100)).toBe("optimal");
  });
});
