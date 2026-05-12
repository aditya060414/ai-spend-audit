// Tests for AI summary generation and fallback logic
import { describe, it, expect } from "vitest";
import { generateAISummary, generateFallbackSummary } from "../services/openAIServices.js";
import type { AuditInput, AuditSummary } from "../services/auditEngine.js";

describe("AI Summary Generation & Fallback Logic", () => {
  const mockInput: AuditInput = {
    teamSize: 10,
    useCases: "coding",
    tools: [
      { toolName: "Cursor", currentPlan: "Business", seats: 10, monthlyCost: 400 },
      { toolName: "GitHub Copilot", currentPlan: "Business", seats: 10, monthlyCost: 190 }
    ]
  };

  const mockResults: AuditSummary = {
    perTool: [
      {
        toolName: "Cursor",
        currentPlan: "Business",
        currentMonthlySpending: 400,
        recommendedAction: "downgrade",
        recommendedPlan: "Pro",
        projectedMonthlyCost: 200,
        monthlySavings: 200,
        annualSavings: 2400,
        credexEligible: true,
        reason: "Over-provisioned"
      },
      {
        toolName: "GitHub Copilot",
        currentPlan: "Business",
        currentMonthlySpending: 190,
        recommendedAction: "keep",
        recommendedPlan: "Business",
        projectedMonthlyCost: 190,
        monthlySavings: 0,
        annualSavings: 0,
        credexEligible: true,
        reason: "Optimal"
      }
    ],
    totalMonthlySavings: 200,
    totalAnnualSavings: 2400,
    savingsCategory: "high"
  };

  it("should generate a valid fallback summary when savings are found", () => {
    const summary = generateFallbackSummary(mockInput, mockResults);
    expect(summary).toContain("10-person team");
    expect(summary).toContain("Cursor, GitHub Copilot");
    expect(summary).toContain("$200/month");
    expect(summary).toContain("The largest optimization opportunity is Cursor");
  });

  it("should generate a valid fallback summary for optimal state", () => {
    const optimalResults: AuditSummary = {
      ...mockResults,
      perTool: mockResults.perTool.map(t => ({ ...t, recommendedAction: "keep", monthlySavings: 0 })),
      totalMonthlySavings: 0,
      totalAnnualSavings: 0,
      savingsCategory: "optimal"
    };
    const summary = generateFallbackSummary(mockInput, optimalResults);
    expect(summary).toContain("relatively lean AI stack");
    expect(summary).toContain("no major optimization opportunities");
  });

  it("should return fallback summary if API key is missing", async () => {
    const originalKey = process.env.OPENROUTER_API_KEY;
    delete process.env.OPENROUTER_API_KEY;

    const result = await generateAISummary(mockInput, mockResults);
    expect(result.wasFallback).toBe(true);
    expect(result.summary).toContain("10-person team");

    process.env.OPENROUTER_API_KEY = originalKey;
  });

  it("should return fallback summary if AI generation fails", async () => {
    // With lazy init, we can set a dummy key to trigger the catch block without crashing the import
    process.env.OPENROUTER_API_KEY = "dummy-key";
    
    // The actual API call will fail (incorrect key/model or no network),
    // and generateAISummary should catch it and return fallback.
    const result = await generateAISummary(mockInput, mockResults);
    expect(result.wasFallback).toBe(true);
    expect(result.summary).toBeDefined();
  });
});
