import { ToolAuditResult, ToolInput, AuditInput } from "../types.js";

export function applyClaudeRules(
  currentResult: ToolAuditResult,
  _tool: ToolInput,
  _input: AuditInput
): ToolAuditResult {
  return currentResult;
}
