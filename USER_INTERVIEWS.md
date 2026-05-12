# USER_INTERVIEWS.md

# User Research & Validation

## Research Constraint

I was only able to collect one direct structured interview response during the development period.

To supplement this, I also analyzed:
- Reddit discussions,
- Hacker News comments,
- startup founder conversations on Twitter/X,
- and public discussions around AI tooling costs and workflow overlap.

The goal was not to fabricate user interviews, but to identify recurring pain points and behavioral patterns from publicly available founder and developer discussions.

---

# Direct Interview Response

## Interview 1 — Solo Freelancer

### Background
- Role: Freelancer
- Company Stage: Solo/Freelancer
- Primary Tools: Claude, Ollama
- Approximate Monthly Spend: ~$1000/month

---

## Key Insights

### 1. AI spend awareness exists, but optimization behavior does not

The participant knew their approximate AI spend immediately, but had never actively downgraded or consolidated tools.

> "No, never downgraded."

This suggests:
- users may recognize AI costs,
- but still lack systems or confidence to optimize them.

---

### 2. Trust depends on recommendation accuracy

When asked what would make them trust the audit results:

> "Accuracy"

The strongest requirement was not:
- UI quality,
- AI-generated writing,
- or report visuals,

but whether the savings recommendations felt financially correct and realistic.

This reinforced the decision to keep the audit engine deterministic and rule-based instead of relying entirely on AI-generated recommendations.

---

### 3. Users want centralized visibility

When asked what would make the tool a “no-brainer”:

> "Calculating the total"

The participant valued:
- consolidated spend visibility,
- not just tool recommendations.

This suggests the product should evolve toward:
- centralized AI spend tracking,
- not only optimization suggestions.

---

### 4. Users care about efficiency more than novelty

When asked about the value of the report:

> "I'll use it to manage the money spent."

The participant framed the tool primarily as:
- operational efficiency,
- not entertainment or experimentation.

---

# Public Research Findings

In addition to the direct interview, I reviewed discussions across:
- Reddit (r/startups, r/ChatGPT, r/LocalLLaMA, r/SaaS)
- Hacker News
- Twitter/X founder discussions

to identify recurring themes around AI tooling spend.

---

# Common Pattern 1 — Overlapping AI Subscriptions

A repeated pattern was teams simultaneously paying for:
- ChatGPT Plus
- Claude Pro
- Cursor
- GitHub Copilot

without clearly differentiating workflows.

Common sentiment:
> “We just kept adding tools without removing old ones.”

This directly validated the overlap-consolidation logic in the audit engine.

---

# Common Pattern 2 — AI Spend Is Rarely Centralized

Many founders described AI spending as:
- fragmented,
- team-driven,
- and difficult to track.

Especially in startups:
- employees independently purchase tools,
- engineering teams experiment rapidly,
- and procurement processes lag behind adoption.

This reinforced the idea that:
AI tooling is currently behaving like “shadow SaaS spend.”

---

# Common Pattern 3 — Founders Want Recommendations, Not Dashboards

Many discussions around SaaS spend tools showed frustration with:
- analytics-heavy dashboards,
- manual categorization,
- and complicated onboarding.

Users preferred:
- fast,
- opinionated,
- actionable recommendations.

This heavily influenced the:
- “instant audit” design,
- and no-login onboarding flow.

---

# Common Pattern 4 — Cost Optimization Is Secondary Until Spend Becomes Painful

Smaller teams often tolerate inefficiency until:
- AI costs exceed several hundred dollars/month,
- or multiple overlapping subscriptions accumulate.

This suggests the strongest activation trigger is:
- a surprisingly high savings number,
- rather than generic budgeting concerns.

---

# Product Decisions Influenced by Research

| Research Insight | Product Decision |
|---|---|
| Users distrust vague AI recommendations | Built deterministic audit engine |
| Teams accumulate overlapping tools | Added consolidation logic |
| Founders prefer low friction | No-login audit flow |
| Users want visibility into total spend | Added savings dashboard |
| Shareability matters for teams | Public report URLs |
| AI spend is fragmented | Multi-tool audit support |

---

# Biggest Takeaway

The strongest repeated signal across both direct and public research was:

Teams are adopting AI tools faster than they are optimizing them.

Most users are not intentionally overspending — they simply lack:
- centralized visibility,
- pricing awareness,
- and confidence in deciding which tools are actually necessary.

AI Spend Audit was designed to reduce that decision friction with fast, explainable, and financially grounded recommendations.