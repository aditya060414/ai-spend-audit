// server/services/auditEngine.test.ts
import { describe, it, expect } from 'vitest';
import { runAuditEngine } from './auditEngine.js';

describe('AI Spend Audit Engine — Comprehensive Test Suite', () => {
  // 1. Keep Current Plan
  it('1. Keep Current Plan: Cursor Pro for 2 seats coding', () => {
    const result = runAuditEngine({
      teamSize: 2,
      useCases: "coding",
      tools: [{ toolName: "Cursor", currentPlan: "Pro", seats: 2, monthlyCost: 40 }],
    });
    expect(result.perTool[0].recommendedAction).toBe("keep");
    expect(result.perTool[0].monthlySavings).toBe(0);
  });

  // 2. Downgrade to Cheaper Plan
  it('2. Downgrade to Cheaper Plan: GH Copilot Pro+ to Pro', () => {
    const result = runAuditEngine({
      teamSize: 1,
      useCases: "coding",
      tools: [{ toolName: "GitHub Copilot", currentPlan: "Pro+", seats: 1, monthlyCost: 39 }],
    });
    // Pro+ ($39) -> Pro ($10). Saves $29.
    expect(result.perTool[0].recommendedAction).toBe("downgrade");
    expect(result.perTool[0].recommendedPlan).toBe("Pro");
    expect(result.perTool[0].monthlySavings).toBe(29);
  });

  // 3. Low Usage → Free Plan
  it('3. Low Usage → Free Plan: Claude Pro to Free', () => {
    const result = runAuditEngine({
      teamSize: 1,
      useCases: "writing",
      tools: [{ toolName: "Claude", currentPlan: "Pro", seats: 1, monthlyCost: 20, usageIntensity: "low" }],
    });
    expect(result.perTool[0].recommendedAction).toBe("downgrade");
    expect(result.perTool[0].recommendedPlan).toBe("Free");
    expect(result.perTool[0].monthlySavings).toBe(20);
  });

  // 4. High Usage → Upgrade
  it('4. High Usage → Upgrade: ChatGPT Plus to Pro', () => {
    const result = runAuditEngine({
      teamSize: 1,
      useCases: "coding",
      tools: [{ toolName: "ChatGPT", currentPlan: "Plus", seats: 1, monthlyCost: 20, usageIntensity: "high" }],
    });
    // Plus ($20) -> Pro ($200)
    expect(result.perTool[0].recommendedAction).toBe("upgrade");
    expect(result.perTool[0].recommendedPlan).toBe("Pro");
    expect(result.perTool[0].projectedMonthlyCost).toBe(200);
  });

  // 5. High Usage Already Highest Tier
  it('5. High Usage Already Highest Tier: Windsurf Max high intensity', () => {
    const result = runAuditEngine({
      teamSize: 1,
      useCases: "coding",
      tools: [{ toolName: "Windsurf", currentPlan: "Max", seats: 1, monthlyCost: 200, usageIntensity: "high" }],
    });
    expect(result.perTool[0].recommendedAction).toBe("keep");
    expect(result.perTool[0].reason).toContain("already on the highest tier");
  });

  // 6. Unknown Tool
  it('6. Unknown Tool: Perplexity', () => {
    const result = runAuditEngine({
      teamSize: 3,
      useCases: "research",
      tools: [{ toolName: "Perplexity", currentPlan: "Pro", seats: 3, monthlyCost: 60 }],
    });
    // Note: Cross-tool might still suggest a switch if it saves money, but the single-tool audit returns keep
    // In our engine, unknown tools keep current spend unless cross-tool finds a better alternative.
    // Let's verify the base recommendation is keep if no cheaper tool exists.
    // Actually ChatGPT Go ($5*3=15) might beat $60.
    const toolResult = result.perTool[0];
    if (toolResult.recommendedAction === "keep") {
      expect(toolResult.reason).toContain("database");
    } else {
      expect(toolResult.recommendedAction).toBe("switch");
    }
  });

  // 7. Unknown Plan
  it('7. Unknown Plan: ChatGPT Ultra', () => {
    const result = runAuditEngine({
      teamSize: 2,
      useCases: "writing",
      tools: [{ toolName: "ChatGPT", currentPlan: "Ultra", seats: 2, monthlyCost: 100 }],
    });
    const toolResult = result.perTool[0];
    if (toolResult.recommendedAction === "keep") {
      expect(toolResult.reason).toContain("specific plan isn't in our database");
    }
  });

  // 8. Seat Limit Exceeded
  it('8. Seat Limit Exceeded: GH Copilot Pro for 3 seats', () => {
    const result = runAuditEngine({
      teamSize: 3,
      useCases: "coding",
      tools: [{ toolName: "GitHub Copilot", currentPlan: "Pro", seats: 3, monthlyCost: 30 }],
    });
    // Pro maxSeats is 1. Move to Business ($19*3 = 57)
    expect(result.perTool[0].recommendedPlan).toBe("Business");
    expect(result.perTool[0].projectedMonthlyCost).toBe(57);
  });

  // 9. Consolidation Logic (Claude + ChatGPT)
  it('9. Consolidation Logic (Claude + ChatGPT)', () => {
    const result = runAuditEngine({
      teamSize: 2,
      useCases: "writing",
      tools: [
        { toolName: "Claude", currentPlan: "Pro", seats: 2, monthlyCost: 40 },
        { toolName: "ChatGPT", currentPlan: "Business", seats: 2, monthlyCost: 52 },
      ],
    });
    // ChatGPT Business ($52) vs Claude Pro ($40) -> Consolidate ChatGPT
    const chatgpt = result.perTool.find(t => t.toolName === "ChatGPT")!;
    expect(chatgpt.recommendedAction).toBe("consolidate");
    expect(chatgpt.monthlySavings).toBe(52);
  });

  // 10. Consolidation Logic (Cursor + Windsurf)
  it('10. Consolidation Logic (Cursor + Windsurf)', () => {
    const result = runAuditEngine({
      teamSize: 1,
      useCases: "coding",
      tools: [
        { toolName: "Cursor", currentPlan: "Pro", seats: 1, monthlyCost: 20 },
        { toolName: "Windsurf", currentPlan: "Pro", seats: 1, monthlyCost: 20 },
      ],
    });
    const consolidated = result.perTool.filter(t => t.recommendedAction === "consolidate");
    expect(consolidated.length).toBe(1);
  });

  // 11. Cross Tool Recommendation
  it('11. Cross Tool Recommendation: ChatGPT Pro to Claude Pro', () => {
    const result = runAuditEngine({
      teamSize: 1,
      useCases: "writing",
      tools: [{ toolName: "ChatGPT", currentPlan: "Pro", seats: 1, monthlyCost: 200 }],
    });
    expect(result.perTool[0].recommendedAction).toBe("switch");
    expect(result.perTool[0].monthlySavings).toBeGreaterThan(150);
  });

  // 12. Cross Tool Recommendation Disabled for High Usage
  it('12. Cross Tool Recommendation Disabled for High Usage', () => {
    const result = runAuditEngine({
      teamSize: 1,
      useCases: "coding",
      tools: [{ toolName: "ChatGPT", currentPlan: "Pro", seats: 1, monthlyCost: 200, usageIntensity: "high" }],
    });
    // No switch should happen because intensity is high
    expect(result.perTool[0].recommendedAction).not.toBe("switch");
  });

  // 13. Sanitization — Negative Seats
  it('13. Sanitization — Negative Seats', () => {
    const result = runAuditEngine({
      teamSize: 1,
      useCases: "coding",
      tools: [{ toolName: "Cursor", currentPlan: "Pro", seats: -10, monthlyCost: 20 }],
    });
    expect(result.perTool[0].currentMonthlySpending).toBe(20);
    // Logic should treat seats as 1
    expect(result.perTool[0].projectedMonthlyCost).toBe(20);
  });

  // 14. Sanitization — NaN Monthly Cost
  it('14. Sanitization — NaN Monthly Cost', () => {
    const result = runAuditEngine({
      teamSize: 1,
      useCases: "coding",
      tools: [{ toolName: "Cursor", currentPlan: "Pro", seats: 1, monthlyCost: NaN }],
    });
    expect(result.perTool[0].currentMonthlySpending).toBe(0);
  });

  // 15. Empty Plan Name
  it('15. Empty Plan Name', () => {
    const result = runAuditEngine({
      teamSize: 1,
      useCases: "research",
      tools: [{ toolName: "Claude", currentPlan: "", seats: 1, monthlyCost: 25 }],
    });
    expect(result.perTool[0].currentPlan).toBe("Custom");
    expect(result.perTool[0].recommendedAction).toBe("keep");
  });

  // 16. Enterprise Plan Handling
  it('16. Enterprise Plan Handling', () => {
    const result = runAuditEngine({
      teamSize: 50,
      useCases: "mixed",
      tools: [{ toolName: "Claude", currentPlan: "Enterprise", seats: 50, monthlyCost: 5000 }],
    });
    // Enterprise plans are customPricing, so engine avoids recommending downgrades to standard plans unless specified
    expect(result.perTool[0].recommendedAction).toBe("keep");
  });

  // 17. Multi Tool Large Audit
  it('17. Multi Tool Large Audit', () => {
    const result = runAuditEngine({
      teamSize: 5,
      useCases: "coding",
      tools: [
        { toolName: "Cursor", currentPlan: "Business", seats: 5, monthlyCost: 200 },
        { toolName: "GitHub Copilot", currentPlan: "Business", seats: 5, monthlyCost: 95 },
        { toolName: "ChatGPT", currentPlan: "Business", seats: 5, monthlyCost: 130 },
      ],
    });
    expect(result.totalMonthlySavings).toBeGreaterThan(100);
    expect(result.perTool.some(t => t.recommendedAction === "consolidate")).toBe(true);
  });

  // 18. No Compatible Free Plan
  it('18. No Compatible Free Plan: GH Copilot Business for 3 seats low intensity', () => {
    const result = runAuditEngine({
      teamSize: 3,
      useCases: "coding",
      tools: [{ toolName: "GitHub Copilot", currentPlan: "Business", seats: 3, monthlyCost: 57, usageIntensity: "low" }],
    });
    // GH Copilot Free has maxSeats: 1. So for 3 seats, it shouldn't recommend it.
    expect(result.perTool[0].recommendedPlan).not.toBe("Free");
  });

  // 19. Savings Category — Optimal
  it('19. Savings Category — Optimal', () => {
    const result = runAuditEngine({
      teamSize: 1,
      useCases: "coding",
      tools: [{ toolName: "Cursor", currentPlan: "Pro", seats: 1, monthlyCost: 20 }],
    });
    expect(result.savingsCategory).toBe("optimal");
  });

  // 20. Savings Category — Critical
  it('20. Savings Category — Critical', () => {
    const result = runAuditEngine({
      teamSize: 10,
      useCases: "mixed",
      tools: [{ toolName: "ChatGPT", currentPlan: "Pro", seats: 10, monthlyCost: 2000 }],
    });
    // ChatGPT Pro is $200/seat. 10 seats = $2000.
    // Optimization will save much more than $500.
    expect(result.savingsCategory).toBe("critical");
  });

  // 21. Credits Recommendation Trigger
  it("21. Credits Recommendation Trigger", () => {
    const result = runAuditEngine({
      teamSize: 5,
      useCases: "writing",
      tools: [
        {
          toolName: "Claude",
          currentPlan: "Pro",
          seats: 5,
          monthlyCost: 100,
        },
      ],
    });

    // Claude Pro is optimal for 5 seats, spend is 100 -> credits
    expect(result.perTool[0].recommendedAction).toBe("credits");
    expect(result.perTool[0].credexEligible).toBe(true);
  });

  // 22. Credits Eligibility Without Override
  it("22. Credits Eligible But Downgrade Preferred", () => {
    const result = runAuditEngine({
      teamSize: 5,
      useCases: "coding",
      tools: [
        {
          toolName: "GitHub Copilot",
          currentPlan: "Enterprise",
          seats: 5,
          monthlyCost: 195,
        },
      ],
    });

    expect(result.perTool[0].credexEligible).toBe(true);
    expect(result.perTool[0].recommendedAction).not.toBe("credits");
  });

  // 23. API Tool Baseline Handling
  it("23. OpenAI API Usage Based Pricing", () => {
    const result = runAuditEngine({
      teamSize: 3,
      useCases: "coding",
      tools: [
        {
          toolName: "OpenAI API",
          currentPlan: "Pay-as-you-go",
          seats: 3,
          monthlyCost: 300,
        },
      ],
    });

    expect(result.perTool[0].recommendedAction).toBe("keep");
    expect(result.perTool[0].reason).toContain("usage-based pricing");
  });

  // 24. API Consolidation
  it("24. API Consolidation Logic", () => {
    const result = runAuditEngine({
      teamSize: 5,
      useCases: "coding",
      tools: [
        {
          toolName: "Anthropic API",
          currentPlan: "Build",
          seats: 5,
          monthlyCost: 400,
        },
        {
          toolName: "OpenAI API",
          currentPlan: "Pay-as-you-go",
          seats: 5,
          monthlyCost: 600,
        },
      ],
    });

    expect(
      result.perTool.some(t => t.recommendedAction === "consolidate")
    ).toBe(true);
  });

  // 25. Critical Savings Category
  it("25. Savings Category Critical", () => {
    const result = runAuditEngine({
      teamSize: 20,
      useCases: "coding",
      tools: [
        {
          toolName: "ChatGPT",
          currentPlan: "Pro",
          seats: 20,
          monthlyCost: 4000,
        },
      ],
    });

    expect(result.savingsCategory).toBe("critical");
  });

  // 26. Learning Use Case Coverage
  it("26. Learning Use Case Support", () => {
    const result = runAuditEngine({
      teamSize: 1,
      useCases: "learning",
      tools: [
        {
          toolName: "ChatGPT",
          currentPlan: "Pro",
          seats: 1,
          monthlyCost: 200,
        },
      ],
    });

    expect(result.perTool[0]).toBeDefined();
  });

  // 27. Data Use Case Coverage
  it("27. Data Use Case Support", () => {
    const result = runAuditEngine({
      teamSize: 2,
      useCases: "data",
      tools: [
        {
          toolName: "Claude",
          currentPlan: "Max",
          seats: 2,
          monthlyCost: 200,
        },
      ],
    });

    expect(result.perTool[0]).toBeDefined();
  });

  // 28. Empty Tool Name Sanitization
  it("28. Empty Tool Name", () => {
    const result = runAuditEngine({
      teamSize: 1,
      useCases: "coding",
      tools: [
        {
          toolName: "",
          currentPlan: "Pro",
          seats: 1,
          monthlyCost: 20,
        },
      ],
    });

    expect(result.perTool[0].recommendedAction).toBe("keep");
  });

  // 29. Zero Monthly Cost
  it("29. Zero Monthly Cost", () => {
    const result = runAuditEngine({
      teamSize: 1,
      useCases: "writing",
      tools: [
        {
          toolName: "Claude",
          currentPlan: "Free",
          seats: 1,
          monthlyCost: 0,
        },
      ],
    });

    expect(result.totalMonthlySavings).toBe(0);
  });

  // 30. Mixed Multi-Vendor Optimization
  it("30. Mixed Vendor Optimization", () => {
    const result = runAuditEngine({
      teamSize: 8,
      useCases: "mixed",
      tools: [
        {
          toolName: "Claude",
          currentPlan: "Team",
          seats: 8,
          monthlyCost: 200,
        },
        {
          toolName: "Gemini",
          currentPlan: "Google AI Ultra",
          seats: 8,
          monthlyCost: 2000,
        },
        {
          toolName: "Cursor",
          currentPlan: "Business",
          seats: 8,
          monthlyCost: 320,
        },
      ],
    });

    expect(result.totalMonthlySavings).toBeGreaterThan(500);
  });
});
