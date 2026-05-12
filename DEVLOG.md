## Day 1 - 06-05-2026

**Hours worked:** 2

### Today's Work

- Read the full assignment carefully and broke the project into frontend, backend, audit engine, and documentation tasks.
- Used MERN stack to ensure clean and efficient code based on prior experience.
- Set up the monorepo structure with separate `client` and `server` folders.
- Initialized the React frontend using Vite + TypeScript.
- Set up the Express backend with TypeScript support.
- Installed core dependencies including Express, Mongoose, Axios, TailwindCSS, React Router, dotenv, and ts-node-dev.
- Configured TailwindCSS and verified frontend + backend development servers were running correctly.
- Researched the assignment requirements deeply, focusing on the audit engine, shareable reports, and lead capture flow.

### Learnings

- The assignment is more product-focused than algorithm-focused.
- The core value lies in building believable and financially sensible optimization logic rather than just AI generation.
- Documentation, reasoning, and execution discipline are key evaluation criteria.

### Blockers

- Initially encountered TypeScript module configuration issues (ES Modules vs. CommonJS) in the backend setup.
- Needed to understand `NodeNext` module resolution for TypeScript imports.

### Plan for Tomorrow

- Research pricing and plans for various LLM platforms.
- Build the `auditEngine` and its corresponding tests.
- Define logic for determining optimal and cheapest plans.

---

## Day 2 - 07-05-2026

**Hours worked:** 5

### Today's Work

#### Research & Pricing Intelligence
- Researched pricing, features, token limits, seat pricing, and usage tiers for major AI platforms:
  - ChatGPT, Claude, Cursor, GitHub Copilot, Windsurf.
- Compared monthly vs. annual pricing, team vs. enterprise plans, and overlapping functionality.
- Documented all verified pricing and feature data in `PRICING_DATA.md`.

#### Audit Engine Implementation
- Implemented core SaaS optimization logic in `auditEngine.ts`.
- Defined reusable TypeScript types and interfaces (`UseCases`, `Recommendation`, `ToolInput`, `AuditSummary`, etc.).
- Built a centralized `Pricing` object with tiers, constraints, and compatibility mappings.
- Developed helper functions for plan lookup, cheapest plan detection, and savings calculations.
- Built the `runAuditEngine()` workflow to analyze stacks and generate recommendations.

#### Testing
- Implemented `auditEngine.test.ts` with 7 test cases covering valid downgrades, overlap consolidation, and edge cases.
- All tests passed after refining calculation logic.

### Learnings

- Deepened understanding of SaaS pricing tiers (Free, Pro, Team, Enterprise) and subscription vs. usage-based models.
- Learned to structure complex TypeScript interfaces and use `Record<>` effectively.
- Gained experience in designing deterministic pricing engines and writing unit tests with Vitest.

### Blockers

- Test failures due to incorrect savings calculations and overlap logic overwriting recommendations.
- Debugged and fixed a missing return statement in a `.find()` call.

### Plan for Tomorrow

- Design MongoDB schemas and database structure.
- Build Express routes and middleware with validation and error handling.
- Integrate the audit engine with API endpoints.

---

## Day 3 - 08-05-2026

**Hours worked:** 4.5

### Today's Work

- Built `Report` and `Lead` models with PII isolation (Leads are never exposed via API).
- Implemented middlewares for input validation using `Zod` and rate limiting per IP.
- Created `POST /api/audit` to process user input through the audit engine.
- Created `GET /api/reports/:id` to return reports without PII.
- Created `POST /api/leads` with idempotency checks for duplicate email/shareId combinations.
- Verified all three routes through testing.

### Learnings

- Used `nanoid` for generating secure, non-sequential shareable IDs.
- Mastered `Zod` for schema validation (`safeParse`).
- Implemented "honeypot" fields (hidden CSS features) for bot detection.

### Blockers

- Initially stored duplicate data, leading to unnecessary space consumption.
- Refined PII protection after identifying that lead data wasn't sufficiently isolated.

### Plan for Tomorrow

- Integrate Gemini API for dynamic audit summaries.
- Implement graceful error handling and fallbacks for API failures.
- Set up Resend for transactional emails on lead capture.
- Write `PROMPTS.md` to document AI reasoning and prompts.
- Begin frontend UI design and setup.

---

## Day 4 - 09-05-2026

**Hours worked:** 6

### Today's Work

- Implemented fallback summary logic for when the AI API fails.
- Built `emailService` using **Resend** to send report links to captured leads.
- Integrated OpenRouter API for generating intelligent audit summaries.
- Expanded test coverage for `auditEngine`, `openAIServices`, and `auditValidator`.
- Started UI implementation of the `ReportPage` using TypeScript.

### Learnings

- Learned to design and send email templates using Resend.
- Improved testing and debugging skills for complex asynchronous workflows.
- Optimized prompts for more efficient and accurate result summaries.

### Blockers

- Complexity in testing all edge cases for the audit engine.
- Configuration challenges with Resend email templates.

### Plan for Tomorrow

- Build React frontend: landing page, report dashboard, and PDF preview.
- Implement comprehensive frontend validation for user inputs.
- Create interactive charts (spend/savings) and AI recommendation displays.
- Develop the PDF export system with customization options (themes, quality).

---

## Day 5 - 10-05-2026

**Hours worked:** 10

### Today's Work

#### Landing Page Development
- Designed and implemented a modern, responsive `LandingPage` with smooth Framer Motion animations.
- Integrated real-time form handling and `Zod` validation.
- Added an intelligent suggestion box and instant spending calculations.

#### Report & Dashboard
- Developed the `ReportPage` workflow with robust error handling.
- Built the `ReportDashboard` featuring dynamic visualizations, savings insights, and interactive charts.
- Integrated AI-generated summaries and tool-wise breakdown tables.

#### PDF Export System
- Implemented a comprehensive PDF export feature with:
  - Dark/Light theme support.
  - Customizable chart colors and output quality.
  - Compact mode and configurable content sections (charts, cover page, etc.).
- Integrated lead capture gating for export and share actions.
- Added toast notifications for status updates and feedback.
- Included enterprise and high-savings CTA sections.

### Learnings

- Mastered complex state management for multi-step forms and gated content.
- Learned to generate customizable PDFs on the client-side with dynamic data.
- Improved UI/UX design skills using TailwindCSS and Framer Motion for a premium feel.

### Blockers

- Handling responsive layouts for complex charts on ultra-narrow mobile screens.
- Synchronizing PDF generation themes with the application's global state.

### Plan for Tomorrow

- Finalize production deployment and environment configuration.
- Perform end-to-end testing of the lead capture and email flow.
- Optimize performance and SEO meta tags.

---

## Day 6 - 11-05-2026

**Hours worked:** 8

### Today's Work

- Implemented the responsive **Landing Page** with modern UI components and animations.
- Created a multi-step **UserInputForm** for collecting SaaS tool usage data.
- Developed the **ReportPage** with dynamic sections for AI summaries, spend charts, and recommendations.
- Built an advanced **PDF Export** system supporting themes, quality settings, and content customization.
- Added **Gated Access** for report downloading and sharing, requiring email signup.
- Integrated **Toast Notifications** for user feedback and status updates.
- Created **Email Service** for sending audit reports to leads.
- Implemented **Input Validation** using Zod and secure **Rate Limiting**.

### Learnings

- Mastered client-side PDF generation using html2canvas and jsPDF.
- Implemented responsive design patterns for various screen sizes.
- Integrated backend APIs for dynamic data retrieval and processing.
- Enhanced error handling for a robust user experience.

### Blockers

- Initial challenges with PDF layout and element positioning on different screen sizes.
- Resolved issues with theme synchronization between the frontend and PDF generation.

### Plan for Tomorrow

- Finalize production deployment and environment configuration.
- Perform end-to-end testing of the lead capture and email flow.
- Optimize performance and SEO meta tags.
- Add comprehensive unit and integration tests for the frontend components.

---

## Day 7 - 12-05-2026

**Hours worked:** 6

### Today's Work

#### Performance Optimization
- Improved application performance using **Lazy Loading** for heavy components (Charts, Tool Breakdown Table).
- Deferred loading of heavy chart libraries (Recharts) to reduce initial bundle size.
- Optimized the global CSS and removed unused animation libraries (Framer Motion) to improve First Contentful Paint (FCP).
- Further split chart bundles using dynamic imports for specific chart types.
- Optimized server-side rendering or static site generation for the landing page.
- Removed Resend integration and connected Brevo.
- Complete documentation for the project.

#### Testing & Verification
- Verified backend API endpoints with proper error handling and rate limiting.
- Updated frontend components to handle API responses and edge cases gracefully.
- Verified lead capture and email flow functionality end-to-end.

### Learnings

- Optimized application performance using lazy loading and code splitting techniques.
- Improved First Contentful Paint (FCP) by removing unused libraries and optimizing CSS.
- Verified end-to-end functionality of the application with proper testing and error handling.

### Blockers

- Initial performance bottlenecks due to heavy chart library loading.
- Resolved issues with CSS and animation library optimization for better FCP.

### Plan for Tomorrow

- Finalize production deployment and environment configuration.