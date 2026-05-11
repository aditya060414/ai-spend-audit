import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PdfReport } from '../components/pdf/PdfReport';
import type { ReportData, PdfExportSettings } from '../types';

// Mock recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div style={{width: '100%', height: '100%'}}>{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  Cell: () => <div />,
  PieChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Pie: () => <div />,
  Legend: () => <div />,
}));

const mockData: ReportData = {
  shareId: 'test-id',
  auditResults: {
    totalMonthlySavings: 500,
    totalAnnualSavings: 6000,
    savingsCategory: 'high',
    perTool: [
      {
        toolName: 'Cursor',
        currentPlan: 'Business',
        currentMonthlySpending: 100,
        recommendedAction: 'downgrade',
        recommendedPlan: 'Pro',
        projectedMonthlyCost: 50,
        monthlySavings: 50,
        annualSavings: 600,
        reason: 'Reason 1',
        credexEligible: false
      }
    ]
  },
  aiSummary: 'AI analysis content',
  summaryWasFallback: false
};

const mockSettings: PdfExportSettings = {
  theme: 'dark',
  chartColor: 'green',
  quality: 'standard',
  compactMode: false,
  includeCharts: true,
  includeCover: true,
  showRecommendations: true,
  showAiSummary: true
};

describe('PdfReport', () => {
  it('renders correctly with default settings', () => {
    render(<PdfReport data={mockData} settings={mockSettings} />);
    expect(screen.getByText(/Stack Optimization/i)).toBeInTheDocument();
    expect(screen.getByText(/Executive Summary/i)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Spend Comparison/i)).toBeInTheDocument();
    expect(screen.getByText(/Detailed Tool Breakdown/i)).toBeInTheDocument();
    expect(screen.getByText(/Optimization Roadmap/i)).toBeInTheDocument();
  });

  it('hides charts if disabled', () => {
    render(<PdfReport data={mockData} settings={{ ...mockSettings, includeCharts: false }} />);
    expect(screen.queryByText(/Monthly Spend Comparison/i)).not.toBeInTheDocument();
  });

  it('hides cover if disabled', () => {
    render(<PdfReport data={mockData} settings={{ ...mockSettings, includeCover: false }} />);
    expect(screen.queryByText(/Stack Optimization/i)).not.toBeInTheDocument();
  });

  it('hides AI summary if disabled', () => {
    render(<PdfReport data={mockData} settings={{ ...mockSettings, showAiSummary: false }} />);
    expect(screen.queryByText(/Executive Summary/i)).not.toBeInTheDocument();
  });

  it('splits report into multiple pages for large data', () => {
    // Generate many tools to trigger page split
    const manyTools = Array.from({ length: 20 }, (_, i) => ({
        ...mockData.auditResults.perTool[0],
        toolName: `Tool ${i}`
    }));
    
    const largeData = {
        ...mockData,
        auditResults: {
            ...mockData.auditResults,
            perTool: manyTools
        }
    };
    
    render(<PdfReport data={largeData} settings={mockSettings} />);
    
    // Check footer for page numbers
    expect(screen.getAllByText(/Page/i).length).toBeGreaterThan(1);
  });
});
