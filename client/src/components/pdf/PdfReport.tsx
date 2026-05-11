import type { ReportData, PdfExportSettings } from '../../types';
import { PdfPage } from './PdfPage';
import { getThemeConfig, type ThemeConfig } from './theme';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface PdfReportProps {
  data: ReportData;
  settings: PdfExportSettings;
  isPreview?: boolean;
  previewZoom?: number;
}

// -----------------------------------------------------------------------------
// BLOCK COMPONENTS
// -----------------------------------------------------------------------------

const PdfHeaderBlock = ({ data, theme }: { data: ReportData, theme: ThemeConfig }) => {
  return (
    <div className={`w-full ${theme.spacing.section}`}>
      <div className={`flex justify-between items-end border-b pb-6 ${theme.borderPrimary}`}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className={`text-[10px] font-bold tracking-[0.1em] uppercase ${theme.textSecondary}`}>
              AI Spend Audit
            </span>
          </div>
          <h1 className={`text-3xl font-bold tracking-tight ${theme.textPrimary}`}>
            Stack Optimization
          </h1>
          <p className={`text-xs mt-1 ${theme.textMuted}`}>
            Report ID: <span className="font-medium opacity-80">#{data.shareId?.slice(0, 8).toUpperCase() || 'N/A'}</span> • {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
};

const PdfKPIBlock = ({ data, theme }: { data: ReportData, theme: ThemeConfig }) => {
  const { auditResults } = data;
  const perTool = auditResults?.perTool || [];
  const currentTotal = perTool.reduce((acc, tool) => acc + (tool.currentMonthlySpending || 0), 0);
  const optimizedTotal = perTool.reduce((acc, tool) => acc + (tool.projectedMonthlyCost || 0), 0);

  const metrics = [
    { label: 'Current Monthly', value: currentTotal, color: theme.textPrimary },
    { label: 'Optimized Monthly', value: optimizedTotal, color: 'text-emerald-500' },
    { label: 'Monthly Savings', value: auditResults.totalMonthlySavings, color: 'text-emerald-500' },
    { label: 'Annual Savings', value: auditResults.totalAnnualSavings, color: 'text-emerald-500' }
  ];

  return (
    <div className={`grid grid-cols-4 gap-4 ${theme.spacing.section}`}>
      {metrics.map((m, i) => (
        <div key={i} className={`rounded-xl border ${theme.borderPrimary} ${theme.cardBgSecondary} p-5 flex flex-col justify-between h-24`}>
          <p className={`text-[9px] font-bold uppercase tracking-[0.1em] ${theme.textMuted}`}>{m.label}</p>
          <p className={`text-xl font-bold tracking-tight ${m.color.startsWith('text-') ? m.color : ''}`} style={!m.color.startsWith('text-') ? { color: 'inherit' } : undefined}>
            ${m.value.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

const PdfSummaryBlock = ({ data, theme }: { data: ReportData, theme: ThemeConfig }) => {
  return (
    <div className={`rounded-xl border ${theme.borderPrimary} ${theme.cardBgSecondary} overflow-hidden ${theme.spacing.section}`}>
      <div className={`px-5 py-3 border-b ${theme.borderPrimary} ${theme.tableHeaderBg}`}>
        <h3 className={`text-[11px] font-bold uppercase tracking-widest ${theme.textPrimary}`}>
          Executive Summary
        </h3>
      </div>
      <div className={`p-5 ${theme.textSecondary}`}>
        {(data.aiSummary || "").split('\n').map((paragraph, idx) => (
          paragraph.trim() ? <p key={idx} className="mb-3 last:mb-0 leading-[1.6] text-[11px]">{paragraph}</p> : null
        ))}
      </div>
    </div>
  );
};

const PdfChartsBlock = ({ data, theme }: { data: ReportData, theme: ThemeConfig }) => {
  const perTool = data.auditResults?.perTool || [];
  
  const chartData = perTool.map(tool => ({
    name: tool.toolName,
    current: tool.currentMonthlySpending || 0,
    optimized: tool.projectedMonthlyCost || 0,
  })).sort((a, b) => b.current - a.current).slice(0, 5);

  const savingsData = perTool
    .filter(t => (t.monthlySavings || 0) > 0)
    .map(tool => ({ name: tool.toolName, value: tool.monthlySavings }))
    .sort((a, b) => b.value - a.value);

  const COLORS = theme.chartColors;

  return (
    <div className={`grid grid-cols-2 gap-6 ${theme.spacing.section}`}>
      <div className={`rounded-xl border ${theme.borderPrimary} ${theme.cardBgSecondary} p-5`}>
        <h3 className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMuted} mb-6`}>
          Monthly Spend Comparison
        </h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke={theme.borderPrimary} vertical={false} />
              <XAxis dataKey="name" stroke={theme.textMuted} fontSize={9} tickLine={false} axisLine={false} tick={{dy: 10}} />
              <YAxis stroke={theme.textMuted} fontSize={9} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
              <Bar dataKey="current" name="Current" fill={theme.textMuted === 'text-[#52525b]' ? '#52525b' : '#a1a1aa'} radius={[2, 2, 0, 0]} barSize={20} />
              <Bar dataKey="optimized" name="Optimized" fill="#10b981" radius={[2, 2, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.textMuted === 'text-[#52525b]' ? '#a1a1aa' : '#52525b' }} />
             <span className={`text-[9px] font-bold uppercase ${theme.textMuted}`}>Current</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500" />
             <span className={`text-[9px] font-bold uppercase ${theme.textMuted}`}>Optimized</span>
           </div>
        </div>
      </div>

      <div className={`rounded-xl border ${theme.borderPrimary} ${theme.cardBgSecondary} p-5`}>
        <h3 className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMuted} mb-6`}>
          Savings Distribution
        </h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={savingsData} innerRadius={35} outerRadius={60} paddingAngle={4} dataKey="value" stroke="none">
                {savingsData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-y-1 mt-4">
          {savingsData.slice(0, 4).map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className={`text-[9px] font-medium truncate ${theme.textSecondary}`}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PdfTableBlock = ({ data, theme }: { data: ReportData, theme: ThemeConfig }) => {
  return (
    <div className={`rounded-xl border ${theme.borderPrimary} overflow-hidden ${theme.spacing.section}`}>
      <div className={`px-5 py-4 border-b ${theme.borderPrimary} ${theme.tableHeaderBg}`}>
        <h3 className={`text-[11px] font-bold uppercase tracking-widest ${theme.textPrimary}`}>
          Detailed Tool Breakdown
        </h3>
      </div>
      <div>
        <table className="w-full text-left border-collapse">
          <thead className={theme.tableHeaderBg}>
            <tr>
              <th className={`px-5 py-3 text-[10px] font-bold uppercase tracking-wider ${theme.textMuted}`}>Tool</th>
              <th className={`px-5 py-3 text-[10px] font-bold uppercase tracking-wider ${theme.textMuted}`}>Current Plan</th>
              <th className={`px-5 py-3 text-[10px] font-bold uppercase tracking-wider ${theme.textMuted}`}>Target Plan</th>
              <th className={`px-5 py-3 text-[10px] font-bold uppercase tracking-wider ${theme.textMuted} text-right`}>Optimized Cost</th>
              <th className={`px-5 py-3 text-[10px] font-bold uppercase tracking-wider ${theme.textMuted} text-right`}>Savings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/10">
            {(data.auditResults?.perTool || []).map((tool, idx) => (
              <tr key={idx} className={tool.recommendedAction !== 'keep' ? "bg-emerald-500/[0.02]" : ""}>
                <td className="px-5 py-4">
                  <p className={`text-xs font-bold ${theme.textPrimary}`}>{tool.toolName}</p>
                </td>
                <td className="px-5 py-4">
                  <p className={`text-[10px] ${theme.textSecondary}`}>{tool.currentPlan}</p>
                  <p className={`text-[9px] font-medium ${theme.textMuted}`}>(${tool.currentMonthlySpending.toLocaleString()}/mo)</p>
                </td>
                <td className="px-5 py-4">
                  <p className={`text-[10px] ${theme.textSecondary}`}>{tool.recommendedPlan}</p>
                </td>
                <td className="px-5 py-4 text-right">
                  <p className={`text-xs font-bold ${theme.textPrimary}`}>${tool.projectedMonthlyCost.toLocaleString()}</p>
                </td>
                <td className="px-5 py-4 text-right">
                  {tool.monthlySavings > 0 ? (
                    <p className="text-xs font-bold text-emerald-500">+{Math.round(tool.monthlySavings).toLocaleString()}</p>
                  ) : (
                    <p className={`text-[10px] font-medium ${theme.textMuted}`}>Optimal</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PdfRecsBlock = ({ data, theme }: { data: ReportData, theme: ThemeConfig }) => {
  const perTool = data.auditResults?.perTool || [];
  const actionable = perTool.filter(t => t.recommendedAction !== 'keep' && t.recommendedAction !== 'credits');
  const creditBased = perTool.filter(t => t.recommendedAction === 'credits');
  const allActionable = [...actionable, ...creditBased];

  return (
    <div className={`${theme.spacing.section}`}>
      <h3 className={`text-[11px] font-bold uppercase tracking-widest ${theme.textPrimary} mb-4`}>
        Optimization Roadmap
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {allActionable.map((tool, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${theme.borderPrimary} ${theme.cardBgSecondary}`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${tool.recommendedAction === 'credits' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'} uppercase tracking-wider`}>
                  {tool.recommendedAction}
                </span>
                <span className={`text-sm font-bold ${theme.textPrimary}`}>{tool.toolName}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-emerald-500">
                  {tool.recommendedAction === 'credits' ? '20-30% Savings' : `+$${tool.monthlySavings.toLocaleString()}/mo`}
                </span>
              </div>
            </div>
            <p className={`text-[10px] leading-relaxed ${theme.textSecondary}`}>
              {tool.reason}
            </p>
          </div>
        ))}
        {allActionable.length === 0 && (
          <div className={`text-xs ${theme.textMuted} text-center py-8 border border-dashed ${theme.borderPrimary} rounded-xl`}>
            Your stack is fully optimized. No immediate actions required.
          </div>
        )}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// INTELLIGENT PAGINATOR ALGORITHM
// -----------------------------------------------------------------------------

export function PdfReport({ data, settings, isPreview = false }: PdfReportProps) {
  const theme = getThemeConfig(settings.theme, settings.chartColor, settings.compactMode);

  // Define dynamic block weights based on actual data length
  const perTool = data.auditResults?.perTool || [];
  const toolCount = perTool.length;
  const actionableCount = perTool.filter(t => t.recommendedAction !== 'keep' && t.recommendedAction !== 'credits').length;
  const creditCount = perTool.filter(t => t.recommendedAction === 'credits').length;

  const weights = {
    cover: 0.12,
    kpi: 0.14,
    summary: 0.15 + ((data.aiSummary || "").length / 1000) * 0.1, // Scale with text length
    charts: 0.28,
    table: 0.08 + (toolCount * 0.05), // Header + ~5% per row
    recs: 0.06 + ((actionableCount + creditCount) * 0.08) // Header + ~8% per item
  };

  // Build the ordered list of enabled blocks
  const activeBlocks: { id: string, weight: number, render: () => import('react').ReactNode }[] = [];

  if (settings.includeCover) activeBlocks.push({ id: 'cover', weight: weights.cover, render: () => <PdfHeaderBlock key="cover" data={data} theme={theme} /> });
  activeBlocks.push({ id: 'kpi', weight: weights.kpi, render: () => <PdfKPIBlock key="kpi" data={data} theme={theme} /> });
  if (settings.showAiSummary) activeBlocks.push({ id: 'summary', weight: weights.summary, render: () => <PdfSummaryBlock key="summary" data={data} theme={theme} /> });
  if (settings.includeCharts) activeBlocks.push({ id: 'charts', weight: weights.charts, render: () => <PdfChartsBlock key="charts" data={data} theme={theme} /> });
  activeBlocks.push({ id: 'table', weight: weights.table, render: () => <PdfTableBlock key="table" data={data} theme={theme} /> });
  if (settings.showRecommendations) activeBlocks.push({ id: 'recs', weight: weights.recs, render: () => <PdfRecsBlock key="recs" data={data} theme={theme} /> });

  // Bin packing: Group blocks into pages so that total weight per page <= 1.05
  const pages: (typeof activeBlocks)[] = [];
  let currentPage: typeof activeBlocks = [];
  let currentWeight = 0;

  activeBlocks.forEach(block => {
    if (currentWeight + block.weight > 0.85 && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [block];
      currentWeight = block.weight;
    } else {
      currentPage.push(block);
      currentWeight += block.weight;
    }
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return (
    <div 
      id={isPreview ? undefined : "pdf-export-container"}
      // If it's a preview, we use zoom to scale it down.
      className={isPreview ? "flex flex-col gap-10 w-[210mm] pb-20" : "fixed left-[9999px] top-0 pointer-events-none w-[210mm]"} 
    >
      {pages.map((pageBlocks, pageIndex) => (
        <PdfPage 
          key={`page-${pageIndex}`} 
          theme={theme} 
          pageNumber={pageIndex + 1} 
          totalPages={pages.length}
          includeFooter={true}
        >
          {pageBlocks.map(block => block.render())}
        </PdfPage>
      ))}
    </div>
  );
}
