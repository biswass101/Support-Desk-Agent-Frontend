import React from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { TicketDetailView } from '@/features/tickets/components/ticket-detail-view';

interface PageProps {
  params: Promise<{
    ticketNumber: string;
  }>;
}

export default async function TicketPage({ params }: PageProps) {
  const { ticketNumber } = await params;

  return (
    <DashboardShell
      title={`Ticket ${ticketNumber}`}
      breadcrumbs={[
        { label: 'Tickets', href: '/tickets' },
        { label: ticketNumber },
      ]}
    >
      <TicketDetailView ticketNumber={ticketNumber} />
    </DashboardShell>
  );
}
