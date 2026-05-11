import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToolBreakdownTable } from '../components/ToolBreakdownTable';
import type { ToolAuditResult } from '../types';


const mockTools: ToolAuditResult[] = [
  {
    toolName: 'Cursor',
    currentPlan: 'Business',
    recommendedAction: 'downgrade',
    recommendedPlan: 'Pro',
    currentMonthlySpending: 400,
    projectedMonthlyCost: 200,
    monthlySavings: 200,
    annualSavings: 2400,
    reason: 'Underutilized features',
    credexEligible: false
  },
  {
    toolName: 'GitHub Copilot',
    currentPlan: 'Pro',
    recommendedAction: 'keep',
    recommendedPlan: 'Pro',
    currentMonthlySpending: 100,
    projectedMonthlyCost: 100,
    monthlySavings: 0,
    annualSavings: 0,
    reason: 'Optimal',
    credexEligible: false
  },
  {
    toolName: 'Claude',
    currentPlan: 'Enterprise',
    recommendedAction: 'consolidate',
    recommendedPlan: 'None',
    currentMonthlySpending: 500,
    projectedMonthlyCost: 0,
    monthlySavings: 500,
    annualSavings: 6000,
    reason: 'Redundant with ChatGPT',
    credexEligible: false
  }
];

describe('ToolBreakdownTable', () => {
  it('renders table headers correctly', () => {
    render(<ToolBreakdownTable tools={mockTools} />);
    expect(screen.getByText('Tool')).toBeInTheDocument();
    expect(screen.getByText('Current Plan')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Recommended Plan')).toBeInTheDocument();
    expect(screen.getByText('Monthly Savings')).toBeInTheDocument();
  });

  it('renders tool data correctly', () => {
    render(<ToolBreakdownTable tools={mockTools} />);
    
    // Cursor row
    expect(screen.getByText('Cursor')).toBeInTheDocument();
    expect(screen.getByText('Business')).toBeInTheDocument();
    expect(screen.getByText('Downgrade')).toBeInTheDocument();
    expect(screen.getAllByText('Pro')).toHaveLength(3); // Cursor recommended, GitHub current, GitHub recommended
    expect(screen.getByText('+$200')).toBeInTheDocument();

    // GitHub Copilot row
    expect(screen.getByText('GitHub Copilot')).toBeInTheDocument();
    expect(screen.getByText('Optimal')).toBeInTheDocument();
    
    // Claude row
    expect(screen.getByText('Claude')).toBeInTheDocument();
    expect(screen.getByText('Consolidate')).toBeInTheDocument();
    expect(screen.getByText('+$500')).toBeInTheDocument();
  });

  it('shows placeholder when tools list is empty', () => {
    render(<ToolBreakdownTable tools={[]} />);
    expect(screen.queryByRole('row', { name: /Cursor/i })).not.toBeInTheDocument();
  });

  it('applies correct styling based on recommended action', () => {
    render(<ToolBreakdownTable tools={mockTools} />);
    
    const downgradeBadge = screen.getByText('Downgrade');
    expect(downgradeBadge).toHaveClass('text-amber-400');

    const optimalBadge = screen.getByText('Optimal');
    expect(optimalBadge).toHaveClass('text-zinc-400');

    const consolidateBadge = screen.getByText('Consolidate');
    expect(consolidateBadge).toHaveClass('text-rose-400');
  });

  it('shows credits badge for eligible tools', () => {
    const tools = [
      {
        toolName: 'Cursor',
        currentPlan: 'Pro',
        recommendedPlan: 'Pro',
        currentMonthlySpending: 20,
        projectedMonthlyCost: 20,
        monthlySavings: 0,
        annualSavings: 0,
        reason: 'Optimal',
        credexEligible: true,
        recommendedAction: 'credits'
      }
    ];

    render(<ToolBreakdownTable tools={tools as any} />);
    expect(screen.getByText(/Credits Available/i)).toBeInTheDocument();
  });
});
