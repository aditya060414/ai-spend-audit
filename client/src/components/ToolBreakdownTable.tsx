import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Recommendation, ToolAuditResult } from '../types';
import { cn } from '../lib/utils';
import { CheckCircle2, ArrowDownCircle, RefreshCw, XCircle, Coins } from 'lucide-react';

interface ToolBreakdownTableProps {
  tools: ToolAuditResult[];
}

export const ToolBreakdownTable = memo(function ToolBreakdownTable({ tools }: ToolBreakdownTableProps) {
  const getActionConfig = (action: Recommendation) => {
    switch (action) {
      case 'keep':
        return { label: 'Optimal', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20', icon: CheckCircle2 };
      case 'downgrade':
        return { label: 'Downgrade', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: ArrowDownCircle };
      case 'upgrade':
        return { label: 'Upgrade', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: ArrowDownCircle }; // Usually you don't upgrade in a savings tool, but just in case
      case 'consolidate':
        return { label: 'Consolidate', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20', icon: XCircle };
      case 'switch':
        return { label: 'Switch', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', icon: RefreshCw };
      case 'credits':
        return { label: 'Credits', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: Coins };
      default:
        return { label: 'Unknown', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20', icon: CheckCircle2 };
    }
  };

  const formatCurrency = (value: number) => {
    const safe = Number(value);
    if (!isFinite(safe)) return '$—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(safe);
  };

  return (
    <motion.div
      data-testid="tool-breakdown"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card rounded-xl overflow-hidden mb-10"
    >
      <div className="p-6 border-b border-zinc-800/50">
        <h2 className="text-xl font-medium text-zinc-100">Tool Breakdown</h2>
        <p className="text-zinc-400 text-sm mt-1">Detailed analysis of your current stack.</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-zinc-900/50 text-zinc-400 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Tool</th>
              <th className="px-6 py-4 font-medium">Current Plan</th>
              <th className="px-6 py-4 font-medium">Action</th>
              <th className="px-6 py-4 font-medium">Recommended Plan</th>
              <th className="px-6 py-4 font-medium text-right">Current Cost</th>
              <th className="px-6 py-4 font-medium text-right">Projected Cost</th>
              <th className="px-6 py-4 font-medium text-right">Monthly Savings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {(tools || []).map((tool, idx) => {
              const ActionIcon = getActionConfig(tool.recommendedAction).icon;
              return (
                <motion.tr 
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  className="hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-zinc-200">
                    <div className="flex flex-col gap-1">
                      {tool.toolName}
                      {tool.credexEligible && (
                        <div className="inline-flex items-center gap-1 text-[10px] text-emerald-400/80 bg-emerald-400/5 px-1.5 py-0.5 rounded border border-emerald-400/10 w-fit">
                          <Coins className="w-2.5 h-2.5" />
                          Credits Available
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    {tool.currentPlan || <span className="text-zinc-600 italic">Not specified</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                      getActionConfig(tool.recommendedAction).color
                    )}>
                      <ActionIcon className="w-3.5 h-3.5" />
                      {getActionConfig(tool.recommendedAction).label}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-300">
                    {tool.recommendedPlan || <span className="text-zinc-600">—</span>}
                  </td>
                  <td className="px-6 py-4 text-right text-zinc-400">
                    {formatCurrency(tool.currentMonthlySpending)}
                  </td>
                  <td className="px-6 py-4 text-right text-zinc-300">
                    {formatCurrency(tool.projectedMonthlyCost)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={tool.monthlySavings > 0 ? "text-emerald-400 font-medium" : "text-zinc-400"}>
                      {tool.monthlySavings > 0 ? `+${formatCurrency(tool.monthlySavings)}` : '-'}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
});
