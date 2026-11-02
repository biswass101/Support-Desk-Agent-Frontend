'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import {
  Activity,
  Search,
  Filter,
  RefreshCw,
  Clock,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Ticket,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ResolutionTagBadge } from '@/features/agent/components/resolution-tag-badge';
import { useAllExecutions } from '@/features/agent/hooks/use-executions';
import { cn } from '@/lib/utils';
import { ExecutionStatus, ResolutionTag } from '@/types';

export default function ActivityPage() {
  const { data: executions = [], isLoading, isError, refetch, isFetching } = useAllExecutions();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ExecutionStatus>('ALL');
  const [tagFilter, setTagFilter] = useState<'ALL' | ResolutionTag>('ALL');

  const filteredExecutions = useMemo(() => {
    return executions.filter((exec) => {
      const matchesStatus = statusFilter === 'ALL' || exec.status === statusFilter;
      const matchesTag = tagFilter === 'ALL' || exec.resolutionTag === tagFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        exec.id.toLowerCase().includes(q) ||
        exec.ticket?.ticketNumber?.toLowerCase().includes(q) ||
        exec.ticket?.customer?.name?.toLowerCase().includes(q) ||
        exec.ticket?.customer?.externalId?.toLowerCase().includes(q) ||
        exec.summary?.toLowerCase().includes(q);

      return matchesStatus && matchesTag && matchesSearch;
    });
  }, [executions, statusFilter, tagFilter, searchQuery]);

  const metrics = useMemo(() => {
    const total = executions.length;
    const completed = executions.filter((e) => e.status === 'COMPLETED').length;
    const autoResolved = executions.filter((e) => e.resolutionTag === 'AUTO_RESOLVE').length;
    const escalated = executions.filter((e) => e.resolutionTag === 'ESCALATE_TO_SALES').length;
    const failed = executions.filter((e) => e.status === 'FAILED').length;

    return { total, completed, autoResolved, escalated, failed };
  }, [executions]);

  const calculateDuration = (
    startedAt: string,
    completedAt: string | null | undefined,
    traces?: { durationMs?: number | null }[]
  ) => {
    if (startedAt && completedAt) {
      const diff = new Date(completedAt).getTime() - new Date(startedAt).getTime();
      if (!Number.isNaN(diff) && diff >= 0) {
        return diff >= 1000 ? `${(diff / 1000).toFixed(2)}s` : `${diff}ms`;
      }
    }
    if (traces && traces.length > 0) {
      const sum = traces.reduce((acc, curr) => acc + (curr.durationMs || 0), 0);
      if (sum > 0) {
        return sum >= 1000 ? `${(sum / 1000).toFixed(2)}s` : `${sum}ms`;
      }
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Agent Activity &amp; Audit Trail
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Complete historical record of autonomous triage agent runs, tool calls, and classification outcomes.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-1.5 h-8 text-xs cursor-pointer"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
          <span>Refresh</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card className="p-3 shadow-xs">
          <div className="text-[11px] text-muted-foreground font-medium">Total Runs</div>
          <div className="text-lg font-bold text-foreground mt-0.5">{metrics.total}</div>
        </Card>

        <Card className="p-3 shadow-xs">
          <div className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            <span>Completed</span>
          </div>
          <div className="text-lg font-bold text-foreground mt-0.5">{metrics.completed}</div>
        </Card>

        <Card className="p-3 shadow-xs">
          <div className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            <span>Auto-Resolved</span>
          </div>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {metrics.autoResolved}
          </div>
        </Card>

        <Card className="p-3 shadow-xs">
          <div className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-amber-500" />
            <span>Escalated</span>
          </div>
          <div className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5">
            {metrics.escalated}
          </div>
        </Card>

        <Card className="p-3 shadow-xs">
          <div className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-destructive" />
            <span>Failed</span>
          </div>
          <div className="text-lg font-bold text-destructive mt-0.5">{metrics.failed}</div>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b bg-muted/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search ticket #, customer, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 text-xs">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground font-medium text-[11px]">Status:</span>
              </div>

              {(['ALL', 'COMPLETED', 'FAILED'] as const).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="h-7 px-2.5 text-[11px] cursor-pointer"
                >
                  {status}
                </Button>
              ))}

              <div className="h-4 w-px bg-border mx-1" />

              {(['ALL', 'AUTO_RESOLVE', 'ESCALATE_TO_SALES'] as const).map((tag) => (
                <Button
                  key={tag}
                  variant={tagFilter === tag ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTagFilter(tag)}
                  className="h-7 px-2.5 text-[11px] cursor-pointer"
                >
                  {tag === 'ALL'
                    ? 'All Tags'
                    : tag === 'AUTO_RESOLVE'
                    ? 'Auto-Resolve'
                    : 'Escalate'}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : isError ? (
            <div className="p-8 text-center space-y-3">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
              <div className="text-sm font-semibold text-foreground">
                Failed to load execution records
              </div>
              <p className="text-xs text-muted-foreground">
                Unable to reach the backend service.
              </p>
              <Button size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : filteredExecutions.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Activity className="h-8 w-8 text-muted-foreground mx-auto" />
              <div className="text-sm font-semibold text-foreground">
                No Agent Executions Found
              </div>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {executions.length === 0
                  ? 'No AI triage executions have run yet. Run a triage agent from any ticket detail page.'
                  : 'No executions match your current filter and search criteria.'}
              </p>
              {executions.length === 0 && (
                <Link
                  href="/tickets"
                  className={cn(buttonVariants({ size: 'sm' }), 'mt-2')}
                >
                  View Tickets
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredExecutions.map((exec) => {
                const duration = calculateDuration(exec.startedAt, exec.completedAt, exec.traces);

                const formattedDate = (() => {
                  try {
                    return format(parseISO(exec.createdAt || exec.startedAt), 'MMM d, yyyy h:mm a');
                  } catch {
                    return exec.createdAt || exec.startedAt;
                  }
                })();

                return (
                  <div
                    key={exec.id}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {exec.ticket && (
                          <Link
                            href={`/tickets/${exec.ticket.ticketNumber}`}
                            className="flex items-center gap-1 font-mono text-xs font-bold text-primary hover:underline"
                          >
                            <Ticket className="h-3.5 w-3.5" />
                            <span>{exec.ticket.ticketNumber}</span>
                          </Link>
                        )}

                        <span className="font-mono text-xs text-muted-foreground">
                          #{exec.id.slice(0, 8)}
                        </span>

                        <Badge
                          variant={
                            exec.status === 'COMPLETED'
                              ? 'secondary'
                              : exec.status === 'FAILED'
                              ? 'destructive'
                              : 'outline'
                          }
                          className="text-[10px] py-0"
                        >
                          {exec.status}
                        </Badge>

                        <ResolutionTagBadge tag={exec.resolutionTag} />
                      </div>

                      {exec.summary && (
                        <p className="text-xs text-foreground/80 line-clamp-1 max-w-2xl font-normal">
                          {exec.summary}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formattedDate}</span>
                        </span>

                        <span className="flex items-center gap-1">
                          <Layers className="h-3 w-3" />
                          <span>{exec.traces?.length || 0} trace steps</span>
                        </span>

                        {duration && (
                          <span className="font-mono text-[11px] text-foreground font-medium">
                            Duration: {duration}
                          </span>
                        )}

                        {exec.ticket?.customer && (
                          <span className="text-[11px]">
                            Customer: {exec.ticket.customer.name || exec.ticket.customer.externalId}
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/executions/${exec.id}`}
                      className={cn(
                        buttonVariants({ variant: 'outline', size: 'sm' }),
                        'h-8 text-xs gap-1.5 shrink-0'
                      )}
                    >
                      <span>Inspect Audit</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
