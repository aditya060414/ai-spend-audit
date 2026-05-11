# AI Spend Audit Engine — Changelog (Today)

## 1. Core Audit Engine Enhancements
- **Advanced Recommendation Hierarchy**: Refactored logic to prioritize high-impact cross-tool switches and consolidations over simple same-tool downgrades.
- **Credit Recommendation System**: Integrated a "Credits" logic that identifies tools with >$100 monthly spend and no further optimization paths, flagging them for 20-30% credit-based savings.
- **Usage Intensity Logic**: Implemented support for "Low", "Medium", and "High" usage levels.
    - *Low*: Recommends downgrading to free tiers if savings exist.
    - *High*: Alerts users to potential performance bottlenecks or upcoming tier limits.
- **Enterprise Guardrails**: Added strict protection for "Custom" and "Enterprise" plans to prevent the engine from suggesting automated downgrades for negotiated contracts.
- **Overlap Mapping**: Added comprehensive mapping for consumption-based APIs (Anthropic, OpenAI, Gemini) to detect redundant multi-vendor tool spend.

## 2. Pricing & Data Expansion
- **New API Tools**: Added `Anthropic API`, `OpenAI API`, and `Gemini API` with accurate baseline pricing and "usage-based" messaging.
- **Expanded Use-Cases**: Enabled support for `learning` and `data` use cases across all major AI tools.
- **Savings Categories**: Introduced the `critical` category for high-value optimization opportunities (>$500/mo).

## 3. Frontend & User Experience
- **Form Persistence**: Implemented `localStorage` state synchronization, ensuring the audit form retains data across page reloads.
- **Intensity Selector**: Added a high-fidelity segmented control to `ToolCard.tsx` for usage intensity input.
- **Credits Integration**:
    - Added "Credits Available" badges in the `ToolBreakdownTable`.
    - Integrated a "Claim Credits" call-to-action in the `RecommendationsSection`.
- **UI/UX Polishing**:
    - Standardized vertical alignment for all tool card inputs.
    - Improved landing page header impact and metric centering.
    - Optimized responsive layout for ultra-narrow mobile devices.
- **PDF Export System**: Updated the roadmap and table blocks to correctly reflect credit-based savings and the new 'critical' status tier.

## 4. Stability & Reliability
- **Comprehensive Testing**: Expanded the backend test suite to **30 test cases**, covering all logic branches and sanitization rules.
- **AI Summary Fallback**: Implemented a lazy-loading pattern for OpenAI services and verified rule-based fallback generation for offline or credential-free environments.
- **Strict Sanitization**: Hardened the input sanitization layer to prevent invalid "Custom" plan name injections from breaking the finding logic.

---
*Status: All features implemented, tested, and verified.*
