# ECONOMICS.md

## What a converted lead is worth to Credex

Credex sells discounted AI infrastructure credits sourced from companies 
that overforecast or pivoted. The discount is described as "real and 
substantial" — estimating 20–30% below retail based on the product's 
own audit messaging.

A typical startup using 3–4 AI tools spends $300–$2,000/month on AI 
tooling. If Credex captures even one tool's spend as a credit purchase:

- Conservative deal: $500 in credits, 25% margin = $125 gross profit
- Mid deal: $1,500 in credits, 25% margin = $375 gross profit  
- Large deal: $5,000 in credits, 25% margin = $1,250 gross profit

Working LTV estimate: **$800 per converted customer** (assumes one 
mid-sized purchase, no repeat). If customers rebuy as usage grows, 
LTV climbs to $2,000–$3,000 over 12 months.

---

## CAC at each GTM channel

| Channel | Estimated CAC | Basis |
|---|---|---|
| Reddit organic (r/startups, r/SideProject) | $0 | Time only |
| Hacker News Show HN | $0 | Time only |
| X/Twitter organic | $0 | Time only |
| Indie Hackers community posts | $0 | Time only |
| Credex existing customer email | $0 | Already owned list |
| Direct founder DMs | $0 | Time only |

At $0 paid CAC, the unit economics are entirely driven by conversion 
rates and time cost of distribution. The tool itself is the acquisition 
asset — it costs nothing to run per user (Vercel free tier handles 
current traffic, MongoDB Atlas free tier handles lead storage).

The one real cost: keeping pricing data current. Estimated 2–3 hours/month 
to verify all 9 tool pricing pages and update PRICING_DATA.md. At a 
$30/hr opportunity cost, that's ~$90/month in maintenance.

---

## Conversion funnel math
Landing page visitors:        1,000  (month 1 target)
Audit form started:             400  (40% — low friction, no login)
Audit completed:                280  (70% completion rate)
Email captured:                  70  (25% of completions)
High-savings result (>$500):     28  (40% of completions show critical savings)
Credex CTA clicked:               6  (20% CTR on critical-savings CTA)
Consultation booked:              3  (50% of clicks book)
Credit purchase closed:           1  (33% close rate)

Revenue per 1,000 visitors: **$800**
CAC: **$0**
Payback period: **immediate**

---

## What would have to be true for $1M ARR in 18 months

$1M ARR = $83,333/month in credit sales  
At $800 average deal size: **104 new customers/month**

Working backwards through the funnel:

| Stage | Required monthly volume |
|---|---|
| Credit purchases | 104 |
| Consultations (33% close) | 315 |
| CTA clicks (50% book) | 630 |
| Critical-savings audits (20% CTR) | 3,150 |
| Total audits completed (40% critical) | 7,875 |
| Audit form starts (70% complete) | 11,250 |
| Landing page visitors (40% start) | 28,125 |

**28,125 visitors/month by month 18.**

To get there from zero requires:
1. At least 2 high-traffic distribution events — HN front page 
   or Product Hunt launch each drive 2,000–5,000 visitors in a day
2. The shareable URL viral loop working at k > 0.3 
   (every 10 audits generates 3 more via sharing)
3. Credex actively promoting the tool to its existing customer 
   base — that list is pre-qualified and the highest-converting channel
4. SEO compounding over 12+ months on queries like 
   "cursor vs github copilot cost" and "reduce AI tool costs startup"

This is achievable but requires all four working simultaneously. 
If only organic distribution works without the viral loop or 
Credex's existing network, the realistic ceiling is 
~$150K ARR from the tool alone in 18 months.

---

## The assumptions most likely to be wrong

**1. Consultation → purchase close rate (assumed 33%)**
This is the biggest unknown. If founders book consultations but 
don't convert because Credex's credit offering doesn't fit their 
purchasing process (PO required, legal review, etc.), 
the entire funnel math breaks. 
Validate this in the first 10 consultations before optimizing 
top-of-funnel.

**2. Audit → email capture rate (assumed 25%)**
If the value shown isn't compelling enough to earn an email, 
this drops to 5–10% and the funnel produces 3–4x fewer leads. 
The fix is A/B testing the email capture copy and timing — 
currently shown after results, which is correct per spec, 
but the framing matters.

**3. Average deal size (assumed $800)**
If most converted leads are small startups buying $200 in credits 
rather than scaling teams buying $2,000+, LTV drops significantly. 
Early data from the first 20 purchases will reveal the true 
distribution quickly.

---

## Sensitivity analysis

| Scenario | Close rate | Deal size | Monthly revenue at 28k visitors |
|---|---|---|---|
| Pessimistic | 15% | $400 | ~$19,000 |
| Base case | 33% | $800 | ~$83,000 |
| Optimistic | 50% | $1,500 | ~$236,000 |

The base case requires $1M ARR. The pessimistic case produces 
~$228K ARR — still a meaningful lead gen asset for Credex at $0 CAC. 
The tool has positive expected value even if it never hits $1M ARR.

---

## Why this tool makes sense for Credex even if conversions are low

Even at 1% audit-to-purchase conversion (pessimistic):
- 280 audits/month × 1% = 3 purchases
- 3 × $800 = $2,400/month
- $28,800/year from a tool that costs ~$90/month to maintain

The tool pays for itself in 2 purchases. Every additional conversion 
is pure margin. The real value is also in the email list — 70 captured 
leads/month is 840 leads/year of pre-qualified startup founders 
who have already demonstrated they care about AI spend. 
That list has value beyond the direct credit sales.
