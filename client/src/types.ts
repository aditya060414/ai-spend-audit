export type Recommendation = "keep" | "upgrade" | "downgrade" | "switch" | "consolidate" | "credits";
export type SavingsCategory = "optimal" | "low" | "medium" | "high" | "critical";

export interface ToolAuditResult {
  toolName: string;
  currentPlan: string;
  currentMonthlySpending: number;
  recommendedAction: Recommendation;
  recommendedPlan: string;
  projectedMonthlyCost: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
  credexEligible: boolean;
}

export interface AuditSummary {
  perTool: ToolAuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  savingsCategory: SavingsCategory;
}

export interface ReportData {
  shareId: string;
  auditResults: AuditSummary;
  aiSummary: string;
  summaryWasFallback: boolean;
}

export type PdfTheme = "dark" | "light";
export type ChartColor = "blue" | "green" | "purple" | "orange" | "monochrome";
export type PdfQuality = "low" | "standard" | "high";

export interface PdfExportSettings {
  theme: PdfTheme;
  chartColor: ChartColor;
  quality: PdfQuality;
  compactMode: boolean;
  includeCharts: boolean;
  includeCover: boolean;
  showRecommendations: boolean;
  showAiSummary: boolean;
}

export interface ToolInput {
  id: string;
  toolName: string;
  currentPlan: string;
  seats: number;
  monthlyCost: number;
  usageIntensity?: "low" | "medium" | "high";
}
