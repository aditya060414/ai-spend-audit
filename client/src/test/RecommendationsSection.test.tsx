// client/src/test/RecommendationsSection.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecommendationsSection } from '../components/RecommendationsSection';
import type { ToolAuditResult } from '../types';

const makeToolResult = (overrides: Partial<ToolAuditResult> = {}): ToolAuditResult => ({
  toolName: 'Cursor',
  currentPlan: 'Business',
  currentMonthlySpending: 200,
  recommendedAction: 'downgrade',
  recommendedPlan: 'Pro',
  projectedMonthlyCost: 100,
  monthlySavings: 100,
  annualSavings: 1200,
  reason: 'Business costs more than Pro for this use case.',
  ...overrides,
});

describe('RecommendationsSection', () => {
  it('renders the section heading when there are actionable recommendations', () => {
    render(<RecommendationsSection tools={[makeToolResult()]} />);
    expect(screen.getByText('Optimization Recommendations')).toBeInTheDocument();
  });

  it('shows the correct number of action badges', () => {
    render(<RecommendationsSection tools={[makeToolResult()]} />);
    expect(screen.getByText('1 action required')).toBeInTheDocument();
  });

  it('shows plural "actions" for multiple recommendations', () => {
    const tools = [
      makeToolResult({ toolName: 'Cursor' }),
      makeToolResult({ toolName: 'Claude', recommendedAction: 'consolidate' }),
    ];
    render(<RecommendationsSection tools={tools} />);
    expect(screen.getByText('2 actions required')).toBeInTheDocument();
  });

  it('renders tool name in the recommendation card', () => {
    render(<RecommendationsSection tools={[makeToolResult({ toolName: 'GitHub Copilot' })]} />);
    expect(screen.getByText('GitHub Copilot')).toBeInTheDocument();
  });

  it('renders the reason text in the card', () => {
    render(<RecommendationsSection tools={[makeToolResult()]} />);
    expect(screen.getByText('Business costs more than Pro for this use case.')).toBeInTheDocument();
  });

  it('shows monthly and annual savings', () => {
    render(<RecommendationsSection tools={[makeToolResult()]} />);
    expect(screen.getByText('+$100')).toBeInTheDocument();
    expect(screen.getByText('+$1,200')).toBeInTheDocument();
  });

  it('shows the optimized-stack message when all tools are optimal', () => {
    const optimal = makeToolResult({ recommendedAction: 'keep', monthlySavings: 0, annualSavings: 0 });
    render(<RecommendationsSection tools={[optimal]} />);
    expect(screen.getByText('Your stack is fully optimized')).toBeInTheDocument();
  });

  it('renders "Optimal" pill for kept tools when other tools have actions', () => {
    const tools = [
      makeToolResult({ toolName: 'Cursor' }),                                          // actionable
      makeToolResult({ toolName: 'Claude', recommendedAction: 'keep', monthlySavings: 0, annualSavings: 0 }),  // optimal
    ];
    render(<RecommendationsSection tools={tools} />);
    expect(screen.getByText(/Claude — Optimal/)).toBeInTheDocument();
  });

  it('uses correct color label for each action type', () => {
    const consolidateTool = makeToolResult({ recommendedAction: 'consolidate', toolName: 'Claude' });
    render(<RecommendationsSection tools={[consolidateTool]} />);
    expect(screen.getByText('Consolidate')).toBeInTheDocument();
  });
});
