import { motion } from 'framer-motion';
import { Link, Copy, Download, FileText, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ShareSectionProps {
  shareId: string;
  onExportClick?: () => void;
  isGenerating?: boolean;
}

export function ShareSection({ shareId, onExportClick, isGenerating = false }: ShareSectionProps) {
  const shareUrl = `${window.location.origin}/report/${shareId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard!');
  };

  const handleExportClick = () => {
    if (onExportClick) {
      onExportClick();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-zinc-800/50"
    >
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="flex-1 md:flex-none flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2">
          <Link className="w-4 h-4 text-zinc-500" />
          <span className="text-sm text-zinc-400 truncate max-w-[200px] md:max-w-xs">{shareUrl}</span>
        </div>
        <button 
          onClick={handleCopy}
          className="p-2.5 text-zinc-400 hover:text-zinc-200 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg border border-zinc-700/50 transition-colors"
          title="Copy link"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-3 w-full md:w-auto">
        <button 
          onClick={handleExportClick}
          disabled={isGenerating}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700/50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          {isGenerating ? 'Generating...' : 'Export PDF'}
        </button>
        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700/50 transition-colors text-sm">
          <Download className="w-4 h-4" />
          Download CSV
        </button>
      </div>
    </motion.div>
  );
}
