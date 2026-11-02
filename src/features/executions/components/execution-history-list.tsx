'use client';

import React from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import {
  History,
  Clock,
  Layers,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { ResolutionTagBadge } from '@/features/agent/components/resolution-tag-badge';
import { AgentExecutionSummary, AgentExecution, ExecutionStatus } from '@/types';
import { cn } from '@/lib/utils';

interface ExecutionHistoryListProps {
  executions: (AgentExecutionSummary | AgentExecution)[];
  selectedExecutionId?: string | null;
  onSelectExecution?: (executionId: string) => void;
  className?: string;
}

export function ExecutionHistoryList({
  executions,
  selectedExecutionId,
  onSelectExecution,
  className,
}: ExecutionHistoryListProps) {
  if (executions.length === 0) {
    return null;
  }

  const renderStatusBadge = (status: ExecutionStatus) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <Badge
            variant="outline"
            className="text-[11px] gap-1 text-emerald-700 border-emerald-300 dark:text-emerald-400 dark:border-emerald-800"
          >
            <CheckCircle2 className="h-3 w-3" />
            <span>Completed</span>
          </Badge>
        );
      case 'RUNNING':
        return (
          <Badge
            variant="outline"
            className="text-[11px] gap-1 text-blue-700 border-blue-300 dark:text-blue-400 dark:border-blue-800 animate-pulse"
          >
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Running</span>
          </Badge>
        );
      case 'FAILED':
        return (
          <Badge variant="destructive" className="text-[11px] gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>Failed</span>
          </Badge>
        );
    }
  };

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
    <Card className={cn('shadow-sm overflow-hidden', className)}>
      <CardHeader className="border-b bg-muted/20 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold tracking-tight">
              Execution History
            </CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {executions.length} {executions.length === 1 ? 'Run' : 'Runs'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-border">
        {executions.map((exec, idx) => {
          const isSelected = selectedExecutionId === exec.id || (!selectedExecutionId && idx === 0);
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
              onClick={() => onSelectExecution?.(exec.id)}
              className={cn(
                'p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors cursor-pointer hover:bg-muted/40',
                isSelected && 'bg-primary/5 border-l-4 border-l-primary'
              )}
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-foreground">
                    #{exec.id.slice(0, 8)}
                  </span>
                  {renderStatusBadge(exec.status)}
                  <ResolutionTagBadge tag={exec.resolutionTag} />
                  {isSelected && (
                    <Badge variant="default" className="text-[10px] py-0 px-1.5 h-4">
                      Active View
                    </Badge>
                  )}
                </div>

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
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <Link
                  href={`/executions/${exec.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'sm' }),
                    'h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1'
                  )}
                >
                  <span>Full Audit</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>

                <ChevronRight className={cn('h-4 w-4 text-muted-foreground', isSelected && 'text-primary')} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

