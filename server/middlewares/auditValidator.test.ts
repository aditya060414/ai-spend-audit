// server/middlewares/auditValidator.test.ts
import { describe, it, expect } from 'vitest';
import { AuditInputSchema, LeadInputSchema, ToolInputSchema } from './auditValidator.js';

// ─────────────────────────────────────────────────────────────
// SUITE 1 — ToolInputSchema
// ─────────────────────────────────────────────────────────────
describe('ToolInputSchema', () => {
  it('accepts a valid tool input', () => {
    const result = ToolInputSchema.safeParse({
      toolName: 'Cursor',
      currentPlan: 'Business',
      seats: 5,
      monthlyCost: 200,
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty toolName', () => {
    const result = ToolInputSchema.safeParse({
      toolName: '',
      currentPlan: 'Pro',
      seats: 1,
      monthlyCost: 20,
    });
    expect(result.success).toBe(false);
  });

  it('rejects zero seats', () => {
    const result = ToolInputSchema.safeParse({
      toolName: 'Cursor',
      currentPlan: 'Pro',
      seats: 0,
      monthlyCost: 20,
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative monthlyCost', () => {
    const result = ToolInputSchema.safeParse({
      toolName: 'Cursor',
      currentPlan: 'Pro',
      seats: 1,
      monthlyCost: -10,
    });
    expect(result.success).toBe(false);
  });

  it('rejects seats exceeding 10000', () => {
    const result = ToolInputSchema.safeParse({
      toolName: 'Cursor',
      currentPlan: 'Business',
      seats: 99999,
      monthlyCost: 20,
    });
    expect(result.success).toBe(false);
  });

  it('accepts zero monthlyCost (free tools)', () => {
    const result = ToolInputSchema.safeParse({
      toolName: 'Cursor',
      currentPlan: 'Hobby',
      seats: 1,
      monthlyCost: 0,
    });
    expect(result.success).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────
// SUITE 2 — AuditInputSchema
// ─────────────────────────────────────────────────────────────
describe('AuditInputSchema', () => {
  const validInput = {
    teamSize: 10,
    useCases: 'coding',
    tools: [{ toolName: 'Cursor', currentPlan: 'Business', seats: 10, monthlyCost: 400 }],
  };

  it('accepts a valid audit input', () => {
    const result = AuditInputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('accepts all valid useCases enum values', () => {
    const validUseCases = ['coding', 'writing', 'data', 'research', 'mixed'];
    for (const useCase of validUseCases) {
      const result = AuditInputSchema.safeParse({ ...validInput, useCases: useCase });
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid useCases value', () => {
    const result = AuditInputSchema.safeParse({ ...validInput, useCases: 'gaming' });
    expect(result.success).toBe(false);
  });

  it('rejects teamSize of 0', () => {
    const result = AuditInputSchema.safeParse({ ...validInput, teamSize: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects negative teamSize', () => {
    const result = AuditInputSchema.safeParse({ ...validInput, teamSize: -5 });
    expect(result.success).toBe(false);
  });

  it('rejects empty tools array', () => {
    const result = AuditInputSchema.safeParse({ ...validInput, tools: [] });
    expect(result.success).toBe(false);
  });

  it('rejects when tools array exceeds 20 items', () => {
    const manyTools = Array.from({ length: 21 }, (_, i) => ({
      toolName: `Tool${i}`,
      currentPlan: 'Pro',
      seats: 1,
      monthlyCost: 20,
    }));
    const result = AuditInputSchema.safeParse({ ...validInput, tools: manyTools });
    expect(result.success).toBe(false);
  });

  it('accepts exactly 20 tools (at the limit)', () => {
    const tools = Array.from({ length: 20 }, (_, i) => ({
      toolName: `Tool${i}`,
      currentPlan: 'Pro',
      seats: 1,
      monthlyCost: 20,
    }));
    const result = AuditInputSchema.safeParse({ ...validInput, tools });
    expect(result.success).toBe(true);
  });

  it('rejects missing teamSize', () => {
    const { teamSize: _, ...rest } = validInput;
    const result = AuditInputSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('rejects non-integer teamSize', () => {
    const result = AuditInputSchema.safeParse({ ...validInput, teamSize: 5.5 });
    expect(result.success).toBe(false);
  });

  it('rejects missing tools field', () => {
    const { tools: _, ...rest } = validInput;
    const result = AuditInputSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// SUITE 3 — LeadInputSchema
// ─────────────────────────────────────────────────────────────
describe('LeadInputSchema', () => {
  const validLead = {
    shareId: 'abc1234567',
    email: 'user@company.com',
  };

  it('accepts a valid lead with just shareId and email', () => {
    const result = LeadInputSchema.safeParse(validLead);
    expect(result.success).toBe(true);
  });

  it('accepts a lead with optional companyName and role', () => {
    const result = LeadInputSchema.safeParse({
      ...validLead,
      companyName: 'Acme Corp',
      role: 'CTO',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email format', () => {
    const result = LeadInputSchema.safeParse({ ...validLead, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects missing email', () => {
    const { email: _, ...rest } = validLead;
    const result = LeadInputSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('rejects empty shareId', () => {
    const result = LeadInputSchema.safeParse({ ...validLead, shareId: '' });
    expect(result.success).toBe(false);
  });

  it('accepts honeypot website field without error (bot protection)', () => {
    // website is a honeypot — it's allowed in schema, just checked in route handler
    const result = LeadInputSchema.safeParse({ ...validLead, website: 'http://bot.com' });
    expect(result.success).toBe(true);
  });

  it('rejects missing shareId', () => {
    const { shareId: _, ...rest } = validLead;
    const result = LeadInputSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });
});
