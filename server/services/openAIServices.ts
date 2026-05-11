import OpenAI from "openai";
import type { AuditInput, AuditSummary } from "./auditEngine.js";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY || "missing-key",
    });
  }
  return client;
}

// prompt builder
function buildPrompt(input: AuditInput, results: AuditSummary): string {
  const toolSummaries = results.perTool
    .map((tool) => {
      if (tool.recommendedAction === "keep") {
        return `- ${tool.toolName} (${tool.currentPlan}): optimal, no changes needed`;
      }

      return (
        `- ${tool.toolName} (${tool.currentPlan}): ` +
        `${tool.recommendedAction} → ${tool.recommendedPlan}, ` +
        `saves $${tool.monthlySavings}/month. ` +
        `Reason: ${tool.reason}`
      );
    })
    .join("\n");

  return `
You are an AI financial analyst generating a concise AI SaaS spend audit summary.

Your job is to explain the audit findings clearly, accurately, and professionally.

TEAM CONTEXT
-------------
Team size: ${input.teamSize}
Primary use case: ${input.useCases}

AUDIT FINDINGS
--------------
${toolSummaries}

TOTAL SAVINGS
-------------
Monthly savings: $${results.totalMonthlySavings}
Annual savings: $${results.totalAnnualSavings}

Savings category:
${results.savingsCategory}

WRITING REQUIREMENTS
--------------------
Write exactly ONE paragraph between 80-100 words.

The summary MUST:
1. Mention the specific tool names directly
2. Explain the exact savings opportunity using the exact dollar amounts provided
3. Highlight the single biggest optimization opportunity
4. End with one practical next step
5. Sound financially credible and operationally realistic
6. Be concise and executive-friendly

IMPORTANT CONSTRAINTS
---------------------
- When multiple tools provide equal savings opportunities, describe them collectively instead of selecting one arbitrarily.
- NEVER use placeholders like "$X", "TBD", or generic estimates
- NEVER invent pricing, seat counts, or features
- ONLY use information explicitly provided
- Tool seat counts may differ from total team size
- Do not assume every employee uses every tool
- Do not use bullet points
- Do not use headers
- Do not sound overly enthusiastic or salesy
- Avoid marketing language
- Output plain text only

Avoid robotic phrases like:
- "implement the change"
- "confirm the downgrade"

Prefer operational recommendations such as:
- "review feature usage internally"
- "downgrade unused enterprise seats"
- "evaluate actual seat utilization"

GOOD STYLE EXAMPLE
------------------
"Your team currently spends across Cursor and GitHub Copilot for coding workflows. The audit identified approximately $100/month ($1,200/year) in potential savings, primarily from downgrading Cursor Business to Pro for users who do not require enterprise-level features. GitHub Copilot Business appears appropriately sized for the current engineering workflow. The most immediate optimization opportunity is reducing Cursor plan costs while maintaining the same core coding capabilities. Review current feature usage internally and downgrade unused enterprise seats first."

Generate the summary now.
`;
}


// if api fails still generates summary
export function generateFallbackSummary(
  input: AuditInput,
  results: AuditSummary,
): string {
  const toolList = input.tools.map((tool) => tool.toolName).join(", ");

  if (results.savingsCategory === "optimal") {
    return (
      `Your ${input.teamSize}-person team is running a relatively lean AI stack across ${toolList}. ` +
      `Current spending aligns well with your ${input.useCases} workflows, and no major optimization opportunities were identified. ` +
      `Revisit this audit periodically as your team size and AI usage evolve.`
    );
  }

  const biggestSaving = [...results.perTool].sort(
    (a, b) => b.monthlySavings - a.monthlySavings,
  )[0];

  return (
    `Your ${input.teamSize}-person team currently spends across ${toolList} for ${input.useCases} workflows. ` +
    `This audit identified approximately $${results.totalMonthlySavings}/month ` +
    `($${results.totalAnnualSavings}/year) in potential savings. ` +
    `The largest optimization opportunity is ${biggestSaving.toolName}. ` +
    `Review the recommendations below and prioritize that change first.`
  );
}

export async function generateAISummary(
  input: AuditInput,
  results: AuditSummary,
): Promise<{
  summary: string;
  wasFallback: boolean;
}> {
  // Allow local development without API key
  if (!process.env.OPENROUTER_API_KEY) {
    console.warn("OPENROUTER_API_KEY not set — using fallback summary");

    return {
      summary: generateFallbackSummary(input, results),
      wasFallback: true,
    };
  }

  try {
    const ai = getClient();
    const response = await ai.chat.completions.create({
      model: "google/gemini-2.5-flash-lite",

      temperature: 0.4,

      max_tokens: 180,

      messages: [
        {
          role: "user",
          content: buildPrompt(input, results),
        },
      ],
    });

    const summary = response.choices[0]?.message?.content?.trim();

    if (!summary) {
      throw new Error("Empty response from OpenAI");
    }

    return {
      summary,
      wasFallback: false,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    console.error(`OpenAI API error — using fallback summary: ${message}`);

    return {
      summary: generateFallbackSummary(input, results),
      wasFallback: true,
    };
  }
}
