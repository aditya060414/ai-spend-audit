# Project Reflection

## The "Why"
AI Spend Audit was built to solve the fragmentation in AI tooling costs. As the AI tool ecosystem exploded, so did "subscription bloat."

## Key Successes

### 1. Client-Side PDF Generation
Building a custom PDF engine using `html2canvas` and `jsPDF` was challenging but rewarding. It allowed for high-fidelity reports that perfectly matched the dashboard's design system without the overhead of server-side browser rendering (like Puppeteer).

### 2. Performance Engineering
Achieving a 100/100 score in Accessibility, Best Practices, and SEO was a priority. The performance score (86) is a strong foundation that will improve with further image optimization and dynamic module preloading.

### 3. Type Safety
The use of **Zod** for schema validation across the full stack significantly reduced "silent errors" during development, especially when handling complex audit input shapes.

## Challenges & Learnings

### 1. Responsive Data Visualization
Ensuring that complex spend charts remained legible on small mobile screens required several iterations. The solution was a hybrid approach: simplified bar charts for mobile and detailed multi-axis charts for desktop.

### 2. Email Service Transition
The migration from Resend to Brevo SMTP highlighted the importance of robust environment variable handling and clear error logging for transactional services.

## What's Next?
If I were to continue this project, I would:
1. **Automate Input**: Connect to bank APIs (via Plaid) or email (via Gmail API) to automatically detect AI subscriptions.
2. **Real-time Pricing**: Integrate with a real-time SaaS pricing API to ensure recommendations are always up-to-the-minute.
3. **Team Collaboration**: Allow multiple team members to edit and comment on a shared audit report.
