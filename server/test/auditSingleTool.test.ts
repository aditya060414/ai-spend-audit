import { describe, it, expect } from "vitest";
import { auditSingleTool } from "../services/audit/auditSingleTool.js";
import { AuditInput } from "../services/audit/types.js";

describe("auditSingleTool", () => {
  const mockInput: AuditInput = {
    teamSize: 1,
    useCases: "coding",
    tools: []
  };

  it("should recommend 'keep' for optimal plans", () => {
    const tool = { toolName: "Cursor", currentPlan: "Pro", seats: 1, monthlyCost: 20 };
    const result = auditSingleTool(tool, mockInput);
    expect(result.recommendedAction).toBe("keep");
    expect(result.monthlySavings).toBe(0);
  });

  it("should recommend 'downgrade' if a cheaper plan exists", () => {
    const tool = { toolName: "GitHub Copilot", currentPlan: "Pro+", seats: 1, monthlyCost: 39 };
    const result = auditSingleTool(tool, mockInput);
    expect(result.recommendedAction).toBe("downgrade");
    expect(result.recommendedPlan).toBe("Pro");
    expect(result.monthlySavings).toBe(29);
  });

  it("should recommend 'upgrade' if usage intensity is high", () => {
    const tool = { toolName: "ChatGPT", currentPlan: "Plus", seats: 1, monthlyCost: 20, usageIntensity: "high" as const };
    const result = auditSingleTool(tool, mockInput);
    expect(result.recommendedAction).toBe("upgrade");
    expect(result.recommendedPlan).toBe("Pro");
  });

  it("should handle invalid tools safely", () => {
    const tool = { toolName: "UnknownAI", currentPlan: "Pro", seats: 1, monthlyCost: 50 };
    const result = auditSingleTool(tool, mockInput);
    expect(result.recommendedAction).toBe("keep");
    expect(result.reason).toContain("database");
  });

  it("should handle invalid plans safely", () => {
    const tool = { toolName: "ChatGPT", currentPlan: "Ultra Mega", seats: 1, monthlyCost: 100 };
    const result = auditSingleTool(tool, mockInput);
    expect(result.recommendedAction).toBe("keep");
    expect(result.reason).toContain("database");
  });

  it("should enforce seat limits", () => {
    // GH Copilot Pro has maxSeats 1. For 5 seats, it should recommend Business.
    const tool = { toolName: "GitHub Copilot", currentPlan: "Pro", seats: 5, monthlyCost: 50 };
    const result = auditSingleTool(tool, { ...mockInput, teamSize: 5 });
    expect(result.recommendedPlan).toBe("Business");
  });

  it("should handle custom pricing/enterprise plans as 'keep'", () => {
    const tool = { toolName: "Claude", currentPlan: "Enterprise", seats: 50, monthlyCost: 5000 };
    const result = auditSingleTool(tool, { ...mockInput, teamSize: 50 });
    expect(result.recommendedAction).toBe("keep");
  });
});
