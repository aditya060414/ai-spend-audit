import { useState, useCallback } from 'react';
import type { ReportData, PdfExportSettings } from '../types';
import { HeroSection } from './HeroSection';
import { SummaryCards } from './SummaryCards';
import { ToolBreakdownTable } from './ToolBreakdownTable';
import { AISummaryCard } from './AISummaryCard';
import { HighSavingsCTA } from './HighSavingsCTA';
import { ShareSection } from './ShareSection';
import { SpendChartsSection } from './SpendChartsSection';
import { RecommendationsSection } from './RecommendationsSection';
import { downloadPdf } from '../utils/downloadPdf';
import { PdfReport } from './pdf/PdfReport';
import { getThemeConfig } from './pdf/theme';
import { ExportModal } from './ExportModal';
import { EnterpriseCTA } from './EnterpriseCTA';
import { toast } from 'react-hot-toast';

// 
interface AccessLevel {
  isOwner: boolean;
  isLead: boolean;
  isHighValue: boolean;
}

interface ReportDashboardProps {
  data: ReportData;
  accessLevel?: AccessLevel;
}

export function ReportDashboard({ data, accessLevel: _accessLevel }: ReportDashboardProps) {
  const { auditResults, aiSummary, shareId } = data;
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportSettings, setExportSettings] = useState<PdfExportSettings>({
    theme: 'dark',
    chartColor: 'blue',
    quality: 'standard',
    compactMode: true,
    includeCharts: true,
    includeCover: true,
    showRecommendations: true,
    showAiSummary: true,
  });

  const handleGeneratePdf = useCallback(async (settings: PdfExportSettings) => {
    setExportSettings(settings);
    setIsExportModalOpen(false);
    setIsGenerating(true);
    const toastId = toast.loading('Generating PDF report...');

    try {
      // Get the actual hex background color for the selected theme
      const themeConfig = getThemeConfig(settings.theme, settings.chartColor, settings.compactMode);
      
      await downloadPdf(
        'pdf-export-container', 
        `AI-Spend-Audit-${shareId}.pdf`, 
        settings.quality,
        themeConfig.pageBgHex
      );
      toast.success('Report downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.error('Failed to generate PDF report.', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  }, [shareId]);


  const isHighSavings = auditResults.totalMonthlySavings > 500;

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] selection:bg-emerald-500/30">
      {/* Subtle top gradient */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
      
      {/* Hidden dedicated print/PDF layout */}
      <PdfReport data={data} settings={exportSettings} />
      
      <ExportModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onGenerate={handleGeneratePdf}
        defaultSettings={exportSettings}
        data={data}
      />
      
      <main className="relative max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 py-8 md:py-24">
        <div className="pb-10 bg-transparent">
          <HeroSection 
            savingsCategory={auditResults.savingsCategory} 
            isEfficient={!isHighSavings}
          />
          
          <SummaryCards summary={auditResults} />
          
          <SpendChartsSection summary={auditResults} />
          
          <div>
            <RecommendationsSection tools={auditResults.perTool} />

            <ToolBreakdownTable tools={auditResults.perTool} />
            
            {aiSummary && (
              <AISummaryCard summary={aiSummary} />
            )}
          </div>
          
          {isHighSavings ? (
            <HighSavingsCTA savings={auditResults.totalMonthlySavings} />
          ) : (
            <div className="mt-12 p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl text-center">
              <h3 className="text-xl font-bold text-zinc-100 mb-2">You're spending efficiently!</h3>
              <p className="text-zinc-400 mb-6">Your tool stack is well-optimized. Subscribe to our newsletter for more efficiency tips.</p>
              <button 
                onClick={() => toast.success('Newsletter coming soon!', { icon: '📧' })}
                className="px-6 py-2.5 bg-zinc-100 hover:bg-white text-zinc-900 font-bold rounded-xl transition-all"
              >
                Get Weekly Updates
              </button>
            </div>
          )}

          {_accessLevel?.isHighValue && (
            <EnterpriseCTA />
          )}
        </div>
        
        <ShareSection 
          shareId={shareId} 
          onExportClick={() => {
            if (!_accessLevel?.isLead) {
              window.dispatchEvent(new CustomEvent('trigger-lead-capture'));
            } else {
              setIsExportModalOpen(true);
            }
          }} 
          onShareClick={() => {
            if (!_accessLevel?.isLead) {
              window.dispatchEvent(new CustomEvent('trigger-lead-capture'));
              return false; // Signal to block if possible
            }
            return true;
          }}
          isGenerating={isGenerating}
        />
      </main>
    </div>
  );
}
