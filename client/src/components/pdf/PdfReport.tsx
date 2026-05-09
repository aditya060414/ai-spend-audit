import type { ReportData, PdfExportSettings } from '../../types';
import { PdfPage } from './PdfPage';
import { getThemeConfig, type ThemeConfig } from './theme';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

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
  const { auditResults } = data;
  return (
    <div className={`w-full ${theme.spacing.section}`}>
      <div className={`p-4 md:p-6 rounded-xl border ${theme.borderSecondary} ${theme.headerGradient} shadow-sm`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${theme.chartColors[0] ? `bg-[${theme.chartColors[0]}]` : 'bg-blue-500'}`} />
              <span className={`text-[10px] font-semibold tracking-wider uppercase ${theme.textSecondary}`}>
                AI Spend Optimization Report
              </span>
            </div>
            <h1 className={`text-2xl font-bold tracking-tight bg-clip-text text-transparent ${theme.headerGradientText}`}>
              Financial Audit
            </h1>
          </div>
          <div className="text-right">
            <div className={`text-[10px] ${theme.textMuted} mb-0.5`}>Generated</div>
            <div className={`text-xs font-medium ${theme.textPrimary}`}>
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-dashed border-zinc-500/30">
          <div>
            <div className={`text-[10px] ${theme.textMuted} mb-0.5`}>Total Analyzed Tools</div>
            <div className={`text-lg font-bold ${theme.textPrimary}`}>{auditResults.perTool.length}</div>
          </div>
          <div>
            <div className={`text-[10px] ${theme.textMuted} mb-0.5`}>Optimization Potential</div>
            <div className="text-lg font-bold text-emerald-500">High</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PdfKPIBlock = ({ data, theme }: { data: ReportData, theme: ThemeConfig }) => {
  const { auditResults } = data;
  return (
    <div className={`grid grid-cols-4 gap-3 ${theme.spacing.section}`}>
      {[
        { label: 'Current Monthly', value: `$${auditResults.perTool.reduce((acc, tool) => acc + tool.currentMonthlySpending, 0).toLocaleString()}` },
        { label: 'Optimized Monthly', value: `$${auditResults.perTool.reduce((acc, tool) => acc + tool.projectedMonthlyCost, 0).toLocaleString()}`, color: 'text-emerald-500' },
        { label: 'Monthly Savings', value: `$${auditResults.totalMonthlySavings.toLocaleString()}`, color: 'text-emerald-500' },
        { label: 'Annual Savings', value: `$${auditResults.totalAnnualSavings.toLocaleString()}`, color: 'text-emerald-500' }
      ].map((kpi, i) => (
        <div key={i} className={`rounded-xl border ${theme.borderPrimary} ${theme.cardBg} ${theme.spacing.card} shadow-sm`}>
          <p className={`text-[10px] font-medium uppercase tracking-wider ${theme.textSecondary} mb-1.5`}>{kpi.label}</p>
          <p className={`text-lg font-bold ${kpi.color || theme.textPrimary}`}>{kpi.value}</p>
        </div>
      ))}
    </div>
  );
};

const PdfSummaryBlock = ({ data, theme }: { data: ReportData, theme: ThemeConfig }) => {
  return (
    <div className={`rounded-xl border ${theme.borderPrimary} ${theme.cardBgSecondary} overflow-hidden ${theme.spacing.section}`}>
      <div className={`px-4 py-2.5 border-b ${theme.borderPrimary} ${theme.tableHeaderBg}`}>
        <h3 className={`text-xs font-semibold uppercase tracking-wider ${theme.textPrimary}`}>
          Executive AI Analysis
        </h3>
      </div>
      <div className={`p-4 prose prose-sm max-w-none ${theme.textSecondary}`}>
        {data.aiSummary.split('\n').map((paragraph, idx) => (
          paragraph.trim() ? <p key={idx} className="mb-2 last:mb-0 leading-relaxed text-xs">{paragraph}</p> : null
        ))}
      </div>
    </div>
  );
};

const PdfChartsBlock = ({ data, theme }: { data: ReportData, theme: ThemeConfig }) => {
  const chartData = data.auditResults.perTool.map(tool => ({
    name: tool.toolName,
    current: tool.currentMonthlySpending,
    optimized: tool.projectedMonthlyCost,
  })).sort((a, b) => b.current - a.current).slice(0, 5);

  const savingsData = data.auditResults.perTool
    .filter(t => t.monthlySavings > 0)
    .map(tool => ({ name: tool.toolName, value: tool.monthlySavings }))
    .sort((a, b) => b.value - a.value);

  const COLORS = theme.chartColors;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-2.5 rounded-lg border ${theme.borderPrimary} ${theme.cardBg} shadow-xl backdrop-blur-md flex flex-col gap-1 z-50 min-w-[120px]`}>
          <p className={`text-[10px] font-bold ${theme.textPrimary} mb-1 border-b ${theme.borderSecondary} pb-1`}>{label || 'Savings'}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className={`text-[9px] font-medium ${theme.textSecondary}`}>{entry.name}</span>
              </div>
              <span className={`text-[10px] font-bold ${theme.textPrimary}`}>${entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`grid grid-cols-2 gap-4 ${theme.spacing.section}`}>
      <div className={`rounded-xl border ${theme.borderPrimary} ${theme.cardBg} ${theme.spacing.card}`}>
        <h3 className={`text-[10px] font-semibold uppercase tracking-wider ${theme.textPrimary} mb-3`}>
          Spend Comparison (Top 5)
        </h3>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.borderPrimary} vertical={false} />
              <XAxis dataKey="name" stroke={theme.textMuted} fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke={theme.textMuted} fontSize={9} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
              <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '9px', paddingTop: '5px' }} />
              <Bar dataKey="current" name="Current" fill={COLORS[0]} radius={[2, 2, 0, 0]} />
              <Bar dataKey="optimized" name="Optimized" fill={COLORS[1] || COLORS[0]} fillOpacity={0.6} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`rounded-xl border ${theme.borderPrimary} ${theme.cardBg} ${theme.spacing.card}`}>
        <h3 className={`text-[10px] font-semibold uppercase tracking-wider ${theme.textPrimary} mb-3`}>
          Savings Distribution
        </h3>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={savingsData} innerRadius={25} outerRadius={50} paddingAngle={2} dataKey="value" stroke="none">
                {savingsData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '9px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const PdfTableBlock = ({ data, theme }: { data: ReportData, theme: ThemeConfig }) => {
  return (
    <div className={`rounded-xl border ${theme.borderPrimary} ${theme.cardBg} overflow-hidden ${theme.spacing.section}`}>
      <div className={`px-3 py-2 border-b ${theme.borderPrimary} ${theme.tableHeaderBg}`}>
        <h3 className={`text-[10px] font-semibold uppercase tracking-wider ${theme.textPrimary}`}>
          Optimization Breakdown
        </h3>
      </div>
      <table className="w-full text-left border-collapse text-[10px]">
        <thead>
          <tr className={`border-b ${theme.borderSecondary} ${theme.tableHeaderBg} ${theme.textSecondary}`}>
            <th className="px-3 py-1.5 font-medium">Tool</th>
            <th className="px-3 py-1.5 font-medium">Current</th>
            <th className="px-3 py-1.5 font-medium">Recommended</th>
            <th className="px-3 py-1.5 font-medium text-right">Savings</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${theme.borderSecondary}`}>
          {data.auditResults.perTool.map((tool, idx) => (
            <tr key={idx} className={theme.textPrimary}>
              <td className="px-3 py-1.5 font-medium">{tool.toolName}</td>
              <td className="px-3 py-1.5 text-zinc-500">
                {tool.currentPlan} <span className="text-[9px]">(${tool.currentMonthlySpending}/mo)</span>
              </td>
              <td className="px-3 py-1.5">
                {tool.recommendedAction === 'keep' ? (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-zinc-500/10 text-zinc-500 text-[9px] font-medium border border-zinc-500/20">
                    Optimal
                  </span>
                ) : (
                  <span className="font-medium text-emerald-500">
                    {tool.recommendedAction === 'downgrade' ? '↓' : '↑'} {tool.recommendedPlan}
                  </span>
                )}
              </td>
              <td className="px-3 py-1.5 text-right">
                {tool.monthlySavings > 0 ? (
                  <span className="text-emerald-500 font-medium">+${tool.monthlySavings}/mo</span>
                ) : (
                  <span className="text-zinc-500">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PdfRecsBlock = ({ data, theme }: { data: ReportData, theme: ThemeConfig }) => {
  const actionable = data.auditResults.perTool.filter(t => t.recommendedAction !== 'keep');
  return (
    <div className={`rounded-xl border ${theme.borderPrimary} ${theme.cardBg} ${theme.spacing.card}`}>
      <h3 className={`text-[10px] font-semibold uppercase tracking-wider ${theme.textPrimary} mb-2.5`}>
        Operational Recommendations
      </h3>
      <div className="grid grid-cols-2 gap-2.5">
        {actionable.map((tool, idx) => (
          <div key={idx} className={`p-2.5 rounded-lg border ${theme.borderSecondary} ${theme.cardBgSecondary}`}>
            <div className="flex justify-between items-start mb-1">
              <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500`}>
                Action Required
              </span>
              <span className={`text-[9px] font-bold ${theme.textPrimary}`}>{tool.toolName}</span>
            </div>
            <p className={`text-[10px] leading-relaxed ${theme.textSecondary}`}>
              {tool.reason}
            </p>
          </div>
        ))}
        {actionable.length === 0 && (
          <div className={`col-span-2 text-xs ${theme.textMuted} text-center py-3`}>
            All tools are currently optimized.
          </div>
        )}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// INTELLIGENT PAGINATOR ALGORITHM
// -----------------------------------------------------------------------------

export function PdfReport({ data, settings, isPreview = false, previewZoom }: PdfReportProps) {
  const theme = getThemeConfig(settings.theme, settings.chartColor, settings.compactMode);

  // Define block weights (approximate % of A4 height they consume)
  // Adjusted for single-page optimization
  const weights = {
    cover: 0.10,
    kpi: 0.12,
    summary: 0.15,
    charts: 0.22,
    table: 0.20,
    recs: 0.15
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
    if (currentWeight + block.weight > 1.05 && currentPage.length > 0) {
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
      className={isPreview ? "flex flex-col gap-6 w-[210mm] pdf-preview-zoom" : "fixed left-[9999px] top-0 pointer-events-none"} 
      style={isPreview && previewZoom ? { zoom: previewZoom } as React.CSSProperties : undefined}
    >
      {pages.map((pageBlocks, pageIndex) => (
        <PdfPage key={`page-${pageIndex}`} theme={theme} pageNumber={pageIndex + 1} includeFooter={true}>
          {pageBlocks.map(block => block.render())}
        </PdfPage>
      ))}
    </div>
  );
}
