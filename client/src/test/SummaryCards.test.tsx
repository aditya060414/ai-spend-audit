// client/src/test/SummaryCards.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SummaryCards } from '../components/SummaryCards';
import type { AuditSummary } from '../types';

const mockSummary: AuditSummary = {
  totalMonthlySavings: 700,
  totalAnnualSavings: 8400,
  savingsCategory: 'high',
  perTool: [
    {
      toolName: 'Cursor',
      currentPlan: 'Business',
      currentMonthlySpending: 400,
      recommendedAction: 'downgrade',
      recommendedPlan: 'Pro',
      projectedMonthlyCost: 200,
      monthlySavings: 200,
      annualSavings: 2400,
      reason: 'Downgrade saves money.',
      credexEligible: false,
    },
    {
      toolName: 'Claude',
      currentPlan: 'Max',
      currentMonthlySpending: 500,
      recommendedAction: 'consolidate',
      recommendedPlan: 'ChatGPT',
      projectedMonthlyCost: 0,
      monthlySavings: 500,
      annualSavings: 6000,
      reason: 'Overlapping tools.',
      credexEligible: false,
    },
  ],
};

describe('SummaryCards', () => {
  it('renders all 4 KPI card titles', () => {
    render(<SummaryCards summary={mockSummary} />);
    expect(screen.getByText('Current Monthly Spend')).toBeInTheDocument();
    expect(screen.getByText('Optimized Monthly Spend')).toBeInTheDocument();
    expect(screen.getByText('Monthly Savings')).toBeInTheDocument();
    expect(screen.getByText('Annual Savings')).toBeInTheDocument();
  });

  it('displays correct monthly savings value', () => {
    render(<SummaryCards summary={mockSummary} />);
    expect(screen.getByText('$700')).toBeInTheDocument();
  });

  it('displays correct annual savings value', () => {
    render(<SummaryCards summary={mockSummary} />);
    expect(screen.getByText('$8,400')).toBeInTheDocument();
  });

  it('computes current monthly spend as sum of all tools', () => {
    // $400 + $500 = $900
    render(<SummaryCards summary={mockSummary} />);
    expect(screen.getByText('$900')).toBeInTheDocument();
  });

  it('computes optimized monthly spend as sum of projected costs', () => {
    // $200 + $0 = $200
    render(<SummaryCards summary={mockSummary} />);
    expect(screen.getByText('$200')).toBeInTheDocument();
  });
});
