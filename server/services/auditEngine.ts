// Types
export type UseCases =
  | "coding"
  | "writing"
  | "data"
  | "research"
  | "learning"
  | "mixed";

// recommendation
export type Recommendation =
  | "keep"
  | "upgrade"
  | "downgrade"
  | "switch"
  | "consolidate";

// savings category
export type SavingsCategory = "optimal" | "low" | "medium" | "high";

// structure
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
}

export interface AuditSummary {
  perTool: ToolAuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  savingsCategory: SavingsCategory;
}

interface PlanDef {
  name: string;
  pricePerSeat: number;
  minSeats?: number;
  maxSeats?: number;
  customPricing?: boolean;
  useCases: UseCases[];
}

interface ToolDef {
  plans: PlanDef[];
}

/* 
    define each tool with their plans and pricing
    all the pricing are directly referred from the official website and also mentioned in PRICING_DATA.md
 */
const Pricing: Record<string, ToolDef> = {
  Cursor: {
    plans: [
      {
        name: "Hobby",
        pricePerSeat: 0,
        useCases: ["coding"], 
        maxSeats: 1,
      },

      {
        name: "Pro",
        pricePerSeat: 20,
        useCases: ["coding"],
      },

      {
        name: "Business",
        pricePerSeat: 40,
        useCases: ["coding"],
      },
    ],
  },

  "GitHub Copilot": {
    plans: [
      {
        name: "Free",
        pricePerSeat: 0,
        useCases: ["coding"],
        maxSeats: 1,
      },

      {
        name: "Pro",
        pricePerSeat: 10,
        useCases: ["coding"],
        maxSeats: 1,
      },

      {
        name: "Pro+",
        pricePerSeat: 39,
        useCases: ["coding"],
        maxSeats: 1,
      },

      {
        name: "Business",
        pricePerSeat: 19,
        useCases: ["coding"],
      },

      {
        name: "Enterprise",
        pricePerSeat: 39,
        useCases: ["coding"],
      },
    ],
  },

  Claude: {
    plans: [
      {
        name: "Free",
        pricePerSeat: 0,
        useCases: ["writing", "research", "mixed"],
        maxSeats: 1,
      },

      {
        name: "Pro",
        pricePerSeat: 20,
        useCases: ["writing", "research", "mixed", "coding"],
      },

      {
        name: "Max",
        pricePerSeat: 100,
        useCases: ["writing", "research", "mixed", "coding"],
      },

      {
        name: "Team",
        pricePerSeat: 25,
        minSeats: 5,
        useCases: ["writing", "research", "mixed"],
      },

      {
        name: "Enterprise",
        pricePerSeat: 0,
        customPricing: true,
        useCases: ["writing", "research", "mixed"],
      },
    ],
  },

  ChatGPT: {
    plans: [
      {
        name: "Free",
        pricePerSeat: 0,
        useCases: ["writing", "research", "mixed"],
        maxSeats: 1,
      },

      {
        name: "Go",
        pricePerSeat: 5,
        useCases: ["writing", "research", "mixed"],
        maxSeats: 1,
      },

      {
        name: "Plus",
        pricePerSeat: 20,
        maxSeats: 1,
        useCases: ["writing", "research", "mixed", "coding"],
      },

      {
        name: "Pro",
        pricePerSeat: 200,
        maxSeats: 1,
        useCases: ["writing", "research", "mixed", "coding"],
      },

      {
        name: "Business",
        // Approx monthly equivalent
        pricePerSeat: 26,
        minSeats: 2,
        useCases: ["writing", "research", "mixed", "coding"],
      },

      {
        name: "Enterprise",
        pricePerSeat: 0,
        customPricing: true,
        useCases: ["writing", "research", "mixed", "coding"],
      },
    ],
  },
  Windsurf: {
    plans: [
      {
        name: "Free",
        pricePerSeat: 0,
        useCases: ["coding"],
        maxSeats: 1,
      },

      {
        name: "Pro",
        pricePerSeat: 20,
        useCases: ["coding"],
      },

      {
        name: "Max",
        pricePerSeat: 200,
        useCases: ["coding"],
      },

      {
        name: "Team",
        pricePerSeat: 40,
        useCases: ["coding"],
      },

      {
        name: "Enterprise",
        pricePerSeat: 0,
        customPricing: true,
        useCases: ["coding"],
      },
    ],
  },
  Gemini: {
    plans: [
      {
        name: "Free",
        pricePerSeat: 0,
        useCases: ["research", "writing", "mixed"],
      },
      {
        name: "Google AI Pro",
        pricePerSeat: 20,
        useCases: ["coding", "writing", "research", "mixed"],
      },
      {
        name: "Google AI Ultra",
        pricePerSeat: 250,
        useCases: ["coding", "research", "mixed"],
      },
    ],
  },
};

// check for tools that overlap, if user is paying for more than one tool for the similar platform or work.
const OVERLAP_GROUPS: string[][] = [
  ["Cursor", "Windsurf"],
  ["Cursor", "GitHub Copilot"],
  ["Windsurf", "GitHub Copilot"],
  ["Claude", "ChatGPT"],
  ["Claude", "Gemini"],
  ["ChatGPT", "Gemini"],
];

// savings category
function getSavingsCategory(monthly: number): SavingsCategory {
  if (monthly <= 0) return "optimal";
  else if (monthly <= 100) return "low";
  else if (monthly <= 200) return "medium";
  else return "high";
}

// find plan (enterred by the user or currently what plan user is using)
function findPlan(toolName: string, planName: string): PlanDef | undefined {
  return Pricing[toolName]?.plans.find(
    (p) => p.name.toLowerCase() === planName.toLowerCase(),
  );
}

// find cheaper plan and return
function findCheaperPlan(
  toolName: string,
  useCases: UseCases,
  currentPlan: PlanDef,
  seats: number,
): PlanDef | null {
  const toolDef = Pricing[toolName];
  // proceed only if tool is defined
  if (!toolDef) return null;

  // options that are better than current plan and return data only if all the cases are satisfied
  const options = toolDef.plans.filter((p) => {
    const cheaper = p.pricePerSeat < currentPlan.pricePerSeat;
    const isPaid = p.pricePerSeat > 0;
    const noCustomPricing = !p.customPricing;
    const compatible =
      (!p.minSeats || p.minSeats <= seats) &&
      (!p.maxSeats || p.maxSeats >= seats);
    const useCaseFit =
      p.useCases.includes(useCases) || p.useCases.includes("mixed");

    return cheaper && isPaid && noCustomPricing && compatible && useCaseFit;
  });

  // if there is no better plan than the current return.
  if (options.length === 0) return null;

  // sorting baased on price in ascending order
  return options.sort((a, b) => a.pricePerSeat - b.pricePerSeat)[0];
}

// audit function for single tool
function auditSingleTool(tool: ToolInput, input: AuditInput): ToolAuditResult {
  const toolDef = Pricing[tool.toolName];

  // Tool is completely unknown — still produce a useful result
  if (!toolDef) {
    const planLabel = tool.currentPlan || "unspecified plan";
    return {
      toolName: tool.toolName,
      currentPlan: tool.currentPlan || "Custom",
      currentMonthlySpending: tool.monthlyCost,
      recommendedAction: "keep",
      recommendedPlan: tool.currentPlan || "Custom",
      projectedMonthlyCost: tool.monthlyCost,
      monthlySavings: 0,
      annualSavings: 0,
      reason:
        `Your team is using ${tool.toolName} on the ${planLabel} tier for ${tool.seats} seat(s). ` +
        `Since ${tool.toolName} isn't in our verified database, we recommend keeping it at your current $${tool.monthlyCost}/month spend while you manually verify pricing.`,
    };
  }

  // find current plan
  const currentPlanDef = findPlan(tool.toolName, tool.currentPlan);

  // Plan is unknown/blank — use the reported monthlyCost as baseline but still check overlaps
  if (!currentPlanDef) {
    const planLabel = tool.currentPlan || "unspecified plan";
    return {
      toolName: tool.toolName,
      currentPlan: tool.currentPlan || "Custom",
      currentMonthlySpending: tool.monthlyCost,
      recommendedAction: "keep",
      recommendedPlan: tool.currentPlan || "Custom",
      projectedMonthlyCost: tool.monthlyCost,
      monthlySavings: 0,
      annualSavings: 0,
      reason:
        `You've entered ${tool.toolName} on a "${planLabel}" tier. ` +
        `While we recognize ${tool.toolName}, this specific plan isn't in our database yet. ` +
        `We've baselined your current $${tool.monthlyCost}/month spend as the optimal state until further data is available.`,
    };
  }

  // check if the seats exceed plan limit, if not proceed
  if (currentPlanDef?.maxSeats && tool.seats > currentPlanDef.maxSeats) {
    const otherPlan = toolDef.plans.find((p) => {
      return (
        (!p.maxSeats || p.maxSeats >= tool.seats) &&
        (!p.minSeats || p.minSeats <= tool.seats)
      );
    });

    // if plan entered for that tool is correct, calculate monthly and annual saving. Return single audit data.
    if (otherPlan) {
      const projectedMonthly = otherPlan.pricePerSeat * tool.seats;
      const monthlySavings = tool.monthlyCost - projectedMonthly;

      return {
        toolName: tool.toolName,
        currentPlan: tool.currentPlan,
        currentMonthlySpending: tool.monthlyCost,
        recommendedAction: monthlySavings > 0 ? "downgrade" : "keep",
        recommendedPlan: otherPlan.name,
        projectedMonthlyCost: projectedMonthly,
        monthlySavings: Math.max(0, monthlySavings),
        annualSavings: Math.max(0, monthlySavings * 12),
        reason:
          `Your current ${tool.currentPlan} plan supports a maximum of ${currentPlanDef.maxSeats} seat(s). ` +
          `With your team size of ${tool.seats}, the ${otherPlan.name} plan ($${otherPlan.pricePerSeat}/seat) ` +
          `is required, resulting in a $${projectedMonthly}/month cost.`,
      };
    }
  }

  // finds cheaper plan
  if (currentPlanDef) {
    const cheaper = findCheaperPlan(
      tool.toolName,
      input.useCases,
      currentPlanDef,
      tool.seats,
    );

    // if cheaper plan exists
    if (cheaper) {
      const projectedMonthly = cheaper.pricePerSeat * tool.seats;
      const monthlySavings = tool.monthlyCost - projectedMonthly;
      // if monthly savings is greater than 0 (user can save amount)
      if (monthlySavings > 0) {
        return {
          toolName: tool.toolName,
          currentPlan: tool.currentPlan,
          currentMonthlySpending: tool.monthlyCost,
          recommendedAction: "downgrade",
          recommendedPlan: cheaper.name,
          projectedMonthlyCost: projectedMonthly,
          monthlySavings: Math.max(0, monthlySavings),
          annualSavings: Math.max(0, monthlySavings * 12),
          reason:
            `You're paying $${currentPlanDef.pricePerSeat}/seat on the ${tool.currentPlan} plan. ` +
            `The ${cheaper.name} plan costs only $${cheaper.pricePerSeat}/seat and fully supports your ` +
            `${input.useCases} workflow for ${tool.seats} seat(s). ` +
            `Switching will save you $${monthlySavings}/month.`,
        };
      }
    }
  }
  // if cheaper plan does not exist
  return {
    toolName: tool.toolName,
    currentPlan: tool.currentPlan,
    currentMonthlySpending: tool.monthlyCost,
    recommendedAction: "keep",
    recommendedPlan: tool.currentPlan,
    projectedMonthlyCost: tool.monthlyCost,
    monthlySavings: 0,
    annualSavings: 0,
    reason:
      `The ${tool.currentPlan} plan ($${currentPlanDef.pricePerSeat}/seat) is ` +
      `the most cost-effective tier for your ${tool.seats} seat(s) and ${input.useCases} use case. ` +
      `Your current spend of $${tool.monthlyCost}/month is optimal.`,
  };
}

// check if the user is paying for more than one tool that does the same work
function consolidateOverLappingTools(
  results: ToolAuditResult[],
  input: AuditInput,
): ToolAuditResult[] {
  // creates a  copy of result
  const updated = results.map((r) => ({ ...r }));
  // creates a array of tool name
  const presentToolName = input.tools.map((t) => t.toolName);

  // checks for overlapping groups
  for (const group of OVERLAP_GROUPS) {
    const present = group.filter((name) => presentToolName.includes(name));

    // if user does not use more than one tool than move to next
    if (present.length <= 1) continue;

    // for each tool find auditResult and sort in descending order
    const groupResults = present
      .map((name) => updated.find((r) => r.toolName === name)!)
      .sort((a, b) => b.currentMonthlySpending - a.currentMonthlySpending);

    const mostExpensive = groupResults[0];
    const lessExpensive = groupResults[1];

    const idx = updated.findIndex((r) => r.toolName === mostExpensive.toolName);
    if (updated[idx].recommendedAction !== "keep") continue;

    updated[idx] = {
      ...updated[idx],
      recommendedAction: "consolidate",
      recommendedPlan: lessExpensive.toolName,
      projectedMonthlyCost: 0,
      monthlySavings: Number(mostExpensive.currentMonthlySpending) || 0,
      annualSavings: (Number(mostExpensive.currentMonthlySpending) || 0) * 12,
      reason:
        `${mostExpensive.toolName} and ${lessExpensive.toolName} both provide ` +
        `overlapping AI assistance for your ${input.useCases} workflow. ` +
        `Eliminating ${mostExpensive.toolName} saves $${mostExpensive.currentMonthlySpending}/month ` +
        `($${(mostExpensive.currentMonthlySpending * 12).toLocaleString()}/year) without capability loss.`,
    };
  }
  return updated;
}

// main functions
export function runAuditEngine(input: AuditInput): AuditSummary {
  // Sanitize all numeric fields to prevent NaN propagation
  const sanitizedTools = input.tools.map((t) => {
    const seats = Math.max(1, Number(t.seats) || 1);
    const monthlyCost = Math.max(0, Number(t.monthlyCost) || 0);
    return {
      ...t,
      seats,
      monthlyCost,
      currentPlan: (t.currentPlan ?? "").trim(),
      toolName: (t.toolName ?? "").trim(),
    };
  });

  const sanitizedInput: AuditInput = { ...input, tools: sanitizedTools };

  // get audit for single tool using helper function
  let perTool = sanitizedInput.tools.map((tool) => auditSingleTool(tool, sanitizedInput));

  // check for overlapping/duplicate tools
  perTool = consolidateOverLappingTools(perTool, sanitizedInput);

  // Final pass to ensure all numbers are finite and non-negative
  perTool = perTool.map(t => ({
    ...t,
    currentMonthlySpending: Number(t.currentMonthlySpending) || 0,
    projectedMonthlyCost: Number(t.projectedMonthlyCost) || 0,
    monthlySavings: Math.max(0, Number(t.monthlySavings) || 0),
    annualSavings: Math.max(0, Number(t.annualSavings) || 0),
  }));

  const totalMonthlySavings = perTool.reduce(
    (sum, t) => sum + t.monthlySavings,
    0,
  );
  const totalAnnualSavings = perTool.reduce(
    (sum, t) => sum + t.annualSavings,
    0,
  );
  const savingsCategory = getSavingsCategory(totalMonthlySavings);

  return {
    perTool,
    totalMonthlySavings,
    totalAnnualSavings,
    savingsCategory,
  };
}
