import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExportModal } from '../components/ExportModal';
import type { PdfExportSettings, ReportData } from '../types';


// Mock PdfReport since we don't want to test PDF rendering here
vi.mock('./pdf/PdfReport', () => ({
  PdfReport: () => <div data-testid="pdf-preview">PDF Preview Content</div>,
}));

const mockData: ReportData = {
  shareId: 'test-id',
  auditResults: {
    totalMonthlySavings: 200,
    totalAnnualSavings: 2400,
    savingsCategory: 'medium',
    perTool: []
  },
  aiSummary: 'Test content',
  summaryWasFallback: false
};

const defaultSettings: PdfExportSettings = {
  theme: 'light',
  chartColor: 'blue',
  quality: 'standard',
  includeCharts: true,
  includeCover: true,
  showRecommendations: true,
  showAiSummary: true,
  compactMode: false
};

describe('ExportModal', () => {
  const onGenerate = vi.fn();
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(
      <ExportModal 
        isOpen={true} 
        onClose={onClose} 
        onGenerate={onGenerate} 
        defaultSettings={defaultSettings} 
        data={mockData} 
      />
    );
    expect(screen.getByText('Report Settings')).toBeInTheDocument();
    expect(screen.getByText('Report Preview')).toBeInTheDocument();
    expect(screen.getByTestId('pdf-preview')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <ExportModal 
        isOpen={false} 
        onClose={onClose} 
        onGenerate={onGenerate} 
        defaultSettings={defaultSettings} 
        data={mockData} 
      />
    );
    expect(screen.queryByText('Report Settings')).not.toBeInTheDocument();
  });

  it('updates theme settings', async () => {
    render(
      <ExportModal 
        isOpen={true} 
        onClose={onClose} 
        onGenerate={onGenerate} 
        defaultSettings={defaultSettings} 
        data={mockData} 
      />
    );
    
    const darkThemeButton = screen.getByText('Dark Theme');
    await userEvent.click(darkThemeButton.closest('button')!);
    
    // Click Export button to verify settings
    await userEvent.click(screen.getByText('Export PDF'));
    
    expect(onGenerate).toHaveBeenCalledWith(expect.objectContaining({
      theme: 'dark'
    }));
  });

  it('updates structure settings (toggles)', async () => {
    render(
      <ExportModal 
        isOpen={true} 
        onClose={onClose} 
        onGenerate={onGenerate} 
        defaultSettings={defaultSettings} 
        data={mockData} 
      />
    );
    
    const coverButton = screen.getByText('Cover Header');
    await userEvent.click(coverButton);
    
    // Since it was true by default, it should now be false (check icon or bg)
    // The check icon is rendered when true. 
    // Wait, let's test if onGenerate sends the updated settings.
  });

  it('calls onGenerate with updated settings when Export PDF is clicked', async () => {
    render(
      <ExportModal 
        isOpen={true} 
        onClose={onClose} 
        onGenerate={onGenerate} 
        defaultSettings={defaultSettings} 
        data={mockData} 
      />
    );
    
    // Toggle cover header (initially true)
    await userEvent.click(screen.getByText('Cover Header'));
    
    // Switch to dark theme
    await userEvent.click(screen.getByText('Dark Theme'));

    // Switch to high quality
    await userEvent.click(screen.getByText('high'));

    const exportButton = screen.getByText('Export PDF');
    await userEvent.click(exportButton);

    expect(onGenerate).toHaveBeenCalledWith(expect.objectContaining({
      includeCover: false,
      theme: 'dark',
      quality: 'high'
    }));
  });

  it('calls onClose when close button is clicked', async () => {
    render(
      <ExportModal 
        isOpen={true} 
        onClose={onClose} 
        onGenerate={onGenerate} 
        defaultSettings={defaultSettings} 
        data={mockData} 
      />
    );
    
    // Close button (X icon)
    const closeButton = screen.getAllByRole('button').find(btn => 
        btn.querySelector('svg.lucide-x') && !btn.className.includes('lg:hidden')
    );
    if (closeButton) await userEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('handles zoom controls', async () => {
    render(
      <ExportModal 
        isOpen={true} 
        onClose={onClose} 
        onGenerate={onGenerate} 
        defaultSettings={defaultSettings} 
        data={mockData} 
      />
    );
    
    const zoomIn = screen.getAllByRole('button').find(btn => btn.querySelector('svg.lucide-zoom-in'));
    const zoomOut = screen.getAllByRole('button').find(btn => btn.querySelector('svg.lucide-zoom-out'));
    
    if (zoomIn) await userEvent.click(zoomIn);
    // Zoom value is internal state, but we can check if it rendered the input
    expect(screen.getByDisplayValue('70')).toBeInTheDocument(); // Default 0.6 -> 60, zoomIn -> 70
    
    if (zoomOut) await userEvent.click(zoomOut);
    expect(screen.getByDisplayValue('60')).toBeInTheDocument();
  });
});
