import { AuditInput, AuditSummary, ToolAuditResult } from "./types.js";
import { auditSingleTool } from "./auditSingleTool.js";
import { crossToolRecommendation, checkCreditsRecommendation } from "./recommendationEngine.js";
import { consolidateOverLappingTools } from "./consolidateOverlap.js";
import { getSavingsCategory } from "./qualificationEngine.js";
import { calculateTotalMonthlySavings, calculateTotalAnnualSavings } from "./calculateSavings.js";
import { compareToolSavings } from "./toolComparisons.js";

export function runAuditEngine(input: AuditInput): AuditSummary {
  // Sanitize all numeric fields to prevent NaN propagation
  const sanitizedTools = input.tools.map((t) => {
    const seats = Math.max(1, Number(t.seats) || 1);
    const monthlyCost = Math.max(0, Number(t.monthlyCost) || 0);
    return {
      ...t,
      seats,
      monthlyCost,
      currentPlan: (t.currentPlan ?? "").trim() || "Custom",
      toolName: (t.toolName ?? "").trim(),
    };
  });

  const sanitizedInput: AuditInput = { ...input, tools: sanitizedTools };

  // 1. Initial audit for each tool
  let perTool = sanitizedInput.tools.map((tool) => auditSingleTool(tool, sanitizedInput));

  // 2. Cross-tool recommendations
  perTool = perTool.map((res, idx) => {
    const tool = sanitizedInput.tools[idx];

    // For high-spend tools (>= $150/month), allow cross-tool switch regardless of current action
    if (tool.monthlyCost >= 150) {
      const baselineResult: ToolAuditResult = {
        ...res,
        recommendedAction: "keep",
        monthlySavings: 0,
        annualSavings: 0,
      };
      const crossToolResult = crossToolRecommendation(baselineResult, tool, sanitizedInput);
      if (crossToolResult.recommendedAction === "switch") {
        return crossToolResult;
      }
      return res;
    }

    if (res.recommendedAction === "keep") {
      return crossToolRecommendation(res, tool, sanitizedInput);
    }

    return res;
  });

  // 3. Credex credit savings
  perTool = perTool.map((res, idx) => checkCreditsRecommendation(res, sanitizedInput.tools[idx]));

  // 4. Consolidate overlaps
  perTool = consolidateOverLappingTools(perTool, sanitizedInput);

  // 5. Final sanitization of results
  perTool = perTool.map((t) => ({
    ...t,
    currentMonthlySpending: Number(t.currentMonthlySpending) || 0,
    projectedMonthlyCost: Number(t.projectedMonthlyCost) || 0,
    monthlySavings: Math.max(0, Number(t.monthlySavings) || 0),
    annualSavings: Math.max(0, Number(t.annualSavings) || 0),
  })).sort(compareToolSavings);

  const totalMonthlySavings = calculateTotalMonthlySavings(perTool);
  const totalAnnualSavings = calculateTotalAnnualSavings(perTool);
  const savingsCategory = getSavingsCategory(totalMonthlySavings);

  return {
    perTool,
    totalMonthlySavings,
    totalAnnualSavings,
    savingsCategory,
  };
}
