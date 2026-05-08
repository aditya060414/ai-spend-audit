## Day 1 — 06-05-2026

**Hours worked:** 2

**Today's:**
- Read the full assignment carefully and broke the project into frontend, backend, audit engine, and documentation tasks.
- Using MERN stack, as I have already build projects using MERN so this will help me write more clean and efficient code.
- Set up the monorepo structure with separate `client` and `server` folders.
- Initialized the React frontend using Vite + TypeScript.
- Set up the Express backend with TypeScript support.
- Installed core dependencies including Express, Mongoose, Axios, TailwindCSS, React Router, dotenv, and ts-node-dev.
- Configured TailwindCSS and verified frontend + backend development servers were running correctly.
- Researched the assignment requirements more deeply, especially around the audit engine, shareable reports, and lead capture flow.

**Learnings:**
- The assignment is much more product-focused than algorithm-focused.
- The core value of the project is not AI generation, but building believable and financially sensible optimization logic.
- A large portion of the evaluation is based on documentation, reasoning, and execution discipline rather than only UI or backend complexity.

**Blockers / what I'm stuck on:**
- Initially ran into TypeScript module configuration issues with ES Modules vs CommonJS in the backend setup.
- Needed to understand how NodeNext module resolution works with TypeScript imports.

**Plan for tomorrow:**
- Research on pricing and plans of different LLM's.
- Build auditEngine and auditEngine test.
- write all the cases to determine the best plan and give the cheapest plan.

---

## Day 2 - 07-05-2026

**Hours worked:** 5

### Today's Work

#### Research & Pricing Intelligence
- Researched pricing, features, token limits, seat pricing, governance controls, and usage tiers across major AI SaaS platforms:
  - ChatGPT
  - Claude
  - Cursor
  - GitHub Copilot
  - Windsurf

- Compared:
  - monthly vs annual pricing
  - team vs enterprise plans
  - coding vs writing/research use cases
  - overlapping functionality between tools
  - enterprise governance and admin capabilities

- Documented all verified pricing and feature data in `PRICING_DATA.md` for audit engine reference.

---

#### `auditEngine.ts`

Implemented the core SaaS optimization engine logic.

##### Type Definitions
Defined reusable TypeScript types for:
- `UseCases`
- `Recommendation`
- `SavingsCategory`

##### Interfaces
Created reusable interfaces for:
- `ToolInput`
- `AuditInput`
- `ToolAuditResult`
- `AuditSummary`
- `PlanDef`
- `ToolDef`

##### Pricing System
- Built centralized `Pricing` object containing:
  - pricing tiers
  - seat constraints
  - use-case compatibility
  - enterprise/custom pricing flags

##### Audit Logic
Implemented helper functions for:
- plan lookup
- cheapest compatible plan detection
- overlap detection
- monthly and annual savings calculation
- savings category classification

##### Main Audit Engine
Built the main `runAuditEngine()` workflow to:
- analyze current SaaS stack
- recommend downgrades/consolidation
- calculate projected savings
- generate audit summaries

---

#### `auditEngine.test.ts`

Implemented 7 test cases covering:
- valid downgrade recommendations
- overlap consolidation
- annual savings calculations
- unknown tool handling
- honest “no savings” scenarios
- edge cases and pricing validation

All tests passing successfully after debugging recommendation and calculation logic.

---

### Learnings

- Understood differences between:
  - Free / Pro / Team / Enterprise plans
  - subscription pricing vs usage-based pricing
  - coding-focused vs research-focused AI tooling

- Learned:
  - how to structure reusable TypeScript interfaces
  - how TypeScript `Record<>` works
  - how to design deterministic pricing engines
  - how to write and debug unit tests using Vitest
  - how to structure pricing intelligence for SaaS optimization systems

- Improved understanding of:
  - overlap detection
  - SaaS economics
  - audit/recommendation workflows

---

### Blockers

- 3 test cases initially failed due to:
  - incorrect savings calculations
  - overlap logic overwriting downgrade recommendations
  - missing return statement inside `.find()`

- Fixed all issues and validated expected outputs.

---

### Plan for Tomorrow

- Design MongoDB schemas and database structure
- Build Express routes and middleware
- Add API validation and error handling
- Test all backend routes
- Start integrating audit engine with API endpoints