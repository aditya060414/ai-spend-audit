import { describe, it, expect } from "vitest";
import { generateFallbackSummary } from "../services/openAIServices.js";
import type { AuditInput, AuditSummary } from "../services/audit/types.js";

describe("generateFallbackSummary", () => {
  const mockInput: AuditInput = {
    teamSize: 10,
    useCases: "coding",
    tools: [
      { toolName: "Cursor", currentPlan: "Business", seats: 10, monthlyCost: 400 },
      { toolName: "GitHub Copilot", currentPlan: "Business", seats: 10, monthlyCost: 190 }
    ]
  };

  const mockResults: AuditSummary = {
    perTool: [
      {
        toolName: "Cursor",
        currentPlan: "Business",
        currentMonthlySpending: 400,
        recommendedAction: "downgrade",
        recommendedPlan: "Pro",
        projectedMonthlyCost: 200,
        monthlySavings: 200,
        annualSavings: 2400,
        credexEligible: true,
        reason: "Over-provisioned"
      },
      {
        toolName: "GitHub Copilot",
        currentPlan: "Business",
        currentMonthlySpending: 190,
        recommendedAction: "keep",
        recommendedPlan: "Business",
        projectedMonthlyCost: 190,
        monthlySavings: 0,
        annualSavings: 0,
        credexEligible: true,
        reason: "Optimal"
      }
    ],
    totalMonthlySavings: 200,
    totalAnnualSavings: 2400,
    savingsCategory: "high"
  };

  it("should generate a valid fallback summary when savings are found", () => {
    const summary = generateFallbackSummary(mockInput, mockResults);
    expect(summary).toContain("10-person team");
    expect(summary).toContain("Cursor, GitHub Copilot");
    expect(summary).toContain("$200/month");
    expect(summary).toContain("The largest optimization opportunity is Cursor");
  });

  it("should generate a valid fallback summary for optimal state", () => {
    const optimalResults: AuditSummary = {
      ...mockResults,
      perTool: mockResults.perTool.map(t => ({ ...t, recommendedAction: "keep", monthlySavings: 0 })),
      totalMonthlySavings: 0,
      totalAnnualSavings: 0,
      savingsCategory: "optimal"
    };
    const summary = generateFallbackSummary(mockInput, optimalResults);
    expect(summary).toContain("relatively lean AI stack");
    expect(summary).toContain("no major optimization opportunities");
  });

  it("should handle mixed recommendations correctly", () => {
     const mixedResults: AuditSummary = {
      ...mockResults,
      perTool: [
        { ...mockResults.perTool[0], recommendedAction: "switch", recommendedPlan: "VS Code + Copilot", monthlySavings: 300 },
        { ...mockResults.perTool[1], recommendedAction: "consolidate", monthlySavings: 190 }
      ],
      totalMonthlySavings: 490,
      totalAnnualSavings: 5880,
      savingsCategory: "high"
    };
    const summary = generateFallbackSummary(mockInput, mixedResults);
    expect(summary).toContain("consolidating redundant tools");
    expect(summary).toContain("switching to more cost-effective alternatives");
  });
});
