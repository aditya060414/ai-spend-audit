import { ToolAuditResult } from "./types.js";

export function calculateTotalMonthlySavings(results: ToolAuditResult[]): number {
  return results.reduce((sum, t) => sum + (Number(t.monthlySavings) || 0), 0);
}

export function calculateTotalAnnualSavings(results: ToolAuditResult[]): number {
  return results.reduce((sum, t) => sum + (Number(t.annualSavings) || 0), 0);
}

export function sanitizeSavings(value: number): number {
  return Math.max(0, Number(value) || 0);
}
