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
import { ExportModal } from './ExportModal';
import { EnterpriseCTA } from './EnterpriseCTA';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

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
    theme: 'dark-executive',
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

    setTimeout(async () => {
      try {
        await downloadPdf('pdf-export-container', `AI-Spend-Audit-${shareId}.pdf`);
        toast.success('PDF downloaded successfully!', { id: toastId });
      } catch (error) {
        console.error('Failed to generate PDF:', error);
        toast.error('Failed to generate PDF report.', { id: toastId });
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  }, [shareId]);

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
      
      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="pb-10 bg-transparent">
          <HeroSection savingsCategory={auditResults.savingsCategory} />
          
          <SummaryCards summary={auditResults} />
          
          <SpendChartsSection summary={auditResults} />
          
          <div className={cn("transition-all duration-700", !_accessLevel?.isLead && !_accessLevel?.isOwner && "blur-md select-none pointer-events-none opacity-50")}>
            <RecommendationsSection tools={auditResults.perTool} />

            <ToolBreakdownTable tools={auditResults.perTool} />
            
            {aiSummary && (
              <AISummaryCard summary={aiSummary} />
            )}
          </div>
          
          {!_accessLevel?.isLead && !_accessLevel?.isOwner && (
            <div className="relative -mt-32 mb-20 z-10 text-center">
              <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-10 rounded-3xl shadow-2xl max-w-xl mx-auto">
                <h3 className="text-2xl font-bold text-zinc-100 mb-3">Unlock Full Audit Insights</h3>
                <p className="text-zinc-400 mb-8">
                  Get the detailed tool-by-tool breakdown and AI-powered recommendations to start saving.
                </p>
                <button 
                  onClick={() => window.location.reload()} // This will trigger the LeadCaptureModal in ReportPage
                  className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-[#09090b] font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Unlock Report Now
                </button>
              </div>
            </div>
          )}
          
          <HighSavingsCTA savings={auditResults.totalMonthlySavings} />

          {_accessLevel?.isHighValue && (
            <EnterpriseCTA />
          )}
        </div>
        
        <ShareSection 
          shareId={shareId} 
          onExportClick={() => setIsExportModalOpen(true)} 
          isGenerating={isGenerating}
        />
      </main>
    </div>
  );
}
