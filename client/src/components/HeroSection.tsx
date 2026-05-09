
import { motion } from 'framer-motion';
import { TrendingDown } from 'lucide-react';
import type { SavingsCategory } from '../types';
import { cn } from '../lib/utils';

interface HeroSectionProps {
  savingsCategory: SavingsCategory;
}

export function HeroSection({ savingsCategory }: HeroSectionProps) {
  const getBadgeStyle = (category: SavingsCategory) => {
    switch (category) {
      case 'optimal':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'low':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'medium':
      case 'high':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const getCategoryText = (category: SavingsCategory) => {
    switch (category) {
      case 'optimal': return 'Optimal Efficiency';
      case 'low': return 'Low Optimization Opportunity';
      case 'medium': return 'Medium Optimization Opportunity';
      case 'high': return 'High Optimization Opportunity';
      default: return 'Analysis Complete';
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-zinc-800/80 rounded-lg border border-zinc-700/50">
            <TrendingDown className="w-5 h-5 text-emerald-400" />
          </div>
          <span className={cn(
            "px-2.5 py-1 text-xs font-medium rounded-full border",
            getBadgeStyle(savingsCategory)
          )}>
            {getCategoryText(savingsCategory)}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gradient mb-2">
          AI Spend Audit Report
        </h1>
        <p className="text-zinc-400 text-lg">
          Optimization insights and financial analysis for your AI tooling stack.
        </p>
      </motion.div>
    </div>
  );
}
