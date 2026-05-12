import { ToolAuditResult, AuditInput } from "./types.js";

export const OVERLAP_GROUPS: string[][] = [
  ["Cursor", "Windsurf"],
  ["Cursor", "GitHub Copilot"],
  ["Windsurf", "GitHub Copilot"],
  ["Claude", "ChatGPT"],
  ["Claude", "Gemini"],
  ["ChatGPT", "Gemini"],
  ["Anthropic API", "OpenAI API"],
  ["Anthropic API", "Claude"],
  ["OpenAI API", "ChatGPT"],
  ["Gemini API", "Gemini"],
];

export function consolidateOverLappingTools(
  results: ToolAuditResult[],
  input: AuditInput
): ToolAuditResult[] {
  const updated = results.map((r) => ({ ...r }));
  const presentToolName = input.tools.map((t) => t.toolName);

  for (const group of OVERLAP_GROUPS) {
    const present = group.filter((name) => presentToolName.includes(name));
    if (present.length <= 1) continue;

    const groupResults = present
      .map((name) => updated.find((r) => r.toolName === name)!)
      .sort((a, b) => b.currentMonthlySpending - a.currentMonthlySpending);

    const mostExpensive = groupResults[0];
    const lessExpensive = groupResults[1];

    const idx = updated.findIndex((r) => r.toolName === mostExpensive.toolName);
    
    // Check if the current action allows consolidation (don't override certain actions)
    const allowedActions = ["keep", "switch", "downgrade", "credits"];
    if (!allowedActions.includes(updated[idx].recommendedAction)) {
      continue;
    }

    updated[idx] = {
      ...updated[idx],
      recommendedAction: "consolidate",
      recommendedPlan: lessExpensive.toolName,
      projectedMonthlyCost: 0,
      monthlySavings: Number(mostExpensive.currentMonthlySpending) || 0,
      annualSavings: (Number(mostExpensive.currentMonthlySpending) || 0) * 12,
      reason:
        `${mostExpensive.toolName} and ${lessExpensive.toolName} both provide ` +
        `overlapping AI assistance for your ${input.useCases} workflow. ` +
        `Eliminating ${mostExpensive.toolName} saves $${mostExpensive.currentMonthlySpending}/month ` +
        `($${(mostExpensive.currentMonthlySpending * 12).toLocaleString()}/year) without capability loss.`,
    };
  }
  return updated;
}
