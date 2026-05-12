import { ToolInput } from "./types.js";

export function evaluateUsageIntensity(tool: ToolInput): "low" | "medium" | "high" {
  if (!tool.usageIntensity) return "medium";
  return tool.usageIntensity;
}

export function isHighIntensity(tool: ToolInput): boolean {
  return evaluateUsageIntensity(tool) === "high";
}

export function isLowIntensity(tool: ToolInput): boolean {
  return evaluateUsageIntensity(tool) === "low";
}
