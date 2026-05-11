import { motion } from 'framer-motion';
import { ArrowDownCircle, RefreshCw, XCircle, CheckCircle2, Lightbulb, Coins } from 'lucide-react';
import type { ToolAuditResult, Recommendation } from '../types';

interface RecommendationsSectionProps {
  tools: ToolAuditResult[];
}

const actionConfig: Record<Recommendation, { label: string; color: string; bgColor: string; borderColor: string; icon: any }> = {
  keep:        { label: 'Optimal',     color: 'text-zinc-400',   bgColor: 'bg-zinc-500/10',  borderColor: 'border-zinc-600/30',  icon: CheckCircle2  },
  downgrade:   { label: 'Downgrade',   color: 'text-amber-400',  bgColor: 'bg-amber-500/10', borderColor: 'border-amber-600/30', icon: ArrowDownCircle },
  upgrade:     { label: 'Upgrade',     color: 'text-blue-400',   bgColor: 'bg-blue-500/10',  borderColor: 'border-blue-600/30',  icon: ArrowDownCircle },
  consolidate: { label: 'Consolidate', color: 'text-rose-400',   bgColor: 'bg-rose-500/10',  borderColor: 'border-rose-600/30',  icon: XCircle       },
  switch:      { label: 'Switch',      color: 'text-indigo-400', bgColor: 'bg-indigo-500/10',borderColor: 'border-indigo-600/30',icon: RefreshCw     },
  credits:     { label: 'Credits',     color: 'text-emerald-400', bgColor: 'bg-emerald-500/10',borderColor: 'border-emerald-600/30',icon: Coins      },
};

export function RecommendationsSection({ tools }: RecommendationsSectionProps) {
  const actionable = tools.filter(t => t.recommendedAction !== 'keep' && t.recommendedAction !== 'credits');
  const creditBased = tools.filter(t => t.recommendedAction === 'credits');
  const optimal    = tools.filter(t => t.recommendedAction === 'keep');

  if (actionable.length === 0 && creditBased.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-card rounded-xl p-8 mb-10 text-center"
      >
        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-zinc-100 mb-1">Your stack is fully optimized</h2>
        <p className="text-zinc-400 text-sm">No immediate changes recommended based on your current usage.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mb-10"
    >
      <div className="flex items-center gap-2 mb-5">
        <Lightbulb className="w-4 h-4 text-amber-400" />
        <h2 className="text-base font-semibold text-zinc-100">Optimization Recommendations</h2>
        <span className="ml-auto text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
          {actionable.length} action{actionable.length !== 1 ? 's' : ''} required
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Display normal actionable items */}
        {actionable.map((tool, idx) => {
          const cfg = actionConfig[tool.recommendedAction] || actionConfig.keep;
          const Icon = cfg.icon || CheckCircle2;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + idx * 0.08 }}
              className={`glass-card rounded-xl p-5 border ${cfg.borderColor} relative overflow-hidden`}
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${cfg.bgColor.replace('/10', '/60')}`} />
              <div className="pl-3">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-sm font-semibold text-zinc-100">{tool.toolName}</span>
                    <span className="text-xs text-zinc-400 ml-2">{tool.currentPlan}</span>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${cfg.bgColor} ${cfg.color} ${cfg.borderColor}`}>
                    <Icon className="w-3 h-3" />
                    {cfg.label}
                  </div>
                </div>

                {tool.recommendedAction !== 'keep' && tool.recommendedAction !== 'credits' && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-zinc-400">→</span>
                    <span className="text-xs font-medium text-zinc-300">{tool.recommendedPlan}</span>
                  </div>
                )}

                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  {tool.reason}
                </p>

                {(tool.monthlySavings ?? 0) > 0 && (
                  <div className="flex items-center gap-3 pt-3 border-t border-zinc-800/60">
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Monthly Savings</p>
                      <p className="text-sm font-bold text-emerald-400">+${(tool.monthlySavings ?? 0).toLocaleString()}</p>
                    </div>
                    <div className="w-px h-8 bg-zinc-800" />
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Annual Savings</p>
                      <p className="text-sm font-bold text-emerald-400">+${(tool.annualSavings ?? 0).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Display Credit Recommendations */}
        {creditBased.map((tool, idx) => {
          const cfg = actionConfig.credits;
          const Icon = cfg.icon;
          return (
            <motion.div
              key={`credit-${idx}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + (actionable.length + idx) * 0.08 }}
              className={`glass-card rounded-xl p-5 border ${cfg.borderColor} relative overflow-hidden bg-emerald-500/5`}
            >
              <div className={`absolute top-0 left-0 w-1 h-full bg-emerald-500/40`} />
              <div className="pl-3">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-sm font-semibold text-zinc-100">{tool.toolName}</span>
                    <span className="text-xs text-zinc-400 ml-2">{tool.currentPlan}</span>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${cfg.bgColor} ${cfg.color} ${cfg.borderColor}`}>
                    <Icon className="w-3 h-3" />
                    {cfg.label}
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  {tool.reason}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Potential Savings</p>
                      <p className="text-sm font-bold text-emerald-400">20-30% off</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.open('https://credex.com', '_blank')}
                    className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-[10px] font-bold rounded uppercase transition-colors"
                  >
                    Claim Credits
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {optimal.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {optimal.map((t, i) => (
            <div key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800/50 text-zinc-400 border border-zinc-700/40 rounded-full text-xs">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              {t.toolName} — Optimal
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
