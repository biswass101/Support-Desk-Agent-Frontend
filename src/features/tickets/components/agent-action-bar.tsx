'use client';

import React from 'react';
import { Bot, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Ticket, AgentExecution } from '@/types';
import { useTriageTicket } from '@/features/agent/hooks/use-triage';

interface AgentActionBarProps {
  ticket: Ticket;
  onExecutionComplete?: (execution: AgentExecution) => void;
}

export function AgentActionBar({
  ticket,
  onExecutionComplete,
}: AgentActionBarProps) {
  const { mutate: runTriage, isPending, isError, error } = useTriageTicket(
    ticket.ticketNumber,
    {
      onSuccess: (data) => {
        onExecutionComplete?.(data);
      },
    }
  );

  const isProcessing = isPending || ticket.status === 'PROCESSING';

  const handleClick = () => {
    if (isProcessing) return;
    runTriage();
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-card to-card shadow-sm">
      <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">
              Autonomous AI Triage Agent
            </h3>
          </div>
          <p className="text-xs text-muted-foreground max-w-xl">
            Execute Gemini multi-turn function calling to evaluate ticket context, query backend tools if needed, and synthesize a structured response.
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-2 shrink-0">
          <Button
            size="lg"
            onClick={handleClick}
            disabled={isProcessing}
            className="w-full sm:w-auto font-medium gap-2 shadow-sm min-w-[200px]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Agent Processing...</span>
              </>
            ) : ticket.status === 'RESOLVED' ? (
              <>
                <Bot className="h-4 w-4" />
                <span>Re-run AI Triage</span>
              </>
            ) : (
              <>
                <Bot className="h-4 w-4" />
                <span>Run AI Triage Agent</span>
              </>
            )}
          </Button>

          {isProcessing && (
            <p className="text-[11px] text-muted-foreground animate-pulse text-center sm:text-right">
              Evaluating tools &amp; synthesizing resolution...
            </p>
          )}

          {isError && (
            <div className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{error?.message || 'Triage failed. Click to retry.'}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
