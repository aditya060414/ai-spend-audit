import { ToolAuditResult } from "./types.js";

export function compareToolSavings(a: ToolAuditResult, b: ToolAuditResult): number {
  return b.monthlySavings - a.monthlySavings;
}

export function isMoreEfficient(current: ToolAuditResult, proposed: ToolAuditResult): boolean {
  return proposed.projectedMonthlyCost < current.projectedMonthlyCost;
}
