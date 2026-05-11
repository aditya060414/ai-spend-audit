import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReportPage } from '../pages/ReportPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import api from '../lib/api';
import type { ReportData } from '../types';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock api
vi.mock('../lib/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

// Mock ReportDashboard since we only want to test ReportPage logic here
vi.mock('../components/ReportDashboard', () => ({
  ReportDashboard: ({ data }: { data: ReportData }) => <div data-testid="report-dashboard">{data.aiSummary}</div>,
}));

// Mock LeadCaptureModal
vi.mock('../components/LeadCaptureModal', () => ({
  LeadCaptureModal: () => <div data-testid="lead-capture-modal">Lead Capture</div>,
}));

const mockReportData: ReportData = {
  shareId: 'test-id',
  auditResults: {
    totalMonthlySavings: 50,
    totalAnnualSavings: 600,
    savingsCategory: 'medium',
    perTool: []
  },
  aiSummary: 'Your summary here',
  summaryWasFallback: false
};

describe('ReportPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderReportPage = (shareId = 'test-id') => {
    return render(
      <MemoryRouter initialEntries={[`/report/${shareId}`]}>
        <Routes>
          <Route path="/report/:shareId" element={<ReportPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('shows loading spinner initially', () => {
    vi.mocked(api.get).mockImplementation(() => new Promise(() => {}));
    renderReportPage();
    expect(screen.getByText(/Loading Report/i)).toBeInTheDocument();
  });

  it('fetches and renders report data', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: mockReportData,
    });
    renderReportPage();
    await waitFor(() => {
      expect(screen.getByTestId('report-dashboard')).toBeInTheDocument();
      expect(screen.getByText('Your summary here')).toBeInTheDocument();
    });
  });

  it('shows error state when report fetch fails', async () => {
    vi.mocked(api.get).mockRejectedValueOnce({ 
      response: { data: { error: 'Report not found' } },
      isAxiosError: true
    });
    renderReportPage();
    await waitFor(() => {
      expect(screen.getByText(/Report Unavailable/i)).toBeInTheDocument();
      expect(screen.getByText(/Report not found/i)).toBeInTheDocument();
    });
  });

  it('navigates back to home', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockReportData });
    renderReportPage();
    await waitFor(() => {
      const button = screen.getByText(/Back to Audit/i);
      userEvent.click(button);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('opens lead capture modal when trigger event fires', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockReportData });
    renderReportPage();
    
    await waitFor(() => {
        expect(screen.getByTestId('report-dashboard')).toBeInTheDocument();
    });

    fireEvent(window, new CustomEvent('trigger-lead-capture'));

    await waitFor(() => {
      expect(screen.getByTestId('lead-capture-modal')).toBeInTheDocument();
    });
  });

  it('sets access levels from local storage', async () => {
    const shareId = 'test-id';
    localStorage.setItem(`report_${shareId}`, JSON.stringify({ isOwner: true, isLead: true }));
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockReportData });
    renderReportPage(shareId);
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(`/api/reports/${shareId}`);
      expect(screen.getByTestId('report-dashboard')).toBeInTheDocument();
    });
  });
});
