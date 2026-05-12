import { ToolInput, AuditInput, ToolAuditResult } from "./types.js";
import { PRICING_DATA } from "./pricing/pricingData.js";
import { findPlan, findUpgradePlan, findFreePlan, findCheaperPlan } from "./pricing/pricingHelpers.js";
import { isHighIntensity, isLowIntensity } from "./usageEvaluator.js";

export function auditSingleTool(tool: ToolInput, input: AuditInput): ToolAuditResult {
  const toolDef = PRICING_DATA[tool.toolName];

  if (!toolDef) {
    const planLabel = tool.currentPlan || "unspecified plan";
    return {
      toolName: tool.toolName,
      currentPlan: tool.currentPlan || "Custom",
      currentMonthlySpending: tool.monthlyCost,
      recommendedAction: "keep",
      recommendedPlan: tool.currentPlan || "Custom",
      projectedMonthlyCost: tool.monthlyCost,
      monthlySavings: 0,
      annualSavings: 0,
      credexEligible: false,
      reason:
        `Your team is using ${tool.toolName} on the ${planLabel} tier for ${tool.seats} seat(s). ` +
        `Since ${tool.toolName} isn't in our verified database, we recommend keeping it at your current $${tool.monthlyCost}/month spend while you manually verify pricing.`,
    };
  }

  const currentPlanDef = findPlan(tool.toolName, tool.currentPlan);

  if (!currentPlanDef) {
    const planLabel = tool.currentPlan || "unspecified plan";
    return {
      toolName: tool.toolName,
      currentPlan: tool.currentPlan || "Custom",
      currentMonthlySpending: tool.monthlyCost,
      recommendedAction: "keep",
      recommendedPlan: tool.currentPlan || "Custom",
      projectedMonthlyCost: tool.monthlyCost,
      monthlySavings: 0,
      annualSavings: 0,
      credexEligible: false,
      reason:
        `You've entered ${tool.toolName} on a "${planLabel}" tier. ` +
        `While we recognize ${tool.toolName}, this specific plan isn't in our database yet. ` +
        `We've baselined your current $${tool.monthlyCost}/month spend as the optimal state until further data is available.`,
    };
  }

  if (currentPlanDef?.maxSeats && tool.seats > currentPlanDef.maxSeats) {
    const otherPlan = toolDef.plans.find((p) => {
      return (
        (!p.maxSeats || p.maxSeats >= tool.seats) &&
        (!p.minSeats || p.minSeats <= tool.seats)
      );
    });

    if (otherPlan) {
      const projectedMonthly = otherPlan.pricePerSeat * tool.seats;
      const monthlySavings = tool.monthlyCost - projectedMonthly;

      return {
        toolName: tool.toolName,
        currentPlan: tool.currentPlan,
        currentMonthlySpending: tool.monthlyCost,
        recommendedAction: monthlySavings > 0 ? "downgrade" : "keep",
        recommendedPlan: otherPlan.name,
        projectedMonthlyCost: projectedMonthly,
        monthlySavings: Math.max(0, monthlySavings),
        annualSavings: Math.max(0, monthlySavings * 12),
        credexEligible: false,
        reason:
          `Your current ${tool.currentPlan} plan supports a maximum of ${currentPlanDef.maxSeats} seat(s). ` +
          `With your team size of ${tool.seats}, the ${otherPlan.name} plan ($${otherPlan.pricePerSeat}/seat) ` +
          `is required, resulting in a $${projectedMonthly}/month cost.`,
      };
    }
  }

  if (isHighIntensity(tool)) {
    const upgrade = findUpgradePlan(tool.toolName, input.useCases, currentPlanDef, tool.seats);
    if (upgrade) {
      const projectedMonthly = upgrade.pricePerSeat * tool.seats;
      return {
        toolName: tool.toolName,
        currentPlan: tool.currentPlan,
        currentMonthlySpending: tool.monthlyCost,
        recommendedAction: "upgrade",
        recommendedPlan: upgrade.name,
        projectedMonthlyCost: projectedMonthly,
        monthlySavings: 0,
        annualSavings: 0,
        credexEligible: false,
        reason:
          `Your high usage intensity on ${tool.toolName} suggests you may be hitting rate limits or capacity constraints. ` +
          `Upgrading to the ${upgrade.name} plan ($${upgrade.pricePerSeat}/seat) will ensure uninterrupted service and higher performance.`,
      };
    } else {
      return {
        toolName: tool.toolName,
        currentPlan: tool.currentPlan,
        currentMonthlySpending: tool.monthlyCost,
        recommendedAction: "keep",
        recommendedPlan: tool.currentPlan,
        projectedMonthlyCost: tool.monthlyCost,
        monthlySavings: 0,
        annualSavings: 0,
        credexEligible: false,
        reason: `You are already on the highest tier for ${tool.toolName}. Given your high usage intensity, we recommend maintaining this plan to ensure maximum performance.`,
      };
    }
  } else if (isLowIntensity(tool)) {
    const freePlan = findFreePlan(tool.toolName, input.useCases, tool.seats);
    if (freePlan) {
      return {
        toolName: tool.toolName,
        currentPlan: tool.currentPlan,
        currentMonthlySpending: tool.monthlyCost,
        recommendedAction: "downgrade",
        recommendedPlan: freePlan.name,
        projectedMonthlyCost: 0,
        monthlySavings: tool.monthlyCost,
        annualSavings: tool.monthlyCost * 12,
        credexEligible: false,
        reason:
          `Based on your low usage intensity, you can likely satisfy your ${input.useCases} requirements with ` +
          `${tool.toolName}'s ${freePlan.name} tier, eliminating your monthly spend entirely.`,
      };
    }
  }

  const isUsageBased = ["Anthropic API", "OpenAI API", "Gemini API"].includes(tool.toolName);
  if (isUsageBased && currentPlanDef) {
    return {
      toolName: tool.toolName,
      currentPlan: tool.currentPlan,
      currentMonthlySpending: tool.monthlyCost,
      recommendedAction: "keep",
      recommendedPlan: tool.currentPlan,
      projectedMonthlyCost: tool.monthlyCost,
      monthlySavings: 0,
      annualSavings: 0,
      credexEligible: false,
      reason: `${tool.toolName} uses usage-based pricing. We've baselined your current $${tool.monthlyCost}/month spend while you monitor actual consumption.`,
    };
  }

  if (currentPlanDef) {
    const cheaper = findCheaperPlan(
      tool.toolName,
      input.useCases,
      currentPlanDef,
      tool.seats
    );

    if (cheaper) {
      const projectedMonthly = cheaper.pricePerSeat * tool.seats;
      const monthlySavings = tool.monthlyCost - projectedMonthly;
      if (monthlySavings > 0) {
        return {
          toolName: tool.toolName,
          currentPlan: tool.currentPlan,
          currentMonthlySpending: tool.monthlyCost,
          recommendedAction: "downgrade",
          recommendedPlan: cheaper.name,
          projectedMonthlyCost: projectedMonthly,
          monthlySavings: Math.max(0, monthlySavings),
          annualSavings: Math.max(0, monthlySavings * 12),
          credexEligible: false,
          reason:
            `You're paying $${currentPlanDef.pricePerSeat}/seat on the ${tool.currentPlan} plan. ` +
            `The ${cheaper.name} plan costs only $${cheaper.pricePerSeat}/seat and fully supports your ` +
            `${input.useCases} workflow for ${tool.seats} seat(s). ` +
            `Switching will save you $${monthlySavings}/month.`,
        };
      }
    }
  }
  
  return {
    toolName: tool.toolName,
    currentPlan: tool.currentPlan,
    currentMonthlySpending: tool.monthlyCost,
    recommendedAction: "keep",
    recommendedPlan: tool.currentPlan,
    projectedMonthlyCost: tool.monthlyCost,
    monthlySavings: 0,
    annualSavings: 0,
    credexEligible: false,
    reason:
      `The ${tool.currentPlan} plan ($${currentPlanDef.pricePerSeat}/seat) is ` +
      `the most cost-effective tier for your ${tool.seats} seat(s) and ${input.useCases} use case. ` +
      `Your current spend of $${tool.monthlyCost}/month is optimal.`,
  };
}
