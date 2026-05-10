
import { motion, type Variants } from 'framer-motion';
import { DollarSign, ArrowDownRight, Wallet, PiggyBank } from 'lucide-react';
import type { AuditSummary } from '../types';

interface SummaryCardsProps {
  summary: AuditSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const perTool = summary?.perTool || [];
  const currentTotalMonthly = perTool.reduce((acc, tool) => acc + (Number(tool.currentMonthlySpending) || 0), 0);
  const optimizedTotalMonthly = perTool.reduce((acc, tool) => acc + (Number(tool.projectedMonthlyCost) || 0), 0);

  const formatCurrency = (value: number) => {
    const safe = Number(value);
    if (!isFinite(safe)) return '$—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(safe);
  };

  const cards = [
    {
      title: 'Current Monthly Spend',
      value: formatCurrency(currentTotalMonthly),
      icon: DollarSign,
      color: 'text-zinc-400',
      bgColor: 'bg-zinc-800/50',
    },
    {
      title: 'Optimized Monthly Spend',
      value: formatCurrency(optimizedTotalMonthly),
      icon: Wallet,
      color: 'text-zinc-100',
      bgColor: 'bg-zinc-800/80',
    },
    {
      title: 'Monthly Savings',
      value: formatCurrency(summary.totalMonthlySavings),
      icon: ArrowDownRight,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Annual Savings',
      value: formatCurrency(summary.totalAnnualSavings),
      icon: PiggyBank,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
    >
      {cards.map((card, index) => (
        <motion.div key={index} variants={item} className="glass-card rounded-xl p-5 relative overflow-hidden group">
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-zinc-400 mb-1">{card.title}</p>
              <h3 className={`text-2xl font-semibold tracking-tight ${card.color}`}>
                {card.value}
              </h3>
            </div>
            <div className={`p-2.5 rounded-lg ${card.bgColor} border border-white/5`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </div>
          
          {/* Subtle hover gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
      ))}
    </motion.div>
  );
}
