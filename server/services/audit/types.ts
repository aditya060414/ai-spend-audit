export type UseCases =
  | "coding"
  | "writing"
  | "data"
  | "research"
  | "learning"
  | "mixed";

export type Recommendation =
  | "keep"
  | "upgrade"
  | "downgrade"
  | "switch"
  | "consolidate"
  | "credits";

export type SavingsCategory = "optimal" | "low" | "medium" | "high" | "critical";

export interface ToolInput {
  toolName: string;
  currentPlan: string;
  seats: number;
  monthlyCost: number;
  usageIntensity?: "low" | "medium" | "high";
}

export interface AuditInput {
  teamSize: number;
  useCases: UseCases;
  tools: ToolInput[];
}

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

export interface PlanDef {
  name: string;
  pricePerSeat: number;
  minSeats?: number;
  maxSeats?: number;
  customPricing?: boolean;
  useCases: UseCases[];
}

export interface ToolDef {
  plans: PlanDef[];
}
