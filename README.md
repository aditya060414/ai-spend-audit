# AI Spend Audit

A production-ready SaaS application for auditing AI tool spending, providing insights, and generating cost-saving recommendations.

## How it Works

1. **Input Data**: Users provide details about their current AI tool usage (e.g., ChatGPT, Claude, Midjourney) via an interactive form on the landing page.
2. **Audit Engine**: The backend `AuditEngine` processes this data using optimized logic and up-to-date pricing datasets to identify inefficiencies and overspending.
3. **AI Insights**: Integration with OpenAI GPT-4o provides intelligent summaries and personalized cost-saving strategies based on the specific usage patterns.
4. **Interactive Report**: A comprehensive dashboard visualizes the findings using charts, breakdown tables, and high-impact recommendation cards.
5. **PDF Export & Sharing**: Users can generate a professional PDF report or share their results via a unique, persistent URL.
6. **Lead Capture**: Built-in lead generation flow captures user interest before revealing advanced savings insights.


## Project Structure

```text
AI-spend-audit/
├── client/                 # Frontend (React + Vite + TypeScript)
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images and icons
│   │   ├── components/     # Reusable UI components
│   │   │   ├── pdf/        # PDF generation components
│   │   │   │   ├── PdfPage.tsx
│   │   │   │   ├── PdfReport.tsx
│   │   │   │   └── theme.ts
│   │   │   ├── AISummaryCard.tsx
│   │   │   ├── EnterpriseCTA.tsx
│   │   │   ├── ExportModal.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HighSavingsCTA.tsx
│   │   │   ├── LeadCaptureModal.tsx
│   │   │   ├── RecommendationsSection.tsx
│   │   │   ├── ReportDashboard.tsx
│   │   │   ├── ShareSection.tsx
│   │   │   ├── SpendChartsSection.tsx
│   │   │   ├── SummaryCards.tsx
│   │   │   ├── ToolBreakdownTable.tsx
│   │   │   └── ToolCard.tsx
│   │   ├── lib/            # API and utility libraries
│   │   │   ├── api.ts
│   │   │   └── utils.ts
│   │   ├── pages/          # Page-level components
│   │   │   ├── LandingPage.tsx
│   │   │   └── ReportPage.tsx
│   │   ├── test/           # Frontend unit and integration tests
│   │   ├── utils/          # Client-side utility functions
│   │   │   └── downloadPdf.ts
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── types.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                 # Backend (Node.js + Express + TypeScript + MongoDB)
│   ├── db/                 # Database connection logic
│   ├── middlewares/        # Express middlewares (validation, rate limiting)
│   │   ├── auditValidator.ts
│   │   └── rateLimiter.ts
│   ├── models/             # Mongoose models (Lead, Report)
│   │   ├── Lead.ts
│   │   └── Report.ts
│   ├── routes/             # API route definitions
│   │   ├── audit.ts
│   │   ├── lead.ts
│   │   └── report.ts
│   ├── services/           # Business logic and external integrations
│   │   ├── auditEngine.ts
│   │   ├── emailService.ts
│   │   └── openAIServices.ts
│   ├── index.ts            # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── ARCHITECTURE.md         # System architecture and design decisions
├── DEPLOYMENT.md           # Deployment instructions
├── DEVLOG.md               # Development progress log
├── PRICING_DATA.md         # Raw pricing data for AI tools
├── PROMPTS.md              # AI prompts used in the project
└── TESTS.md                # Testing strategy and results
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB

### Installation

1. **Clone the repository**
2. **Setup Server**
   ```bash
   cd server
   npm install
   cp .env.example .env # Add your MongoDB URI and OpenAI API Key
   npm run dev
   ```
3. **Setup Client**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Recharts, @react-pdf/renderer
- **Backend**: Node.js, Express, MongoDB, Mongoose, Zod, Resend (for emails)
- **AI Engine**: OpenAI GPT-4o
- **Testing**: Vitest, React Testing Library