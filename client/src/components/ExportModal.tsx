import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, FileText, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import type { PdfExportSettings, PdfTheme, ChartColor, ReportData } from '../types';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { PdfReport } from './pdf/PdfReport';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (settings: PdfExportSettings) => void;
  defaultSettings: PdfExportSettings;
  data: ReportData;
}

export function ExportModal({ isOpen, onClose, onGenerate, defaultSettings, data }: ExportModalProps) {
  const [settings, setSettings] = useState<PdfExportSettings>(defaultSettings);
  const [zoomLevel, setZoomLevel] = useState(0.5);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.2));
  const handleZoomReset = () => setZoomLevel(0.5);

  const themes: { id: PdfTheme; label: string; desc: string }[] = [
    { id: 'dark-executive', label: 'Dark Executive', desc: 'Premium black with subtle highlights' },
    { id: 'light-corporate', label: 'Light Corporate', desc: 'Clean white, high contrast' },
  ];

  const chartColors: { id: ChartColor; colorClass: string; label: string }[] = [
    { id: 'blue', colorClass: 'bg-blue-500', label: 'Blue' },
    { id: 'green', colorClass: 'bg-emerald-500', label: 'Green' },
    { id: 'purple', colorClass: 'bg-purple-500', label: 'Purple' },
    { id: 'orange', colorClass: 'bg-orange-500', label: 'Orange' },
    { id: 'monochrome', colorClass: 'bg-zinc-500', label: 'Monochrome' },
  ];

  const toggleSection = (section: keyof Pick<PdfExportSettings, 'includeCharts' | 'includeCover' | 'showRecommendations' | 'showAiSummary' | 'compactMode'>) => {
    setSettings(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Estimate file size based on settings
  const getEstimatedSize = () => {
    let sizeMb = 0.5; // Base size
    if (settings.includeCharts) sizeMb += 0.3;
    if (settings.includeCover) sizeMb += 0.2;
    if (settings.quality === 'high') sizeMb *= 2.5; // High quality multiplies size
    return sizeMb.toFixed(1) + ' MB';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-[1400px] h-[90vh] bg-[#09090b] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row"
          >
            
            {/* Settings Panel (Left) */}
            <div className="flex flex-col w-full lg:w-[450px] border-r border-zinc-800 bg-[#09090b] z-10">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-800/50 rounded-lg">
                    <FileText className="w-5 h-5 text-zinc-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-100">Export Settings</h2>
                    <p className="text-sm text-zinc-400">Customize your PDF report</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Settings Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Theme Selection */}
              <div>
                <h3 className="text-sm font-medium text-zinc-300 mb-4 uppercase tracking-wider">Theme</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {themes.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setSettings({ ...settings, theme: theme.id })}
                      className={cn(
                        "flex flex-col text-left p-4 rounded-xl border transition-all duration-200",
                        settings.theme === theme.id 
                          ? "bg-zinc-800/80 border-zinc-600 ring-1 ring-zinc-600" 
                          : "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-zinc-200">{theme.label}</span>
                        {settings.theme === theme.id && <Check className="w-4 h-4 text-zinc-300" />}
                      </div>
                      <span className="text-xs text-zinc-500">{theme.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Color */}
              <div>
                <h3 className="text-sm font-medium text-zinc-300 mb-4 uppercase tracking-wider">Chart Color</h3>
                <div className="flex flex-wrap gap-4">
                  {chartColors.map(color => (
                    <button
                      key={color.id}
                      onClick={() => setSettings({ ...settings, chartColor: color.id })}
                      className={cn(
                        "relative w-10 h-10 rounded-full flex items-center justify-center transition-transform group",
                        color.colorClass,
                        settings.chartColor === color.id ? "scale-110 ring-2 ring-offset-2 ring-offset-[#09090b] ring-zinc-500" : "hover:scale-105 opacity-80"
                      )}
                      title={color.label}
                    >
                      {settings.chartColor === color.id && <Check className="w-5 h-5 text-white drop-shadow-md" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Include Sections */}
              <div>
                <h3 className="text-sm font-medium text-zinc-300 mb-4 uppercase tracking-wider">Report Contents</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'includeCover', label: 'Cover Page' },
                    { id: 'showAiSummary', label: 'AI Summary' },
                    { id: 'includeCharts', label: 'Visual Charts' },
                    { id: 'showRecommendations', label: 'Recommendations' },
                    { id: 'compactMode', label: 'Compact Layout' },
                  ].map(section => (
                    <label 
                      key={section.id} 
                      className="flex items-center gap-3 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-800 transition-colors"
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={settings[section.id as keyof PdfExportSettings] as boolean}
                          onChange={() => toggleSection(section.id as any)}
                          className="w-5 h-5 appearance-none rounded border border-zinc-600 checked:bg-zinc-700 checked:border-zinc-500 transition-colors cursor-pointer"
                        />
                        {settings[section.id as keyof PdfExportSettings] && (
                          <Check className="w-3.5 h-3.5 text-zinc-200 absolute pointer-events-none" />
                        )}
                      </div>
                      <span className="text-sm text-zinc-300 select-none">{section.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quality & File Size */}
              <div>
                <h3 className="text-sm font-medium text-zinc-300 mb-4 uppercase tracking-wider">Export Quality</h3>
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSettings({ ...settings, quality: 'standard' })}
                      className={cn(
                        "flex flex-col text-left p-3 rounded-xl border transition-all duration-200",
                        settings.quality === 'standard' 
                          ? "bg-zinc-800/80 border-zinc-600 ring-1 ring-zinc-600" 
                          : "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700"
                      )}
                    >
                      <span className="font-medium text-zinc-200">Standard</span>
                      <span className="text-xs text-zinc-500">Recommended for email</span>
                    </button>
                    <button
                      onClick={() => setSettings({ ...settings, quality: 'high' })}
                      className={cn(
                        "flex flex-col text-left p-3 rounded-xl border transition-all duration-200",
                        settings.quality === 'high' 
                          ? "bg-zinc-800/80 border-zinc-600 ring-1 ring-zinc-600" 
                          : "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700"
                      )}
                    >
                      <span className="font-medium text-zinc-200">High Quality</span>
                      <span className="text-xs text-zinc-500">For printing</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <span className="text-sm text-blue-400">Estimated File Size</span>
                    <span className="text-sm font-bold text-blue-400">{getEstimatedSize()}</span>
                  </div>
                </div>
              </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex justify-end gap-3 shrink-0">
                <button 
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-zinc-300 bg-transparent hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => onGenerate(settings)}
                  className="px-6 py-2 text-sm font-medium text-[#09090b] bg-zinc-100 hover:bg-white rounded-lg transition-colors"
                >
                  Generate PDF
                </button>
              </div>
            </div>

            {/* Preview Panel (Right) */}
            <div className="hidden lg:flex flex-1 flex-col bg-zinc-950 overflow-hidden relative">
              <div className="absolute top-0 right-0 z-50">
                <button 
                  onClick={onClose}
                  className="p-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 bg-zinc-900/50 backdrop-blur rounded-bl-xl transition-colors border-l border-b border-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur shrink-0 flex justify-between items-center sticky top-0 z-10 pr-16">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Live Preview</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={handleZoomOut} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors" title="Zoom Out">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-zinc-500 w-12 text-center select-none">{Math.round(zoomLevel * 100)}%</span>
                  <button onClick={handleZoomIn} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors" title="Zoom In">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-zinc-800 mx-1"></div>
                  <button onClick={handleZoomReset} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors" title="Reset Zoom">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative flex flex-col items-start">
                <div className="w-full flex justify-center pb-12">
                  <PdfReport data={data} settings={settings} isPreview={true} previewZoom={zoomLevel} />
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
