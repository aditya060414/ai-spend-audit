import { ToolAuditResult, ToolInput, AuditInput } from "./types.js";
import { PRICING_DATA } from "./pricing/pricingData.js";
import { findPlan } from "./pricing/pricingHelpers.js";
import { isMoreEfficient } from "./toolComparisons.js";
import { isHighIntensity } from "./usageEvaluator.js";

export function crossToolRecommendation(
  currentResult: ToolAuditResult,
  toolInput: ToolInput,
  auditInput: AuditInput
): ToolAuditResult {
  if (isHighIntensity(toolInput)) return currentResult;

  // using helper to find plan
  const currentPlanDef = findPlan(toolInput.toolName, toolInput.currentPlan);
  if (currentPlanDef?.customPricing || toolInput.currentPlan === "Custom") {
    return currentResult;
  }

  const currentSavings = currentResult.monthlySavings;
  const userUseCases = auditInput.useCases;
  const seats = toolInput.seats;
  const userCurrentTools = auditInput.tools.map((t) => t.toolName.toLowerCase());

  let bestSwitch: ToolAuditResult | null = null;
  let maxSavings = currentSavings;

  for (const [otherToolName, otherToolDef] of Object.entries(PRICING_DATA)) {
    if (otherToolName.toLowerCase() === toolInput.toolName.toLowerCase()) continue;
    if (userCurrentTools.includes(otherToolName.toLowerCase())) continue;

    for (const plan of otherToolDef.plans) {
      if (plan.customPricing || plan.pricePerSeat === 0) continue;

      const compatible =
        (!plan.minSeats || plan.minSeats <= seats) &&
        (!plan.maxSeats || plan.maxSeats >= seats);

      const useCaseFit =
        plan.useCases.includes(userUseCases) || plan.useCases.includes("mixed");

      if (compatible && useCaseFit) {
        const projectedMonthly = plan.pricePerSeat * seats;
        const monthlySavings = toolInput.monthlyCost - projectedMonthly;

        const isBetterSavings = monthlySavings > maxSavings;
        const isEqualButCheaper =
          monthlySavings === maxSavings &&
          (!bestSwitch || isMoreEfficient(bestSwitch, { projectedMonthlyCost: projectedMonthly } as ToolAuditResult));

        if (monthlySavings >= 20 && (isBetterSavings || isEqualButCheaper)) {
          maxSavings = monthlySavings;
          bestSwitch = {
            toolName: toolInput.toolName,
            currentPlan: toolInput.currentPlan,
            currentMonthlySpending: toolInput.monthlyCost,
            recommendedAction: "switch",
            recommendedPlan: `${otherToolName} (${plan.name})`,
            projectedMonthlyCost: projectedMonthly,
            monthlySavings: Math.max(0, monthlySavings),
            annualSavings: Math.max(0, monthlySavings * 12),
            credexEligible: false,
            reason:
              `While ${toolInput.toolName} is useful, ${otherToolName}'s ${plan.name} plan costs only $${plan.pricePerSeat}/seat ` +
              `and fully supports your ${userUseCases} workflow for ${seats} seat(s). ` +
              `Switching provides a superior optimization of $${monthlySavings}/month compared to your current spend.`,
          };
        }
      }
    }
  }

  return bestSwitch || currentResult;
}

export function checkCreditsRecommendation(
  result: ToolAuditResult,
  tool: ToolInput
): ToolAuditResult {
  const isEligible = tool.monthlyCost >= 50;
  const updated = { ...result, credexEligible: isEligible };

  const currentPlanDef = findPlan(tool.toolName, tool.currentPlan);
  const isCustomPlan = currentPlanDef?.customPricing === true;

  const isSpecialKeep =
    result.reason.includes("already on the highest tier") ||
    result.reason.includes("usage-based pricing") ||
    result.reason.includes("isn't in our verified database") ||
    result.reason.includes("specific plan isn't in our database") ||
    isCustomPlan;

  if (
    result.recommendedAction === "keep" &&
    tool.monthlyCost >= 100 &&
    !isSpecialKeep
  ) {
    return {
      ...updated,
      recommendedAction: "credits",
      reason: `You're paying retail for ${tool.toolName}. Credex offers discounted credits for this tool — teams at this spend level typically save 20–30% without changing their workflow.`,
    };
  }

  return updated;
}
