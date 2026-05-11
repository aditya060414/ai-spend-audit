# AI Prompt Engineering & Strategy

This document outlines the design decisions, constraints, and iteration history for the AI-generated audit summaries in the AI Spend Audit platform.

## Overview

The goal of the AI summary is to provide a high-level, executive-friendly overview of the audit findings. It must be financially accurate, concise, and professional, acting as the "hero" content at the top of every report.

---

## The Core Prompt

The system uses a single, highly-constrained user prompt to ensure maximum instruction-following. Below is the structure of the prompt template used in `server/services/openAIServices.ts`.

### Prompt Structure
```text
You are an AI financial analyst generating a concise AI SaaS spend audit summary.
Your job is to explain the audit findings clearly, accurately, and professionally.

TEAM CONTEXT
-------------
Team size: [Team Size]
Primary use case: [Use Cases]

AUDIT FINDINGS
--------------
[List of tools, current plans, recommended actions, and savings]

TOTAL SAVINGS
-------------
Monthly savings: $[Amount]
Annual savings: $[Amount]
Savings category: [Category]

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
1. When multiple tools provide equal savings opportunities, describe them collectively instead of selecting one arbitrarily.
2. NEVER use placeholders like "$X", "TBD", or generic estimates
3. NEVER invent pricing, seat counts, or features
4. ONLY use information explicitly provided
5. Tool seat counts may differ from total team size
6. Do not assume every employee uses every tool
7. Do not use bullet points
8. Do not use headers
9. Do not sound overly enthusiastic or salesy
10. Avoid marketing language
11. Output plain text only

Avoid robotic phrases like:
1. "implement the change"
2. "confirm the downgrade"

Prefer operational recommendations such as:
1. "review feature usage internally"
2. "downgrade unused enterprise seats"
3. "evaluate actual seat utilization"

GOOD STYLE EXAMPLE
------------------
"Your team currently spends across Cursor and GitHub Copilot for coding workflows. The audit identified approximately $100/month ($1,200/year) in potential savings, primarily from downgrading Cursor Business to Pro for users who do not require enterprise-level features. GitHub Copilot Business appears appropriately sized for the current engineering workflow. The most immediate optimization opportunity is reducing Cursor plan costs while maintaining the same core coding capabilities. Review current feature usage internally and downgrade unused enterprise seats first."

Generate the summary now.
```

---

## Design Rationale

### Role Framing: "AI Financial Analyst"
Early versions used a "helpful assistant" persona, which resulted in "fluffy" and indecisive language. Switching to a financial analyst persona produced tighter, more credible copy with specific numbers used confidently.

### Strict Length Constraints
The model is instructed to write **exactly ONE paragraph between 80-100 words**. This forces the model to prioritize the most impactful data points and prevents the summary from becoming a wall of text. `max_tokens: 180` is used as a secondary safety guard at the API level.

### Hallucination Prevention
The **"NEVER invent pricing"** constraint was added after the model occasionally hallucinated plan prices for tools it had outdated training data for (e.g., Windsurf or Gemini).Strictly limit the model to the data provided by our `auditEngine`.

### Contextual Awareness
Explicitly remind the model that **"Tool seat counts may differ from team size."** This prevents the model from making incorrect assumptions about total seat costs and ensures the math in the summary matches the audit logic.

### Temperature Selection (`0.4`)
- **0.7+**: Too creative; occasionally invented tool capabilities.
- **0.2**: Too repetitive; summaries for different audits felt "canned."
- **0.4**: The "sweet spot" for consistency while maintaining a tailored feel for each user.

---

## Iteration History: What Didn't Work

### Single-shot with no constraints
Initially, tried: *"Summarize this AI spend audit in 100 words."* This produced generic marketing copy that was mathematically unreliable.

### Structured Bullet Points
Tested outputting the summary as a list. While scannable, it lacked the "Executive Summary" feel I wanted for the report's hero section. Reverted to high-quality prose.

### System vs. User Role Split
Putting instructions in the `system` role and data in the `user` role occasionally led to the model ignoring constraints. Consolidating everything into a single, structured `user` message improved instruction-following significantly.

### Model Selection
I tested **GPT-4o**, but found that **Gemini 2.5 Flash Lite** (via OpenRouter) provided comparable quality for this specific summarization task at ~2.5x lower latency and significantly lower cost.

---

## Robustness & Fallbacks

To ensure the application remains functional even during API outages or when an API key is missing, implemented a deterministic fallback system.

### `generateFallbackSummary()`
If the AI call fails, the system executes a template-based generator:
- **Optimal Spend**: Returns a "No changes needed" message if the team is already lean.
- **Savings Found**: Automatically identifies and highlights the single largest saving opportunity by tool name and dollar amount.

The response includes a `wasFallback: true` flag, allowing the frontend to optionally notify the user that the summary is template-generated.
