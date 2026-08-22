# 🚀 PayFlow - Financial Workspace & Cash Flow Intelligence Suite

**PayFlow** is a modern, modular financial management platform built specifically for freelancers, consultants, and SMBs (Small & Medium Businesses). It combines smart invoicing, automated multi-channel debt recovery, AI cash flow forecasting, client credit health scoring, and UPI auto-reconciliation into a unified workspace.

---

## 🎥 Live Interactive Preview & Recording

Below is the live recording of **PayFlow** running in Vite:

![PayFlow Browser Interaction Recording](file:///C:/Users/tejas/.gemini/antigravity-ide/brain/60a7c26b-06a2-4d9c-8dc4-a772072bae58/payflow_app_preview_1787318584912.webp)

---

## 🖼️ Visual Feature Walkthrough

![Uploading image.png…]()


## 🛠️ Technology Stack & Project Architecture

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 (TypeScript) |
| **Build Tooling & Server** | Vite 6 |
| **Styling & UI Components** | Tailwind CSS v3, Lucide Icons |
| **Data Visualization** | Recharts (Area, Bar, Pie/Donut charts) |
| **Document Export & Media** | jsPDF, html2canvas, qrcode.react, canvas-confetti |
| **State Management** | Context API (`PayFlowContext`) with LocalStorage Persistence |

---

## 💎 Core Modules Overview

### 1. 📊 Master Financial Dashboard ([`DashboardView.tsx`](file:///c:/Users/tejas/OneDrive/Desktop/payflow/payflow/src/components/dashboard/DashboardView.tsx))
- **Live Metrics Cards**: Total Collected, Outstanding Cash, Overdue Balances, Average Collection Time.
- **Visual Analytics**: Interactive Recharts for Inflow vs Outstanding trends, Receivables distribution, and Top Clients billing.
- **Urgent Action Center**: Quick-trigger buttons for pending invoices and late reminders.

### 2. 📄 Smart Invoicing Engine ([`InvoicingEngine.tsx`](file:///c:/Users/tejas/OneDrive/Desktop/payflow/payflow/src/modules/invoicing/InvoicingEngine.tsx))
- **Multi-Theme Invoices**: Customizable themes (Modern, Classic, Executive, Compact).
- **Instant Payment Links & QR Codes**: UPI QR generator with pre-filled payment details.
- **Automated Tax & GST**: Auto-calculates tax breakdown per line item.
- **PDF & Share**: One-click PDF download and direct WhatsApp payment link share.

### 3. 🚨 Automated Debt Recovery Engine ([`RecoveryEngine.tsx`](file:///c:/Users/tejas/OneDrive/Desktop/payflow/payflow/src/modules/recovery/RecoveryEngine.tsx))
- **Multi-Channel Reminders**: WhatsApp, SMS, and Email follow-ups.
- **AI Escalation Schedules**: Custom reminder schedules based on delay severity.
- **Tone Customization**: Switch between *Polite*, *Friendly*, *Firm*, and *Urgent* notice drafts.

### 4. 🧠 Cashflow Intelligence & AI Analytics ([`IntelligenceEngine.tsx`](file:///c:/Users/tejas/OneDrive/Desktop/payflow/payflow/src/modules/intelligence/IntelligenceEngine.tsx))
- **Actionable AI Insights**: 80/20 Debt Concentration insights, WhatsApp vs Email settlement speed, and optimal payment timing windows.
- **Predictive Risk Scoring**: Client-level cash flow forecasting and liquidity health score.

### 5. 📝 AI Quote & Estimate Generator ([`QuoteGenerator.tsx`](file:///c:/Users/tejas/OneDrive/Desktop/payflow/payflow/src/modules/quotes/QuoteGenerator.tsx))
- **Prompt-to-Quote**: Generate itemized project quotes from natural language descriptions.
- **1-Click Conversion**: Immediately convert accepted quotes into active, trackable invoices.

### 6. 👥 Client CRM & Credit Health ([`ClientCRM.tsx`](file:///c:/Users/tejas/OneDrive/Desktop/payflow/payflow/src/modules/clients/ClientCRM.tsx))
- **Client Directory**: Track client contact information, lifetime billing, outstanding balance, and credit reliability scores (Low / Medium / High Risk).
- **Statement Generator**: Printable client account statements.

### 7. 🏦 UPI & Bank Auto-Reconciliation ([`UpiReconciliation.tsx`](file:///c:/Users/tejas/OneDrive/Desktop/payflow/payflow/src/modules/reconciliation/UpiReconciliation.tsx))
- **Fuzzy UTR Matching**: Auto-matches incoming bank/UPI transactions against unpaid invoices with confidence scoring.

### 8. 🛍️ Modular Add-on Store ([`PricingStore.tsx`](file:///c:/Users/tejas/OneDrive/Desktop/payflow/payflow/src/components/pricing/PricingStore.tsx))
- **Flexible Subscription Model**: Micro-SaaS pricing for individual modules or full pro suite.

### 9. 🕹️ Hackathon Demo Bar ([`HackathonDemoBar.tsx`](file:///c:/Users/tejas/OneDrive/Desktop/payflow/payflow/src/components/demo/HackathonDemoBar.tsx))
- **Interactive Test Drive**: Quick bottom bar to trigger simulated state changes (e.g. simulate overdue payments, test AI reminders, auto-reconcile UPI).

---

## ⚡ Development Commands

```bash
# Install dependencies
npm install

# Start Vite Development Server
npm run dev

# Production Build
npm run build
```
