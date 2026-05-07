// server/src/auditEngine/auditEngine.test.ts
import { describe, it, expect } from 'vitest';
import { runAuditEngine } from './auditEngine.js';

// Test 1 — Optimal: no savings for a correctly-sized plan
it('returns optimal for correctly-priced single seat Cursor Pro', () => {
  const result = runAuditEngine({
    teamSize: 1,
    useCases: 'coding',
    tools: [{ toolName: 'Cursor', currentPlan: 'Pro', seats: 1, monthlyCost: 20 }],
  });
  expect(result.totalMonthlySavings).toBe(0);
  expect(result.savingsCategory).toBe('optimal');
  expect(result.perTool[0].recommendedAction).toBe('keep');
});

// Test 2 — Downgrade: Claude Team → Pro for 2-person writing team
// Claude Team = $30/seat, Pro = $20/seat
// 2 seats: Team=$60, Pro=$40 → savings=$20/month, $240/year
it('flags Claude Team as overspend for 2-person writing team', () => {
  const result = runAuditEngine({
    teamSize: 2,
    useCases: 'writing',
    tools: [{ toolName: 'Claude', currentPlan: 'Team', seats: 2, monthlyCost: 60 }],
  });
  expect(result.perTool[0].recommendedAction).toBe('downgrade');
  expect(result.perTool[0].recommendedPlan).toBe('Pro');
  expect(result.perTool[0].monthlySavings).toBe(20);   // $30-$20 = $10 × 2 seats
  expect(result.perTool[0].annualSavings).toBe(240);
  expect(result.totalMonthlySavings).toBe(20);
  expect(result.savingsCategory).toBe('low');
});

// Test 3 — Consolidation: Cursor + GitHub Copilot overlap
// Both provide AI code completion. More expensive one gets flagged.
it('consolidates overlapping Cursor Business + GitHub Copilot Business', () => {
  const result = runAuditEngine({
    teamSize: 5,
    useCases: 'coding',
    tools: [
      { toolName: 'Cursor',         currentPlan: 'Business', seats: 5, monthlyCost: 200 },
      { toolName: 'GitHub Copilot', currentPlan: 'Business', seats: 5, monthlyCost: 95 },
    ],
  });
  const cursorResult = result.perTool.find((t) => t.toolName === 'Cursor')!;
  expect(cursorResult.recommendedAction).toBe('consolidate');
  // Savings = entire Cursor spend ($200), since it gets eliminated
  expect(cursorResult.monthlySavings).toBe(200);
  expect(result.totalMonthlySavings).toBeGreaterThan(0);
});

// Test 4 — High savings category triggers at >$500/month
it('returns high savings category for large team overspend', () => {
  const result = runAuditEngine({
    teamSize: 20,
    useCases: 'coding',
    tools: [
      // Cursor Business $40/seat × 20 = $800. Pro $20/seat × 20 = $400. Saves $400.
      { toolName: 'Cursor',         currentPlan: 'Business', seats: 20, monthlyCost: 800 },
      // GitHub Copilot Enterprise $39/seat × 20 = $780. Business $19/seat = $380. Saves $400.
      { toolName: 'GitHub Copilot', currentPlan: 'Enterprise', seats: 20, monthlyCost: 780 },
    ],
  });
  expect(result.savingsCategory).toBe('high');
  expect(result.totalMonthlySavings).toBeGreaterThan(500);
});

// Test 5 — Annual is always exactly 12× monthly
it('annual savings equals 12x monthly savings', () => {
  const result = runAuditEngine({
    teamSize: 3,
    useCases: 'writing',
    // Claude Max $100/seat × 3 = $300. Pro $20/seat × 3 = $60. Saves $240/month.
    tools: [{ toolName: 'Claude', currentPlan: 'Max', seats: 3, monthlyCost: 300 }],
  });
  expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  expect(result.perTool[0].annualSavings).toBe(result.perTool[0].monthlySavings * 12);
});

// Test 6 — Unknown tool: no crash, no manufactured savings
it('handles unknown tools gracefully without manufacturing savings', () => {
  const result = runAuditEngine({
    teamSize: 2,
    useCases: 'mixed',
    tools: [{ toolName: 'SomeRandomTool', currentPlan: 'Pro', seats: 2, monthlyCost: 50 }],
  });
  expect(result.perTool[0].recommendedAction).toBe('keep');
  expect(result.perTool[0].monthlySavings).toBe(0);
});

// Test 7 — Honest: no savings when already on cheapest plan
it('does not manufacture savings when team is on correct plan', () => {
  const result = runAuditEngine({
    teamSize: 1,
    useCases: 'coding',
    // GitHub Copilot Individual is $10/seat — already the cheapest paid plan
    tools: [{ toolName: 'GitHub Copilot', currentPlan: 'Individual', seats: 1, monthlyCost: 10 }],
  });
  expect(result.perTool[0].recommendedAction).toBe('keep');
  expect(result.perTool[0].monthlySavings).toBe(0);
  expect(result.savingsCategory).toBe('optimal');
});