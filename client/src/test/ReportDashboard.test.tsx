import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { ReportDashboard } from '../components/ReportDashboard';
import type { ReportData } from '../types';


// Mock components used inside Dashboard
vi.mock('../components/AISummaryCard', () => ({
  AISummaryCard: ({ summary }: any) => <div data-testid="ai-summary">{summary}</div>,
}));

vi.mock('../components/SummaryCards', () => ({
  SummaryCards: () => <div data-testid="summary-cards">Summary Cards</div>,
}));

vi.mock('../components/SpendChartsSection', () => ({
  SpendChartsSection: () => <div data-testid="spend-charts">Charts</div>,
}));

vi.mock('../components/ToolBreakdownTable', () => ({
  ToolBreakdownTable: () => <div data-testid="tool-breakdown">Table</div>,
}));

vi.mock('../components/RecommendationsSection', () => ({
  RecommendationsSection: () => <div data-testid="recommendations">Recommendations</div>,
}));

vi.mock('../components/ExportModal', () => ({
  ExportModal: () => <div data-testid="export-modal">Export Modal</div>,
}));

vi.mock('../components/ShareSection', () => ({
  ShareSection: () => <div data-testid="share-section">Share Section</div>,
}));

const mockData: ReportData = {
  shareId: 'test-id',
  auditResults: {
    totalMonthlySavings: 500,
    totalAnnualSavings: 6000,
    savingsCategory: 'high',
    perTool: []
  },
  aiSummary: 'AI analysis content',
  summaryWasFallback: false
};

const renderDashboard = (data = mockData, accessLevel = { isOwner: true, isLead: true, isHighValue: false }) => {
  return render(<ReportDashboard data={data} accessLevel={accessLevel} />);
};

describe('ReportDashboard', () => {
  it('renders AI summary when provided', () => {
    renderDashboard();
    const summaryCard = screen.getByTestId('ai-summary');
    expect(summaryCard).toBeInTheDocument();
    
    const { getByText } = within(summaryCard);
    expect(getByText('AI analysis content')).toBeInTheDocument();
  });

  it('does not render AI summary if empty', () => {
    renderDashboard({ ...mockData, aiSummary: '' });
    expect(screen.queryByTestId('ai-summary')).not.toBeInTheDocument();
  });

  it('shows enterprise CTA for high value users', () => {
    renderDashboard(mockData, { isOwner: true, isLead: true, isHighValue: true });
    expect(screen.getByText(/Enterprise Solutions/i)).toBeInTheDocument();
  });

  it('shows efficient spending message for low savings', () => {
    renderDashboard({
      ...mockData,
      auditResults: {
        ...mockData.auditResults,
        totalMonthlySavings: 10,
        savingsCategory: 'low'
      }
    });
    expect(screen.getByText(/You're spending efficiently/i)).toBeInTheDocument();
  });

  it('shows high savings CTA for large savings', () => {
    renderDashboard({
      ...mockData,
      auditResults: {
        ...mockData.auditResults,
        totalMonthlySavings: 1000,
        savingsCategory: 'critical'
      }
    });
    expect(screen.getByText(/Schedule Consultation/i)).toBeInTheDocument();
  });

  it('renders all sections', () => {
    renderDashboard();
    expect(screen.getByTestId('summary-cards')).toBeInTheDocument();
    expect(screen.getByTestId('spend-charts')).toBeInTheDocument();
    expect(screen.getByTestId('tool-breakdown')).toBeInTheDocument();
    expect(screen.getByTestId('recommendations')).toBeInTheDocument();
  });
});
