import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, FileText, ZoomIn, ZoomOut, RotateCcw, Palette, Layout, Zap, Download, Menu, Settings } from 'lucide-react';
import type { PdfExportSettings, PdfTheme, ReportData } from '../types';
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
  const [zoomLevel, setZoomLevel] = useState(0.6);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.2));
  const handleZoomReset = () => setZoomLevel(0.6);

  const themes: { id: PdfTheme; label: string; desc: string }[] = [
    { id: 'light', label: 'Light Theme', desc: 'Professional style' },
    { id: 'dark', label: 'Dark Theme', desc: 'Premium dark aesthetic' },
  ];

  const toggleSection = (section: keyof Pick<PdfExportSettings, 'includeCharts' | 'includeCover' | 'showRecommendations' | 'showAiSummary' | 'compactMode'>) => {
    setSettings(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0c0c0e] border-r border-zinc-800">
      <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-emerald-500" />
          <h2 className="text-lg font-bold text-zinc-100">Report Settings</h2>
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-zinc-400 hover:text-zinc-100">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Appearance */}
        <section>
          <h3 className="text-[10px] font-bold text-zinc-500 mb-4 uppercase tracking-widest flex items-center gap-2">
            <Palette className="w-3 h-3" /> Appearance
          </h3>
          <div className="grid gap-2">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => setSettings({ ...settings, theme: t.id })}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all",
                  settings.theme === t.id ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" : "bg-zinc-900/30 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                )}
              >
                <div>
                  <p className="text-xs font-bold">{t.label}</p>
                  <p className="text-[10px] opacity-60">{t.desc}</p>
                </div>
                {settings.theme === t.id && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </section>

        {/* Structure */}
        <section>
          <h3 className="text-[10px] font-bold text-zinc-500 mb-4 uppercase tracking-widest flex items-center gap-2">
            <Layout className="w-3 h-3" /> Structure
          </h3>
          <div className="space-y-2">
            {[
              { id: 'includeCover', label: 'Cover Header' },
              { id: 'showAiSummary', label: 'AI Executive Summary' },
              { id: 'includeCharts', label: 'Financial Charts' },
              { id: 'showRecommendations', label: 'Strategy Roadmap' },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => toggleSection(s.id as any)}
                className="w-full flex items-center justify-between p-3.5 bg-zinc-900/30 border border-zinc-800 rounded-xl hover:bg-zinc-800/50 transition-colors group"
              >
                <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200">{s.label}</span>
                <div className={cn(
                  "w-4 h-4 rounded border flex items-center justify-center transition-all",
                  settings[s.id as keyof PdfExportSettings] ? "bg-emerald-500 border-emerald-500" : "border-zinc-700"
                )}>
                  {settings[s.id as keyof PdfExportSettings] && <Check className="w-3 h-3 text-zinc-900 stroke-[4]" />}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Quality */}
        <section>
          <h3 className="text-[10px] font-bold text-zinc-500 mb-4 uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-3 h-3" /> Quality
          </h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {(['low', 'standard', 'high'] as const).map(q => (
              <button
                key={q}
                onClick={() => setSettings({ ...settings, quality: q })}
                className={cn(
                  "py-2 rounded-lg border text-[10px] font-bold capitalize transition-all",
                  settings.quality === q ? "bg-zinc-800 border-zinc-600 text-zinc-100" : "border-zinc-800 text-zinc-500"
                )}
              >
                {q}
              </button>
            ))}
          </div>
          <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex justify-between items-center">
            <span className="text-[10px] font-bold text-emerald-500/70 uppercase">Est. Size</span>
            <span className="text-xs font-bold text-emerald-400">
              {settings.quality === 'high' ? '4.8 MB' : settings.quality === 'standard' ? '1.2 MB' : '0.4 MB'}
            </span>
          </div>
        </section>
      </div>

      <div className="p-6 border-t border-zinc-800">
        <button 
          onClick={() => onGenerate(settings)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-bold rounded-xl transition-all"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full h-full bg-[#050507] flex overflow-hidden"
          >
            {/* Desktop Sidebar (Fixed) */}
            <aside className="hidden lg:block w-[380px] shrink-0">
              <SidebarContent />
            </aside>

            {/* Mobile Sidebar (Slide-in Drawer) */}
            <AnimatePresence>
              {isSidebarOpen && (
                <>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden" />
                  <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-y-0 left-0 w-[300px] z-50 lg:hidden">
                    <SidebarContent />
                  </motion.aside>
                </>
              )}
            </AnimatePresence>

            {/* Main Content (Preview) */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Toolbar */}
              <div className="h-16 border-b border-zinc-800 bg-[#09090b]/50 backdrop-blur-xl flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-2 sm:gap-4">
                  <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-1.5 text-zinc-400 hover:text-zinc-100 bg-zinc-800/50 rounded-lg">
                    <Menu className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-emerald-500 hidden xs:block" />
                    <span className="text-[10px] sm:text-xs font-bold text-zinc-100 whitespace-nowrap">Report Preview</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                  {/* Zoom Controls */}
                  <div className="flex items-center gap-1 sm:gap-2 px-1.5 py-1 bg-zinc-900/80 border border-zinc-800 rounded-lg">
                    <button onClick={handleZoomOut} className="p-1 text-zinc-500 hover:text-zinc-100 transition-colors">
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    
                    <div className="hidden sm:flex items-center">
                      <input 
                        type="number" value={Math.round(zoomLevel * 100)} 
                        onChange={(e) => setZoomLevel(Math.min(Math.max(parseInt(e.target.value) / 100 || 0.1, 0.1), 2))}
                        className="w-8 bg-transparent text-[10px] font-mono text-zinc-300 text-center focus:outline-none"
                      />
                      <span className="text-[10px] font-mono text-zinc-500">%</span>
                    </div>

                    <button onClick={handleZoomIn} className="p-1 text-zinc-500 hover:text-zinc-100 transition-colors">
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    
                    <div className="w-px h-3 bg-zinc-800 mx-0.5" />
                    
                    <button 
                      onClick={() => setZoomLevel(1)} 
                      className={cn(
                        "text-[9px] font-bold px-1 py-0.5 rounded transition-colors hidden xs:block",
                        zoomLevel === 1 ? "bg-emerald-500/20 text-emerald-400" : "text-zinc-500"
                      )}
                    >
                      100%
                    </button>
                    
                    <button onClick={handleZoomReset} className="p-1 text-zinc-500 hover:text-zinc-100 transition-colors">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button onClick={onClose} className="p-2 text-zinc-500 hover:text-zinc-100 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* PDF Canvas */}
              <div className="flex-1 overflow-auto bg-[#050507] custom-scrollbar p-6 md:p-12">
                <div className="min-w-fit flex justify-center pb-20">
                  <div 
                    data-testid="pdf-preview"
                    className="origin-top transition-transform duration-200 shadow-2xl" 
                    style={{ transform: `scale(${zoomLevel})` }}
                  >
                    <PdfReport data={data} settings={settings} isPreview={true} previewZoom={1} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
