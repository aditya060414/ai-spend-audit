import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import type { AuditSummary } from '../types';

interface SpendChartsSectionProps {
  summary: AuditSummary;
}

const SAVINGS_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f97316', '#eab308'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 shadow-xl min-w-[140px]">
        <p className="text-xs font-semibold text-zinc-300 mb-2 border-b border-zinc-700 pb-1.5">{label || 'Savings'}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center justify-between gap-4 mt-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-[11px] text-zinc-400">{entry.name}</span>
            </div>
            <span className="text-[12px] font-bold text-zinc-100">${entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function SpendChartsSection({ summary }: SpendChartsSectionProps) {
  const barData = summary.perTool.map(t => ({
    name: t.toolName.length > 10 ? t.toolName.slice(0, 10) + '…' : t.toolName,
    fullName: t.toolName,
    Current: t.currentMonthlySpending,
    Optimized: t.projectedMonthlyCost,
  }));

  const pieData = summary.perTool
    .filter(t => t.monthlySavings > 0)
    .map(t => ({ name: t.toolName, value: t.monthlySavings }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10"
    >
      {/* Bar Chart — Spend Comparison */}
      <div className="lg:col-span-3 glass-card rounded-xl p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-zinc-100">Spend Comparison</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Current vs optimized cost per tool</p>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -16, bottom: 0 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#a1a1aa', paddingTop: '12px' }} />
              <Bar dataKey="Current" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Optimized" fill="#10b981" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart — Savings Distribution */}
      <div className="lg:col-span-2 glass-card rounded-xl p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-zinc-100">Savings Distribution</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Monthly savings breakdown by tool</p>
        </div>
        {pieData.length === 0 ? (
          <div className="h-52 flex items-center justify-center text-zinc-500 text-sm">
            No savings identified.
          </div>
        ) : (
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={SAVINGS_COLORS[i % SAVINGS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ fontSize: '11px', color: '#a1a1aa' }}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
}
