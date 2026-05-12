# TESTS.md

## Testing Strategy

The project uses automated tests to validate the correctness and stability of the audit engine, recommendation system, savings calculations, and overlapping-tool optimization logic.

The primary goal of the test suite is to ensure that financially impactful recommendations remain deterministic, explainable, and resistant to regression as pricing data and recommendation rules evolve.

The project uses:
- Vitest for unit testing
- TypeScript for type-safe test coverage
- GitHub Actions for CI validation on every push to `main`

---

# Test Setup

## Install Dependencies

```bash
npm install
```

## Run Test Suite

```bash
npm run test
```

## Run Tests in Watch Mode

```bash
# From the root or server directory
npm run test:watch
```

---

# Automated Tests

### 1. [auditSingleTool.test.ts](file:///c:/coding/Web%20Development/FULL%20STACK/Project/MERN/AI-spend-audit/server/test/auditSingleTool.test.ts)
Covers individual tool audit logic, including plan lookups, downgrades, upgrades, and usage-based adjustments.
- **Key Assertions**:
  - Invalid tool/plan handling
  - Upgrade/Downgrade detection
  - Seat limit enforcement
  - High usage intensity overrides

### 2. [crossToolRecommendation.test.ts](file:///c:/coding/Web%20Development/FULL%20STACK/Project/MERN/AI-spend-audit/server/test/crossToolRecommendation.test.ts)
Validates recommendations to switch between tools (e.g., Cursor to VS Code + Copilot) and Credex credit eligibility.
- **Key Assertions**:
  - Migration feasibility based on use cases
  - Savings thresholds for tool switches
  - Credex credit eligibility triggers

### 3. [consolidateOverLappingTools.test.ts](file:///c:/coding/Web%20Development/FULL%20STACK/Project/MERN/AI-spend-audit/server/test/consolidateOverLappingTools.test.ts)
Ensures that redundant tools (e.g., having both ChatGPT and Claude) are correctly identified and consolidated.
- **Key Assertions**:
  - Duplicate use case detection
  - Savings recalculation after consolidation
  - Preservation of the most cost-effective tool

### 4. [getSavingsCategory.test.ts](file:///c:/coding/Web%20Development/FULL%20STACK/Project/MERN/AI-spend-audit/server/test/getSavingsCategory.test.ts)
Tests the classification of savings into categories (Optimal, Low, Medium, High, Critical).
- **Key Assertions**:
  - $0 monthly savings returns "optimal"
  - $50 monthly savings returns "low"
  - $700 monthly savings returns "critical"

### 5. [generateFallbackSummary.test.ts](file:///c:/coding/Web%20Development/FULL%20STACK/Project/MERN/AI-spend-audit/server/test/generateFallbackSummary.test.ts)
Validates the rule-based summary generation used when AI services are unavailable.
- **Key Assertions**:
  - Deterministic text generation based on results
  - Inclusion of specific tool names and savings
  - Formatting stability

### 6. [pricingHelpers.test.ts](file:///c:/coding/Web%20Development/FULL%20STACK/Project/MERN/AI-spend-audit/server/test/pricingHelpers.test.ts)
Tests the core pricing lookup and comparison utilities.
- **Key Assertions**:
  - Correct plan identification
  - Cheaper/Upgrade plan filtering
  - Free plan availability checks


---

# Frontend Component Tests

### [client/src/test/](file:///c:/coding/Web%20Development/FULL%20STACK/Project/MERN/AI-spend-audit/client/src/test/)
The frontend test suite validates UI responsiveness, state management, and user interaction flows using Vitest and React Testing Library.

- **LandingPage.test.tsx**: Verifies the hero section, tool selection form, and audit initiation flow.
- **ReportDashboard.test.tsx**: Ensures savings data, charts, and recommendations render correctly from audit results.
- **LeadCaptureModal.test.tsx**: Validates the gated report flow and email collection logic.
- **PdfReport.test.tsx**: Tests the generation and rendering of the printable audit summary.
- **ToolBreakdownTable.test.tsx**: Verifies that tool-specific data (current spend, savings, recommendations) is displayed accurately.
- **ExportModal.test.tsx**: Ensures the export options (PDF, CSV, Image) are functional and accessible.

**Key Assertions**:
- Correct rendering of financial data and savings categories
- Form validation and error state handling
- Modal visibility and gated content accessibility
- Responsive layout adjustments across different viewports

---

# CI/CD Validation

The project includes a GitHub Actions workflow located at:
[.github/workflows/ci.yml](file:///c:/coding/Web%20Development/FULL%20STACK/Project/MERN/AI-spend-audit/.github/workflows/ci.yml)

The CI pipeline automatically:
1. Installs dependencies
2. Runs lint checks
3. Executes the full test suite
4. Validates build stability on every push to `main`

---

# Why Testing Focused Primarily on the Audit Engine

The audit engine is the highest-risk and most business-critical component of the platform because:
- Incorrect calculations reduce trust
- Invalid recommendations damage credibility
- Pricing regressions directly impact user-facing savings estimates

Most tests focus on deterministic financial logic, but the frontend also includes comprehensive component testing using Vitest and React Testing Library.

# Future Testing Improvements

Planned future improvements include:
- Integration testing for full audit generation flows
- End-to-end testing with Playwright for the report dashboard
- Snapshot testing for PDF report rendering
- API contract testing for the backend-frontend interface
- Performance benchmarking for large-scale enterprise audits
