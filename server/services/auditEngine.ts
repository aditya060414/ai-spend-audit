// Types

export type UseCases = 'coding' | 'writing' | 'data' | 'research' | 'learning' | 'mixed';
export type Recommendation = 'keep' | 'upgrade' | 'downgrade' | 'switch' | 'consolidate';
export type SavingsCategory = 'optimal' | 'low' | 'medium' | 'high';

export interface ToolInput {
    toolName: string;
    currentPlan: string;
    seats: number;
    monthlyCost: number;
    usageIntensity?: 'low' | 'medium' | 'high';
}

export interface AuditInput {
    teamSize: number;
    useCases: UseCases;
    tools: ToolInput[]
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
    savingsCategory: SavingsCategory
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
    plans: PlanDef[]
}

const Pricing: Record<string, ToolDef> = {
    Cursor: {
        plans: [

            {
                name: 'Hobby',
                pricePerSeat: 0,
                useCases: ['coding'],
                maxSeats: 1,
            },

            {
                name: 'Pro',
                pricePerSeat: 20,
                useCases: ['coding'],
            },

            {
                name: 'Business',
                pricePerSeat: 40,
                useCases: ['coding'],
            },

        ],
    },


    'GitHub Copilot': {
        plans: [

            {
                name: 'Free',
                pricePerSeat: 0,
                useCases: ['coding'],
                maxSeats: 1,
            },

            {
                name: 'Pro',
                pricePerSeat: 10,
                useCases: ['coding'],
                maxSeats: 1,
            },

            {
                name: 'Pro+',
                pricePerSeat: 39,
                useCases: ['coding'],
                maxSeats: 1,
            },

            {
                name: 'Business',
                pricePerSeat: 19,
                useCases: ['coding'],
            },

            {
                name: 'Enterprise',
                pricePerSeat: 39,
                useCases: ['coding'],
            },

        ],
    },


    Claude: {
        plans: [

            {
                name: 'Free',
                pricePerSeat: 0,
                useCases: ['writing', 'research', 'mixed'],
                maxSeats: 1,
            },

            {
                name: 'Pro',
                pricePerSeat: 20,
                useCases: [
                    'writing',
                    'research',
                    'mixed',
                    'coding',
                ],
            },

            {
                name: 'Max',
                pricePerSeat: 100,
                useCases: [
                    'writing',
                    'research',
                    'mixed',
                    'coding',
                ],
            },

            {
                name: 'Team',
                pricePerSeat: 25,
                minSeats: 5,
                useCases: [
                    'writing',
                    'research',
                    'mixed',
                ],
            },

            {
                name: 'Enterprise',
                pricePerSeat: 0,
                customPricing: true,
                useCases: [
                    'writing',
                    'research',
                    'mixed',
                ],
            },

        ],
    },


    ChatGPT: {
        plans: [

            {
                name: 'Free',
                pricePerSeat: 0,
                useCases: [
                    'writing',
                    'research',
                    'mixed',
                ],
                maxSeats: 1,
            },

            {
                name: 'Go',
                pricePerSeat: 5,
                useCases: [
                    'writing',
                    'research',
                    'mixed',
                ],
                maxSeats: 1,
            },

            {
                name: 'Plus',
                pricePerSeat: 20,
                maxSeats: 1,
                useCases: [
                    'writing',
                    'research',
                    'mixed',
                    'coding',
                ],
            },

            {
                name: 'Pro',
                pricePerSeat: 200,
                maxSeats: 1,
                useCases: [
                    'writing',
                    'research',
                    'mixed',
                    'coding',
                ],
            },

            {
                name: 'Business',
                // Approx monthly equivalent
                pricePerSeat: 26,
                minSeats: 2,
                useCases: [
                    'writing',
                    'research',
                    'mixed',
                    'coding',
                ],
            },

            {
                name: 'Enterprise',
                pricePerSeat: 0,
                customPricing: true,
                useCases: [
                    'writing',
                    'research',
                    'mixed',
                    'coding',
                ],
            },

        ],
    },
}

// check for tools that overlap
const OVERLAP_GROUPS: string[][] = [
    ['Cursor', 'Windsurf'],
    ['Cursor', 'GitHub Copilot'],
    ['Windsurf', 'GitHub Copilot'],
    ['Claude', 'ChatGPT'],
];

function getSavingsCategory(monthly: number): SavingsCategory {
    if (monthly <= 0) return 'optimal';
    else if (monthly <= 100) return 'low';
    else if (monthly <= 200) return 'medium';
    else return 'high'
}

function findPlan(toolName: string, planName: string): PlanDef | undefined {
    return Pricing[toolName]?.plans.find((p) => p.name.toLowerCase() === planName.toLowerCase())
}

function findCheaperPlan(toolName: string, useCases: UseCases, currentPlan: PlanDef, seats: number): PlanDef | null | undefined {
    const toolDef = Pricing[toolName];
    if (!toolDef) return null;

    const options = toolDef.plans.filter((p) => {
        const cheaper = p.pricePerSeat < currentPlan.pricePerSeat;
        const isPaid = p.pricePerSeat > 0;
        const noCustomPricing = !p.customPricing;
        const compatible = (!p.minSeats || p.minSeats <= seats) && (!p.maxSeats || p.maxSeats >= seats);
        const useCaseFit = p.useCases.includes(useCases) || p.useCases.includes('mixed');

        return cheaper && isPaid && noCustomPricing && compatible && useCaseFit;
    });

    if (options.length === 0) return null;

    return options.sort((a, b) => a.pricePerSeat - b.pricePerSeat)[0];
}

function auditSingleTool(tool: ToolInput, input: AuditInput): ToolAuditResult {

    const toolDef = Pricing[tool.toolName]
    if (!toolDef) {
        return {
            toolName: tool.toolName,
            currentPlan: tool.currentPlan,
            currentMonthlySpending: tool.monthlyCost,
            recommendedAction: 'keep',
            recommendedPlan: tool.currentPlan,
            projectedMonthlyCost: tool.monthlyCost,
            monthlySavings: 0,
            annualSavings: 0,
            reason: 'No verified pricing data available. Verify manually at the vendor pricing page.',
        };
    }

    const currentPlanDef = findPlan(tool.toolName, tool.currentPlan);

    if (currentPlanDef?.maxSeats && tool.seats > currentPlanDef.maxSeats) {
        const correctPlan = toolDef.plans.find((p) => {
            (!p.maxSeats || p.maxSeats >= tool.seats) && (!p.minSeats || p.minSeats <= tool.seats)
        });

        if (correctPlan) {
            const projectedMonthly = correctPlan.pricePerSeat * tool.seats;
            const monthlySavings = tool.monthlyCost - projectedMonthly;

            return {
                toolName: tool.toolName,
                currentPlan: tool.currentPlan,
                currentMonthlySpending: tool.monthlyCost,
                recommendedAction: monthlySavings > 0 ? 'downgrade' : 'keep',
                recommendedPlan: correctPlan.name,
                projectedMonthlyCost: projectedMonthly,
                monthlySavings: Math.max(0, monthlySavings),
                annualSavings: Math.max(0, monthlySavings * 12),
                reason:
                    `${tool.currentPlan} supports max ${currentPlanDef.maxSeats} seat(s). ` +
                    `At ${tool.seats} seats, ${correctPlan.name} ($${correctPlan.pricePerSeat}/seat) ` +
                    `is the appropriate tier at $${projectedMonthly}/month.`,
            };
        }
    }
    if (currentPlanDef) {
        const cheaper = findCheaperPlan(tool.toolName, input.useCases, currentPlanDef, tool.seats)

        if (cheaper) {
            const projectedMonthly = cheaper.pricePerSeat * tool.seats;
            const monthlySavings = tool.monthlyCost - projectedMonthly;
            if (monthlySavings > 0) {
                return {
                    toolName: tool.toolName,
                    currentPlan: tool.currentPlan,
                    currentMonthlySpending: tool.monthlyCost,
                    recommendedAction: 'downgrade',
                    recommendedPlan: cheaper.name,
                    projectedMonthlyCost: projectedMonthly,
                    monthlySavings: Math.max(0, monthlySavings),
                    annualSavings: Math.max(0, monthlySavings * 12),
                    reason:
                        `${tool.currentPlan} costs $${currentPlanDef.pricePerSeat}/seat. ` +
                        `${cheaper.name} costs $${cheaper.pricePerSeat}/seat and covers your ` +
                        `${input.useCases} use case at ${tool.seats} seat(s). ` +
                        `Downgrading saves $${monthlySavings}/month ($${monthlySavings * 12}/year).`,
                };
            }
        }
    }
    return {
        toolName: tool.toolName,
        currentPlan: tool.currentPlan,
        currentMonthlySpending: tool.monthlyCost,
        recommendedAction: 'keep',
        recommendedPlan: tool.currentPlan,
        projectedMonthlyCost: tool.monthlyCost,
        monthlySavings: 0,
        annualSavings: 0,
        reason:
            `${tool.currentPlan} at $${currentPlanDef?.pricePerSeat ?? '?'}/seat is ` +
            `appropriately sized for ${tool.seats} seat(s) on a ${input.useCases} use case.`,
    };
}

function consolidateOverLappingTools(
    results: ToolAuditResult[],
    input: AuditInput
): ToolAuditResult[] {
    const updated = results.map((r) => ({ ...r }));
    const presentToolName = input.tools.map((t) => t.toolName);

    for (const group of OVERLAP_GROUPS) {
        const present = group.filter((name) => presentToolName.includes(name));

        if (present.length <= 1) continue;

        const groupResults = present
            .map((name) => updated.find((r) => r.toolName === name)!)
            .sort((a, b) => b.currentMonthlySpending - a.currentMonthlySpending);

        const mostExpensive = groupResults[0];
        const lessExpensive = groupResults[1];

        const idx = updated.findIndex((r) => r.toolName === mostExpensive.toolName);
        if (updated[idx].recommendedAction === 'keep') continue;

        updated[idx] = {
            ...updated[idx],
            recommendedAction: 'consolidate',
            recommendedPlan: lessExpensive.toolName,
            projectedMonthlyCost: 0,
            monthlySavings: mostExpensive.currentMonthlySpending,
            annualSavings: mostExpensive.currentMonthlySpending * 12,
            reason: `${mostExpensive.toolName} and ${lessExpensive.toolName} both provide ` +
                `overlapping AI assistance for your ${input.useCases} workflow. ` +
                `Eliminating ${mostExpensive.toolName} saves $${mostExpensive.currentMonthlySpending}/month ` +
                `($${mostExpensive.currentMonthlySpending * 12}/year) without capability loss.`,

        }
    }
    return updated;

}

export function runAuditEngine(input: AuditInput): AuditSummary {
    let perTool = input.tools.map((tool) => auditSingleTool(tool, input));

    perTool = consolidateOverLappingTools(perTool, input);

    const totalMonthlySavings = perTool.reduce((sum, t) => sum + t.monthlySavings, 0)
    const totalAnnualSavings = perTool.reduce((sum, t) => sum + t.annualSavings, 0)
    const savingsCategory = getSavingsCategory(totalMonthlySavings)

    return {
        perTool,
        totalMonthlySavings,
        totalAnnualSavings,
        savingsCategory
    }
}