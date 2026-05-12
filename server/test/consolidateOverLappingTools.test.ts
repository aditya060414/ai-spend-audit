import { describe, it, expect } from "vitest";
import { consolidateOverLappingTools } from "../services/audit/consolidateOverlap.js";
import { ToolAuditResult, AuditInput } from "../services/audit/types.js";

describe("consolidateOverLappingTools", () => {
  const mockInput: AuditInput = {
    teamSize: 1,
    useCases: "writing",
    tools: [
      { toolName: "Claude", currentPlan: "Pro", seats: 1, monthlyCost: 20 },
      { toolName: "ChatGPT", currentPlan: "Plus", seats: 1, monthlyCost: 20 }
    ]
  };

  const results: ToolAuditResult[] = [
    {
      toolName: "Claude",
      currentPlan: "Pro",
      currentMonthlySpending: 20,
      recommendedAction: "keep",
      recommendedPlan: "Pro",
      projectedMonthlyCost: 20,
      monthlySavings: 0,
      annualSavings: 0,
      credexEligible: true,
      reason: "Optimal"
    },
    {
      toolName: "ChatGPT",
      currentPlan: "Plus",
      currentMonthlySpending: 20,
      recommendedAction: "keep",
      recommendedPlan: "Plus",
      projectedMonthlyCost: 20,
      monthlySavings: 0,
      annualSavings: 0,
      credexEligible: true,
      reason: "Optimal"
    }
  ];

  it("should consolidate overlapping tools (e.g., Claude + ChatGPT)", () => {
    const consolidated = consolidateOverLappingTools(results, mockInput);
    
    const consolidatedTools = consolidated.filter(t => t.recommendedAction === "consolidate");
    expect(consolidatedTools.length).toBe(1);
    expect(consolidatedTools[0].monthlySavings).toBe(20);
    expect(consolidated.find(t => t.recommendedAction === "keep")).toBeDefined();
  });

  it("should consolidate Cursor + GitHub Copilot", () => {
    const cursorResults: ToolAuditResult[] = [
      { ...results[0], toolName: "Cursor" },
      { ...results[1], toolName: "GitHub Copilot" }
    ];
    const cursorInput = {
        ...mockInput,
        tools: [
            { toolName: "Cursor", currentPlan: "Pro", seats: 1, monthlyCost: 20 },
            { toolName: "GitHub Copilot", currentPlan: "Pro", seats: 1, monthlyCost: 10 }
        ]
    };
    
    const consolidated = consolidateOverLappingTools(cursorResults, cursorInput);
    expect(consolidated.some(t => t.recommendedAction === "consolidate")).toBe(true);
  });

  it("should not consolidate tools with different use cases", () => {
     const mixedResults: ToolAuditResult[] = [
      { ...results[0], toolName: "Cursor" },
      { ...results[1], toolName: "Jasper" } // Jasper is marketing, Cursor is coding
    ];
    const mixedInput = {
        ...mockInput,
        tools: [
            { toolName: "Cursor", currentPlan: "Pro", seats: 1, monthlyCost: 20 },
            { toolName: "Jasper", currentPlan: "Creator", seats: 1, monthlyCost: 49 }
        ]
    };
    
    const consolidated = consolidateOverLappingTools(mixedResults, mixedInput);
    expect(consolidated.every(t => t.recommendedAction !== "consolidate")).toBe(true);
  });
});
