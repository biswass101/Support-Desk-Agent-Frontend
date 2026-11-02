import React from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { SummaryCards } from '@/features/dashboard/components/summary-cards';
import { TicketList } from '@/features/tickets/components/ticket-list';

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Operations Overview
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time status of support tickets and autonomous triage metrics.
          </p>
        </div>

        <SummaryCards />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              Tickets Queue
            </h3>
          </div>
          <TicketList />
        </div>
      </div>
    </DashboardShell>
  );
}