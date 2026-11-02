# SupportDesk Agent Frontend

Production customer support ticket triage dashboard built with Next.js 15, React 19, TypeScript (strict mode), Tailwind CSS, shadcn/ui, TanStack Query, and Zustand.

The dashboard connects to the SupportDesk Agent Express backend to inspect support tickets, trigger autonomous AI triage workflows powered by Google Gemini function calling, and audit multi-step decision pathways in real time.

---

## Table of Contents

- [Architecture and Design Decisions](#architecture-and-design-decisions)
  - [1. Next.js 15 App Router Architecture](#1-nextjs-15-app-router-architecture)
  - [2. State Management Strategy](#2-state-management-strategy)
  - [3. Component Organization](#3-component-organization)
  - [4. Dark Mode and System Theming](#4-dark-mode-and-system-theming)
  - [5. Interactive Trace Streaming and Balanced Ticket Layout](#5-interactive-trace-streaming-and-balanced-ticket-layout)
  - [6. Fixed Full-Height Navigation and Shell](#6-fixed-full-height-navigation-and-shell)
  - [7. System Maintenance Operations](#7-system-maintenance-operations)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Running Alongside the Express Backend](#running-alongside-the-express-backend)
- [Seeded Ticket Evaluation Scenarios](#seeded-ticket-evaluation-scenarios)
  - [Scenario 1: Order Status Lookup (TCK-001)](#scenario-1-order-status-lookup-tck-001)
  - [Scenario 2: Tier Upgrade Inquiry (TCK-002)](#scenario-2-tier-upgrade-inquiry-tck-002)
  - [Scenario 3: General FAQ Inquiry (TCK-003)](#scenario-3-general-faq-inquiry-tck-003)
- [Assumptions and Trade-Offs](#assumptions-and-trade-offs)

---

## Architecture and Design Decisions

### 1. Next.js 15 App Router Architecture
- **Server Components by Default**: Pages and layout shells render on the server where feasible to minimize client bundle size and optimize initial load performance.
- **Client Components on Demand**: Interactive views (such as ticket filtering toolbars, live agent execution action buttons, clipboard copy triggers, and trace timelines) are isolated into explicit client components marked with `'use client'`.
- **Route Segments**:
  - `/`: Main executive operations dashboard with summary metric cards, recent tickets overview, and system health status indicator.
  - `/tickets`: Full ticket directory featuring search, status filtering, and ticket navigation.
  - `/tickets/[ticketNumber]`: Dedicated ticket detail interface with customer metadata, order context, AI triage trigger button, resolution draft card, execution trace timeline, and past execution history.
  - `/activity`: System-wide audit log for inspecting all agent runs, duration metrics, tool call counts, and resolution outcomes.
  - `/executions/[executionId]`: Dedicated execution detail view providing a full deep-dive trace audit of any individual triage session.
  - `/settings`: System configuration and maintenance control center for resetting tickets to pending, restoring sample datasets, purging execution logs, and configuring color theme appearance.

### 2. State Management Strategy
- **Server State (TanStack Query)**:
  - All backend entities (tickets, customer records, executions, traces, health status, and system metadata) are managed via TanStack Query.
  - Features aggressive cache invalidation: when `useTriageTicket`, `useResetToPending`, or `useReseedDatabase` mutations complete, associated query keys are instantly invalidated to ensure real-time UI consistency.
  - Automatic error boundary handling and background revalidation.
- **Client Global State (Zustand)**:
  - Global client UI state (e.g. mobile drawer navigation toggle) is isolated in a lightweight Zustand store (`src/stores/ui-store.ts`).
  - No server data is duplicated into Zustand, preventing state synchronization bugs.

### 3. Component Organization
```
Support-Desk-Agent-Frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── page.tsx
│   │   ├── tickets/
│   │   │   ├── page.tsx
│   │   │   └── [ticketNumber]/page.tsx
│   │   ├── activity/
│   │   │   └── page.tsx
│   │   ├── executions/
│   │   │   └── [executionId]/page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── components/
│   │   ├── theme-toggle.tsx
│   │   ├── ui/
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── separator.tsx
│   │   │   └── skeleton.tsx
│   │   └── layout/
│   │       ├── dashboard-shell.tsx
│   │       ├── header.tsx
│   │       ├── sidebar.tsx
│   │       └── mobile-nav.tsx
│   ├── features/
│   │   ├── dashboard/
│   │   │   ├── components/summary-cards.tsx
│   │   │   ├── hooks/use-health.ts
│   │   │   └── services/dashboard.service.ts
│   │   ├── tickets/
│   │   │   ├── components/ticket-card.tsx
│   │   │   ├── components/ticket-detail-view.tsx
│   │   │   ├── components/ticket-filters-toolbar.tsx
│   │   │   ├── components/ticket-list.tsx
│   │   │   ├── components/ticket-status-badge.tsx
│   │   │   ├── components/customer-info-card.tsx
│   │   │   ├── components/order-info-card.tsx
│   │   │   ├── components/agent-action-bar.tsx
│   │   │   ├── hooks/use-tickets.ts
│   │   │   └── services/ticket.service.ts
│   │   ├── agent/
│   │   │   ├── components/agent-result-card.tsx
│   │   │   ├── components/execution-trace-timeline.tsx
│   │   │   ├── components/resolution-tag-badge.tsx
│   │   │   ├── components/trace-json-viewer.tsx
│   │   │   ├── components/typewriter-text.tsx
│   │   │   ├── hooks/use-triage.ts
│   │   │   ├── hooks/use-executions.ts
│   │   │   └── services/agent.service.ts
│   │   ├── executions/
│   │   │   └── components/execution-history-list.tsx
│   │   └── settings/
│   │       ├── hooks/use-settings.ts
│   │       └── services/settings.service.ts
│   ├── lib/
│   │   ├── axios.ts
│   │   ├── query-client.ts
│   │   └── utils.ts
│   ├── providers/
│   │   ├── query-provider.tsx
│   │   └── theme-provider.tsx
│   ├── stores/
│   │   └── ui-store.ts
│   ├── types/
│   │   ├── api.ts
│   │   ├── customer.ts
│   │   ├── ticket.ts
│   │   ├── agent.ts
│   │   ├── execution.ts
│   │   └── settings.ts
│   └── test/
│       ├── setup.ts
│       └── *.test.tsx
├── package.json
├── tsconfig.json
└── vitest.config.mjs
```

### 4. Dark Mode and System Theming
- **Three-Mode Theme Architecture**: Full support for `light`, `dark`, and `system` modes.
- **Persistent Preferences**: Stores user choice in `localStorage` and listens to `(prefers-color-scheme: dark)` changes in real time.
- **Anti-FOUC Guarantee**: Employs an inline execution script in `RootLayout` with `suppressHydrationWarning` to eliminate flash of white/dark theme during hydration.
- **Dual Controls**: Accessible icon toggle in the top-right header and full segmented radio selector in System Settings.
- **Themed Notifications**: Synchronized with Sonner toaster component for dark-mode toast alerts.

### 5. Interactive Trace Streaming and Balanced Ticket Layout
- **Two-Column Balanced Layout**:
  - **Left Column**: Triage Assessment Result (`AgentResultCard`), Customer Message card, and Execution History list (`ExecutionHistoryList`) stacked vertically.
  - **Right Column**: Agent Execution Trace timeline (`ExecutionTraceTimeline`).
- **Equal-Height Constraint and Independent Scrolling**: The right-column trace card automatically matches the combined height of the three left-column sections on large screens (`items-stretch` with `lg:absolute lg:inset-0`) and provides smooth independent scrolling with `.custom-scrollbar`.
- **Fast Typewriter Streaming**: `TypewriterText` component renders token chunks (~8ms) for snappy, lifelike AI reasoning and customer draft generation.
- **Live Interactive Controls**: Pinned card header with **Replay Trace** and **Skip to End** buttons, step counts, tool invocation badges, and automatic scrolling to follow active executing steps.

### 6. Fixed Full-Height Navigation and Shell
- **Fixed Sidebar**: Fixed `h-screen` sidebar with independent vertical scrolling so navigation remains pinned regardless of content length.
- **Sticky Header**: Glassmorphism backdrop-blur header bar featuring breadcrumb navigation, live ticket count badges, theme toggle, and refresh trigger.
- **Mobile Navigation Drawer**: Responsive slide-over drawer providing full access to all application views (`/`, `/tickets`, `/activity`, `/settings`).

### 7. System Maintenance Operations
- **Reset to Pending**: Resets tickets to `PENDING` status and removes test execution records so triage can be demonstrated repeatedly without restarting containers.
- **Restore Sample Dataset**: Restores and reseeds the sample customer dataset.
- **Clear Triage History**: Purges all execution runs and traces across the database with confirmation toasts.

---

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm 10 or higher
- Running SupportDesk Agent backend server (default: `http://localhost:5000`)

### Installation
1. Install project dependencies:
   ```bash
   cd Support-Desk-Agent-Frontend
   npm install
   ```

2. Configure environment variables:
   Create a `.env.local` file based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

3. Ensure the backend URL is set:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

---

## Available Scripts

- `npm run dev`: Starts the Next.js development server at `http://localhost:3000`.
- `npm run build`: Compiles production build with strict typechecking and route optimization.
- `npm run start`: Starts the Next.js production server.
- `npm run lint`: Runs ESLint to check for code standards and unused variables.
- `npm run typecheck`: Runs TypeScript compiler (`tsc --noEmit`) to verify strict type safety.
- `npm test`: Runs the Vitest test suite with jsdom environment (20 test files, 65 tests).

---

## Running Alongside the Express Backend

For full end-to-end operation, run the backend and frontend simultaneously:

### Terminal 1: Backend
```bash
cd Support-Desk-Agent-Backend
npm install
docker compose up -d
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```
Backend will start on `http://localhost:5000`. Swagger API documentation is available at `http://localhost:5000/api/docs`.

### Terminal 2: Frontend
```bash
cd Support-Desk-Agent-Frontend
npm install
npm run dev
```
Frontend will start on `http://localhost:3000`.

---

## Seeded Ticket Evaluation Scenarios

The system is pre-seeded with three representative tickets to demonstrate autonomous agent triage behavior:

### Scenario 1: Order Status Lookup (TCK-001)
- **Message**: "Where is my package #ORD-9012? It was supposed to arrive yesterday."
- **Customer**: USR-101 (Free tier)
- **Agent Behavior**: The agent detects order ID `ORD-9012` and calls `get_order_status(ORD-9012)`.
- **Classification**: `AUTO_RESOLVE`.
- **Response**: Explains package transit status directly to the customer.

### Scenario 2: Tier Upgrade Inquiry (TCK-002)
- **Message**: "Can you upgrade my account to Enterprise tier?"
- **Customer**: USR-204 (Free tier)
- **Agent Behavior**: The agent detects an upgrade request and calls `get_user_tier(USR-204)`.
- **Classification**: `ESCALATE_TO_SALES`.
- **Response**: Informs the customer that their request has been routed to the sales team.

### Scenario 3: General FAQ Inquiry (TCK-003)
- **Message**: "How do I update my profile picture?"
- **Customer**: USR-309 (Free tier)
- **Agent Behavior**: The agent determines this is a general inquiry requiring zero tool calls.
- **Classification**: `AUTO_RESOLVE`.
- **Response**: Provides step-by-step account settings instructions.

---

## Assumptions and Trade-Offs

- **No Direct LLM Calls from Client**: The frontend never communicates with Google Gemini directly. All prompt construction, tool definitions, execution trace auditing, and fallback handling remain strictly encapsulated in the backend.
- **System Fonts**: The frontend utilizes system font stacks to ensure rapid compilation and offline build stability.
- **Optimistic Concurrency Protection**: The agent action bar locks during processing to prevent accidental double-triage submissions.
