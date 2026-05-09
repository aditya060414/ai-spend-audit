# Deployment Guide — AI Spend Audit

This guide provides step-by-step instructions for deploying the AI Spend Audit platform to a production environment (Vercel for Frontend, Render for Backend).

## 1. Backend Deployment (Render)

1. **Connect Repository**: Create a new Web Service on [Render](https://render.com).
2. **Configuration**:
   - **Environment**: Node.js
   - **Build Command**: `cd server && npm install && npm run build` (if applicable) or simply `npm install`.
   - **Start Command**: `cd server && npm run start` (Make sure your `package.json` has a start script).
3. **Environment Variables**:
   - `MONGO_URL`: Your MongoDB Atlas connection string.
   - `OPENROUTER_API_KEY`: For AI analysis.
   - `RESEND_API_KEY`: For sending audit emails.
   - `CLIENT_URL`: `https://ai-spend-audit.vercel.app` (Your frontend URL).
   - `PORT`: `3000` (Render handles this, but usually good to set).

## 2. Frontend Deployment (Vercel)

1. **Connect Repository**: Create a new project on [Vercel](https://vercel.com).
2. **Configuration**:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. **Environment Variables**:
   - `VITE_API_URL`: `https://ai-spend-audit-backend.onrender.com` (Your backend URL).
4. **Vercel Config**:
   - The included `client/vercel.json` will handle SPA routing and proxying.

## 3. Post-Deployment Verification

### ✅ Test Production Flow
- [ ] Visit the Vercel URL.
- [ ] Run a new AI Spend Audit.
- [ ] Verify that the Audit Engine returns recommendations.
- [ ] Copy the Share Link and open in Incognito.
- [ ] **Gating Test**: Verify that the Incognito view shows blurred sections and an "Unlock" CTA.

### ✅ Test Lead Capture
- [ ] Submit the Lead Capture Modal in Incognito.
- [ ] Verify the report unlocks immediately.
- [ ] Check your email (via Resend) for the report summary.

### ✅ Test PDF Export
- [ ] Click "Export Report" in the dashboard.
- [ ] Verify the PDF contains all charts and tables with correct styling.

### ✅ Test Open Graph
- [ ] Paste the URL into [Social Share Preview](https://socialsharepreview.com).
- [ ] Verify the title, description, and preview image appear correctly.
