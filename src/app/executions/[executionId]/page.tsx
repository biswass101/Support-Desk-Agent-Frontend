'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Ticket, User, Package, MessageSquare } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useExecutionDetail } from '@/features/agent/hooks/use-executions';
import { AgentResultCard } from '@/features/agent/components/agent-result-card';
import { ExecutionTraceTimeline } from '@/features/agent/components/execution-trace-timeline';
import { TicketStatusBadge } from '@/features/tickets/components/ticket-status-badge';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { cn } from '@/lib/utils';

export default function ExecutionDetailPage() {
  const params = useParams();
  const executionId = params.executionId as string;

  const { data: execution, isLoading, isError, refetch } = useExecutionDetail(executionId);

  if (isLoading) {
    return (
      <DashboardShell
        title={`Audit #${executionId.slice(0, 8)}`}
        breadcrumbs={[
          { label: 'Agent Activity', href: '/activity' },
          { label: `Audit #${executionId.slice(0, 8)}` },
        ]}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      </DashboardShell>
    );
  }

  if (isError || !execution) {
    return (
      <DashboardShell
        title="Execution Audit"
        breadcrumbs={[
          { label: 'Agent Activity', href: '/activity' },
          { label: 'Not Found' },
        ]}
      >
        <Card className="border-destructive/30 bg-destructive/5 p-8 text-center space-y-3">
          <h3 className="font-semibold text-lg text-foreground">Execution Not Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Unable to locate execution record with ID &apos;{executionId}&apos;.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              href="/activity"
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
            >
              Back to Agent Activity
            </Link>
            <Button size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title={`Audit #${executionId.slice(0, 8)}`}
      breadcrumbs={[
        { label: 'Agent Activity', href: '/activity' },
        { label: `Audit #${executionId.slice(0, 8)}` },
      ]}
    >
      <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div className="flex items-center gap-3">
          <Link
            href={execution.ticket ? `/tickets/${execution.ticket.ticketNumber}` : '/activity'}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'h-8 px-2 text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground'
            )}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{execution.ticket ? `Back to ${execution.ticket.ticketNumber}` : 'Back to Activity'}</span>
          </Link>

          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight font-mono text-foreground">
              Audit #{execution.id.slice(0, 8)}
            </h2>
          </div>
        </div>

        {execution.ticket && (
          <Link
            href={`/tickets/${execution.ticket.ticketNumber}`}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'h-8 text-xs gap-1.5 font-medium'
            )}
          >
            <Ticket className="h-3.5 w-3.5 text-primary" />
            <span>View Ticket {execution.ticket.ticketNumber}</span>
          </Link>
        )}
      </div>

      {execution.ticket && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3 bg-muted/20 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Ticket className="h-4 w-4 text-primary" />
                <span>Ticket Context ({execution.ticket.ticketNumber})</span>
              </CardTitle>
              <TicketStatusBadge status={execution.ticket.status} />
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">Customer: </span>
                  <span className="font-semibold text-foreground">
                    {execution.ticket.customer?.name || execution.ticket.customer?.externalId || 'Unknown'}
                  </span>
                  <span className="ml-1 text-[11px] font-mono text-muted-foreground">
                    ({execution.ticket.customer?.currentTier} tier)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">Order ID: </span>
                  <span className="font-mono font-semibold text-foreground">
                    {execution.ticket.orderId || 'None'}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-muted/40 p-3 border text-xs sm:text-sm text-foreground">
              <div className="flex items-center gap-1.5 font-medium text-xs text-muted-foreground mb-1">
                <MessageSquare className="h-3 w-3" />
                <span>Customer Inquiry</span>
              </div>
              &ldquo;{execution.ticket.message}&rdquo;
            </div>
          </CardContent>
        </Card>
      )}

      <AgentResultCard execution={execution} />

      {execution.traces && execution.traces.length > 0 && (
        <ExecutionTraceTimeline
          traces={execution.traces}
          startedAt={execution.startedAt}
          completedAt={execution.completedAt}
        />
      )}
    </div>
    </DashboardShell>
  );
}

