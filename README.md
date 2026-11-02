# SupportDesk Agent Frontend

Production customer support ticket triage dashboard built with Next.js 15, React 19, TypeScript (strict mode), Tailwind CSS, shadcn/ui, TanStack Query, and Zustand.

The dashboard connects to the SupportDesk Agent Express backend to inspect support tickets, trigger autonomous AI triage workflows powered by Google Gemini function calling, and audit multi-step decision pathways in real time.

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

### 2. State Management Strategy
- **Server State (TanStack Query)**:
  - All backend entities (tickets, customer records, executions, traces, health status) are managed via TanStack Query.
  - Features aggressive cache invalidation: when `useTriageTicket` mutation completes, the ticket detail and ticket list queries are instantly invalidated to ensure real-time UI consistency.
  - Automatic error boundary handling and background revalidation.
- **Client Global State (Zustand)**:
  - Global client UI state (e.g. mobile drawer navigation toggle) is isolated in a lightweight Zustand store (`src/stores/ui-store.ts`).
  - No server data is duplicated into Zustand, preventing state synchronization bugs.

### 3. Component Organization
```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── tickets/
│   │   │   ├── page.tsx
│   │   │   └── [ticketNumber]/page.tsx
│   │   ├── activity/
│   │   │   └── page.tsx
│   │   └── executions/
│   │       └── [executionId]/page.tsx
│   ├── components/
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
│   │   │   ├── hooks/use-triage.ts
│   │   │   ├── hooks/use-executions.ts
│   │   │   └── services/agent.service.ts
│   │   └── executions/
│   │       └── components/execution-history-list.tsx
│   ├── lib/
│   │   ├── axios.ts
│   │   ├── query-client.ts
│   │   └── utils.ts
│   ├── providers/
│   │   └── query-provider.tsx
│   ├── stores/
│   │   └── ui-store.ts
│   ├── types/
│   │   ├── api.ts
│   │   ├── customer.ts
│   │   ├── ticket.ts
│   │   ├── agent.ts
│   │   └── execution.ts
│   └── test/
│       ├── setup.ts
│       └── *.test.tsx
├── package.json
├── tsconfig.json
└── vitest.config.mjs
```

---

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm 10 or higher
- Running SupportDesk Agent backend server (default: `http://localhost:5000`)

### Installation
1. Install project dependencies:
   ```bash
   cd frontend
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
- `npm test`: Runs the Vitest test suite with jsdom environment.

---

## Running Alongside the Express Backend

For full end-to-end operation, run the backend and frontend simultaneously:

### Terminal 1: Backend
```bash
cd backend
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
cd frontend
npm install
npm run dev
```
Frontend will start on `http://localhost:3000`.

---

## Seeded Ticket Evaluation Scenarios

The system is pre-seeded with three representative tickets to demonstrate autonomous agent triage behavior:

### Scenario 1: Order Status Lookup (`TCK-001`)
- **Message**: "Where is my package #ORD-9012? It was supposed to arrive yesterday."
- **Customer**: USR-101 (Free tier)
- **Agent Behavior**: The agent detects order ID `ORD-9012` and calls `get_order_status(ORD-9012)`.
- **Classification**: `AUTO_RESOLVE`.
- **Response**: Explains package transit status directly to the customer.

### Scenario 2: Tier Upgrade Inquiry (`TCK-002`)
- **Message**: "Can you upgrade my account to Enterprise tier?"
- **Customer**: USR-204 (Free tier)
- **Agent Behavior**: The agent detects an upgrade request and calls `get_user_tier(USR-204)`.
- **Classification**: `ESCALATE_TO_SALES`.
- **Response**: Informs the customer that their request has been routed to the sales team.

### Scenario 3: General FAQ Inquiry (`TCK-003`)
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
