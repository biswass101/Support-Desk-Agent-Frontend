'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useTicketDetail } from '../hooks/use-tickets';
import { useTicketExecutions, useExecutionDetail } from '@/features/agent/hooks/use-executions';
import { TicketStatusBadge } from './ticket-status-badge';
import { CustomerInfoCard } from './customer-info-card';
import { OrderInfoCard } from './order-info-card';
import { AgentActionBar } from './agent-action-bar';
import { AgentResultCard } from '@/features/agent/components/agent-result-card';
import { ExecutionTraceTimeline } from '@/features/agent/components/execution-trace-timeline';
import { AgentExecution } from '@/types';

interface TicketDetailViewProps {
  ticketNumber: string;
}

export function TicketDetailView({ ticketNumber }: TicketDetailViewProps) {
  const [latestTriageResult, setLatestTriageResult] = useState<AgentExecution | null>(null);
  const { data: ticket, isLoading, isError, refetch } = useTicketDetail(ticketNumber);
  const { data: executionsList } = useTicketExecutions(ticketNumber);

  const latestExecutionId = executionsList && executionsList.length > 0 ? executionsList[0].id : null;
  const { data: fetchedExecution } = useExecutionDetail(
    !latestTriageResult ? latestExecutionId : null
  );

  const activeExecution = latestTriageResult || fetchedExecution;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-28 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
        </div>
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <Card className="border-destructive/30 bg-destructive/5 p-8 text-center space-y-3">
        <h3 className="font-semibold text-lg text-foreground">Ticket Not Found</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Unable to find support ticket &apos;{ticketNumber}&apos; or connect to the backend server.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/tickets"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            Back to All Tickets
          </Link>
          <Button size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  const createdDate = (() => {
    try {
      return format(parseISO(ticket.createdAt), 'PPP p');
    } catch {
      return ticket.createdAt;
    }
  })();

  const updatedDate = (() => {
    try {
      return format(parseISO(ticket.updatedAt), 'PPP p');
    } catch {
      return ticket.updatedAt;
    }
  })();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div className="flex items-center gap-3">
          <Link
            href="/tickets"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'h-8 px-2 text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground'
            )}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold tracking-tight font-mono text-foreground">
              {ticket.ticketNumber}
            </h2>
            <TicketStatusBadge status={ticket.status} />
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>Created {createdDate}</span>
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Updated {updatedDate}</span>
          </span>
        </div>
      </div>

      <AgentActionBar
        ticket={ticket}
        onExecutionComplete={(exec) => {
          setLatestTriageResult(exec);
          refetch();
        }}
      />

      {activeExecution && <AgentResultCard execution={activeExecution} />}

      {activeExecution && activeExecution.traces && activeExecution.traces.length > 0 && (
        <ExecutionTraceTimeline
          traces={activeExecution.traces}
          startedAt={activeExecution.startedAt}
          completedAt={activeExecution.completedAt}
        />
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span>Customer Message</span>
            </CardTitle>
            <span className="text-[11px] font-mono text-muted-foreground">
              Ticket ID: {ticket.id.slice(0, 8)}...
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted/40 p-4 border text-sm leading-relaxed text-foreground font-medium">
            &ldquo;{ticket.message}&rdquo;
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomerInfoCard customer={ticket.customer} />
        <OrderInfoCard orderId={ticket.orderId} />
      </div>
    </div>
  );
}