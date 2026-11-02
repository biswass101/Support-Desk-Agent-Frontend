import React from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { TicketList } from '@/features/tickets/components/ticket-list';

export default function TicketsPage() {
  return (
    <DashboardShell
      title="All Support Tickets"
      breadcrumbs={[{ label: 'Tickets' }]}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Customer Tickets Queue
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Filter, inspect customer context, and trigger autonomous AI triage.
          </p>
        </div>

        <TicketList />
      </div>
    </DashboardShell>
  );
}
