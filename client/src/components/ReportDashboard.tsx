import { useState, useCallback, lazy, Suspense, memo } from 'react';
import type { ReportData, PdfExportSettings } from '../types';
import { HeroSection } from './HeroSection';
import { SummaryCards } from './SummaryCards';
import { downloadPdf } from '../utils/downloadPdf';
import { getThemeConfig } from './pdf/theme';
import { toast } from 'react-hot-toast';
import { ChartSkeleton } from './ChartSkeleton';

const ReportCharts = lazy(() => import('./ReportCharts').then(m => ({ default: m.ReportCharts })));
const PdfReport = lazy(() => import('./pdf/PdfReport').then(m => ({ default: m.PdfReport })));
const ExportModal = lazy(() => import('./ExportModal').then(m => ({ default: m.ExportModal })));
const ToolBreakdownTable = lazy(() => import('./ToolBreakdownTable').then(m => ({ default: m.ToolBreakdownTable })));
const AISummaryCard = lazy(() => import('./AISummaryCard').then(m => ({ default: m.AISummaryCard })));
const HighSavingsCTA = lazy(() => import('./HighSavingsCTA').then(m => ({ default: m.HighSavingsCTA })));
const ShareSection = lazy(() => import('./ShareSection').then(m => ({ default: m.ShareSection })));
const RecommendationsSection = lazy(() => import('./RecommendationsSection').then(m => ({ default: m.RecommendationsSection })));
const EnterpriseCTA = lazy(() => import('./EnterpriseCTA').then(m => ({ default: m.EnterpriseCTA })));

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

export const ReportDashboard = memo(function ReportDashboard({ data, accessLevel: _accessLevel }: ReportDashboardProps) {
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
      <Suspense fallback={null}>
        <PdfReport data={data} settings={exportSettings} />
      </Suspense>
      
      <Suspense fallback={null}>
        <ExportModal 
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          onGenerate={handleGeneratePdf}
          defaultSettings={exportSettings}
          data={data}
        />
      </Suspense>
      
      <main className="relative max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 py-8 md:py-24">
        <div className="pb-10 bg-transparent">
          <HeroSection 
            savingsCategory={auditResults.savingsCategory} 
            isEfficient={!isHighSavings}
          />
          
          <SummaryCards summary={auditResults} />
          
          <Suspense fallback={<ChartSkeleton />}>
            <ReportCharts summary={auditResults} />
          </Suspense>
          
          <Suspense fallback={<div className="space-y-4 animate-pulse"><div className="h-48 bg-zinc-900/50 rounded-xl" /><div className="h-48 bg-zinc-900/50 rounded-xl" /></div>}>
            <RecommendationsSection tools={auditResults.perTool} />
            <ToolBreakdownTable tools={auditResults.perTool} />
            {aiSummary && (
              <AISummaryCard summary={aiSummary} />
            )}
          </Suspense>
          
          <Suspense fallback={null}>
            {isHighSavings && _accessLevel?.isLead && (
              <HighSavingsCTA savings={auditResults.totalMonthlySavings} />
            )}
            
            {!isHighSavings && (
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
          </Suspense>
        </div>
        
        <Suspense fallback={<div className="h-20 bg-zinc-900/50 mt-12 rounded-xl" />}>
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
                return false; 
              }
              return true;
            }}
            isGenerating={isGenerating}
          />
        </Suspense>
      </main>
    </div>
  );
});
