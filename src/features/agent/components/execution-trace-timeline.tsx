'use client';

import React from 'react';
import {
  Brain,
  Wrench,
  Database,
  Sparkles,
  AlertTriangle,
  Clock,
  Activity,
  Layers,
  Terminal,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExecutionTrace, TraceEventType } from '@/types';
import { TraceJsonViewer } from './trace-json-viewer';
import { cn } from '@/lib/utils';

interface ExecutionTraceTimelineProps {
  traces: ExecutionTrace[];
  startedAt?: string;
  completedAt?: string | null;
  className?: string;
}

interface EventConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeClass: string;
  borderClass: string;
  nodeBg: string;
}

const EVENT_CONFIGS: Record<TraceEventType, EventConfig> = {
  AGENT_DECISION: {
    label: 'Agent Decision',
    icon: Brain,
    badgeClass:
      'bg-purple-500/10 text-purple-700 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    borderClass: 'border-l-purple-500',
    nodeBg: 'bg-purple-500 text-white dark:bg-purple-600',
  },
  TOOL_CALL: {
    label: 'Tool Call',
    icon: Wrench,
    badgeClass:
      'bg-blue-500/10 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    borderClass: 'border-l-blue-500',
    nodeBg: 'bg-blue-500 text-white dark:bg-blue-600',
  },
  TOOL_RESULT: {
    label: 'Tool Result',
    icon: Database,
    badgeClass:
      'bg-teal-500/10 text-teal-700 border-teal-300 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800',
    borderClass: 'border-l-teal-500',
    nodeBg: 'bg-teal-500 text-white dark:bg-teal-600',
  },
  AGENT_RESPONSE: {
    label: 'Final Response',
    icon: Sparkles,
    badgeClass:
      'bg-emerald-500/10 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    borderClass: 'border-l-emerald-500',
    nodeBg: 'bg-emerald-500 text-white dark:bg-emerald-600',
  },
  ERROR: {
    label: 'Execution Error',
    icon: AlertTriangle,
    badgeClass:
      'bg-destructive/10 text-destructive border-destructive/30 dark:bg-destructive/20 dark:border-destructive/50',
    borderClass: 'border-l-destructive',
    nodeBg: 'bg-destructive text-white',
  },
};

export function ExecutionTraceTimeline({
  traces,
  startedAt,
  completedAt,
  className,
}: ExecutionTraceTimelineProps) {
  const sortedTraces = [...traces].sort((a, b) => a.step - b.step);

  const toolCallsCount = sortedTraces.filter(
    (t) => t.eventType === 'TOOL_CALL'
  ).length;

  const totalDurationMs = (() => {
    if (startedAt && completedAt) {
      const start = new Date(startedAt).getTime();
      const end = new Date(completedAt).getTime();
      const diff = end - start;
      if (!Number.isNaN(diff) && diff >= 0) {
        return diff;
      }
    }
    return sortedTraces.reduce((acc, curr) => acc + (curr.durationMs || 0), 0);
  })();

  const formatDuration = (ms: number) => {
    if (ms >= 1000) {
      return `${(ms / 1000).toFixed(2)}s`;
    }
    return `${ms}ms`;
  };

  return (
    <Card className={cn('shadow-sm overflow-hidden', className)}>
      <CardHeader className="border-b bg-muted/20 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold tracking-tight">
                Agent Execution Trace
              </CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">
              Observable step-by-step decision pathway, tool invocations, and synthesized responses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="outline" className="gap-1.5 py-1 px-2.5 font-medium">
              <Layers className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{sortedTraces.length} Steps</span>
            </Badge>

            <Badge
              variant="outline"
              className={cn(
                'gap-1.5 py-1 px-2.5 font-medium',
                toolCallsCount > 0
                  ? 'border-blue-300 text-blue-700 dark:border-blue-800 dark:text-blue-300'
                  : 'text-muted-foreground'
              )}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>
                {toolCallsCount === 0
                  ? '0 Tools (Direct Answer)'
                  : toolCallsCount === 1
                  ? '1 Tool Invocation'
                  : `${toolCallsCount} Tool Invocations`}
              </span>
            </Badge>

            {totalDurationMs > 0 && (
              <Badge variant="outline" className="gap-1.5 py-1 px-2.5 font-medium">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{formatDuration(totalDurationMs)}</span>
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {sortedTraces.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground">
            No execution trace steps recorded for this session.
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
            {sortedTraces.map((trace) => {
              const config = EVENT_CONFIGS[trace.eventType] || EVENT_CONFIGS.AGENT_DECISION;
              const Icon = config.icon;

              const stepTime = (() => {
                try {
                  return new Date(trace.createdAt).toLocaleTimeString();
                } catch {
                  return '';
                }
              })();

              return (
                <div key={trace.id || `${trace.step}-${trace.eventType}`} className="relative group">
                  <div
                    className={cn(
                      'absolute -left-6 sm:-left-8 top-1.5 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-xs font-bold ring-4 ring-background shadow-sm',
                      config.nodeBg
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>

                  <div className="rounded-lg border bg-card p-4 shadow-xs transition-colors hover:border-primary/40 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn('text-[11px] font-semibold px-2 py-0.5', config.badgeClass)}
                        >
                          {config.label}
                        </Badge>

                        {trace.toolName && (
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-muted text-foreground border">
                            {trace.toolName}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="font-mono font-medium">Step {trace.step}</span>
                        {trace.durationMs !== null && trace.durationMs !== undefined && (
                          <>
                            <span>&bull;</span>
                            <span className="font-mono text-foreground font-medium">
                              {trace.durationMs}ms
                            </span>
                          </>
                        )}
                        {stepTime && (
                          <>
                            <span>&bull;</span>
                            <span>{stepTime}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">
                      {trace.message}
                    </p>

                    {trace.parameters !== null && trace.parameters !== undefined && (
                      <TraceJsonViewer
                        label={`Parameters: ${trace.toolName || 'Tool'}`}
                        data={trace.parameters}
                        defaultExpanded={true}
                      />
                    )}

                    {trace.output !== null && trace.output !== undefined && (
                      <TraceJsonViewer
                        label={`Output: ${trace.toolName || 'Tool'}`}
                        data={trace.output}
                        defaultExpanded={true}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

