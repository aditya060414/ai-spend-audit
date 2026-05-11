
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AISummaryCardProps {
  summary: string;
}

export function AISummaryCard({ summary }: AISummaryCardProps) {
  return (
    <motion.div
      data-testid="ai-summary"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="relative overflow-hidden rounded-2xl mb-10 p-[1px]"
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-purple-500/30 rounded-2xl" />
      
      <div className="relative glass-card rounded-2xl p-8 bg-zinc-900/90 h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="text-xl font-medium text-zinc-100">AI Financial Analysis</h2>
        </div>
        
        <p className="text-zinc-300 leading-relaxed text-lg">
          {summary}
        </p>
      </div>
    </motion.div>
  );
}
