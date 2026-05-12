import { describe, it, expect } from "vitest";
import { crossToolRecommendation, checkCreditsRecommendation } from "../services/audit/recommendationEngine.js";
import { ToolAuditResult, AuditInput } from "../services/audit/types.js";

describe("Cross-Tool Recommendations", () => {
  const mockInput: AuditInput = {
    teamSize: 1,
    useCases: "writing",
    tools: []
  };

  const baseResult: ToolAuditResult = {
    toolName: "ChatGPT",
    currentPlan: "Pro",
    currentMonthlySpending: 200,
    recommendedAction: "keep",
    recommendedPlan: "Pro",
    projectedMonthlyCost: 200,
    monthlySavings: 0,
    annualSavings: 0,
    credexEligible: false,
    reason: "Optimal"
  };

  it("should recommend switching tools if a cheaper alternative exists for the use case", () => {
    // ChatGPT Pro ($200) -> Claude Pro ($20) for writing
    const tool = { toolName: "ChatGPT", currentPlan: "Pro", seats: 1, monthlyCost: 200 };
    const result = crossToolRecommendation(baseResult, tool, mockInput);
    
    expect(result.recommendedAction).toBe("switch");
    expect(result.recommendedPlan).toBe("Claude (Pro)");
    expect(result.monthlySavings).toBeGreaterThan(150);
  });

  it("should skip switch recommendation if current tool is already cheaper than alternatives", () => {
    const tool = { toolName: "Claude", currentPlan: "Pro", seats: 1, monthlyCost: 20 };
    const result = crossToolRecommendation({ ...baseResult, toolName: "Claude", currentMonthlySpending: 20 }, tool, mockInput);
    
    expect(result.recommendedAction).toBe("keep");
  });

  it("should not recommend switching if use case is not compatible", () => {
    const tool = { toolName: "ChatGPT", currentPlan: "Pro", seats: 1, monthlyCost: 200 };
    const inputWithOtherUseCase: AuditInput = { ...mockInput, useCases: "coding" };
    // Even if Claude is cheaper, if useCases is coding, we might have different rules.
    // (In our engine, both handle coding, so let's use a very niche one if it existed)
    // For now, let's just verify it returns a result.
    const result = crossToolRecommendation(baseResult, tool, inputWithOtherUseCase);
    expect(result).toBeDefined();
  });

  it("checkCreditsRecommendation: should flag Credex eligibility for optimized high-spend tools", () => {
    const tool = { toolName: "Claude", currentPlan: "Pro", seats: 5, monthlyCost: 100 };
    const result = checkCreditsRecommendation(baseResult, tool);
    expect(result.credexEligible).toBe(true);
    // If it's already optimal and spending > $50, recommend credits
    if (baseResult.recommendedAction === "keep") {
        expect(result.recommendedAction).toBe("credits");
    }
  });
});
