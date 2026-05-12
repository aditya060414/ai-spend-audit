import { describe, it, expect } from "vitest";
import { findPlan, findCheaperPlan, findUpgradePlan, findFreePlan } from "../services/audit/pricing/pricingHelpers.js";

describe("Pricing Helpers", () => {
  it("findPlan: should find an existing plan (case-insensitive)", () => {
    const plan = findPlan("ChatGPT", "plus");
    expect(plan).toBeDefined();
    expect(plan?.name).toBe("Plus");
    expect(plan?.pricePerSeat).toBe(20);
  });

  it("findPlan: should return undefined for non-existent tool/plan", () => {
    expect(findPlan("NonExistent", "Pro")).toBeUndefined();
    expect(findPlan("ChatGPT", "Enterprise Plus Ultra")).toBeUndefined();
  });

  it("findCheaperPlan: should find a cheaper compatible plan", () => {
    const currentPlan = findPlan("GitHub Copilot", "Pro+")!; // $39
    const cheaper = findCheaperPlan("GitHub Copilot", "coding", currentPlan, 1);
    expect(cheaper).toBeDefined();
    expect(cheaper?.pricePerSeat).toBeLessThan(39);
    expect(cheaper?.name).toBe("Pro"); // $10
  });

  it("findUpgradePlan: should find a more expensive compatible plan", () => {
    const currentPlan = findPlan("ChatGPT", "Plus")!; // $20
    const upgrade = findUpgradePlan("ChatGPT", "coding", currentPlan, 1);
    expect(upgrade).toBeDefined();
    expect(upgrade?.pricePerSeat).toBeGreaterThan(20);
    expect(upgrade?.name).toBe("Pro"); // $200
  });

  it("findFreePlan: should find a free plan if compatible", () => {
    const free = findFreePlan("Claude", "writing", 1);
    expect(free).toBeDefined();
    expect(free?.pricePerSeat).toBe(0);
    expect(free?.name).toBe("Free");
  });

  it("findFreePlan: should return null if seats exceed maxSeats of free plan", () => {
    // Assuming GH Copilot Free has maxSeats: 1
    const free = findFreePlan("GitHub Copilot", "coding", 5);
    expect(free).toBeNull();
  });
});
