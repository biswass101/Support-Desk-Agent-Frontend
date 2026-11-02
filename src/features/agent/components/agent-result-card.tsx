'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Bot,
  FileText,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AgentExecution } from '@/types';
import { ResolutionTagBadge } from './resolution-tag-badge';
import { TypewriterText } from './typewriter-text';
import { toast } from 'sonner';

interface AgentResultCardProps {
  execution: AgentExecution;
  animateDraft?: boolean;
}

export function AgentResultCard({ execution, animateDraft = false }: AgentResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!execution.customerResponse) return;
    try {
      await navigator.clipboard.writeText(execution.customerResponse);
      setCopied(true);
      toast.success('Customer response copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy response to clipboard');
    }
  };

  if (execution.status === 'FAILED') {
    return (
      <Card className="border-destructive/40 bg-destructive/5 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="h-5 w-5" />
            <CardTitle className="text-base font-semibold">
              Triage Execution Failed
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <p className="text-destructive font-medium">
            {execution.errorMessage || 'An error occurred during agent triage execution.'}
          </p>
          <p className="text-muted-foreground">
            The execution has been safely audited. You can retry running the agent above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-emerald-500/30 bg-card shadow-sm overflow-hidden">
      <div className="bg-emerald-500/10 px-6 py-3 border-b border-emerald-500/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-foreground tracking-tight">
              Triage Assessment Result
            </span>
            <span className="ml-2 text-[11px] font-mono text-muted-foreground">
              ID: {execution.id.slice(0, 8)}...
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs text-muted-foreground font-medium">
            Classification:
          </span>
          <ResolutionTagBadge tag={execution.resolutionTag} />
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        {execution.summary && (
          <div className="rounded-lg border bg-muted/40 p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <FileText className="h-3.5 w-3.5 text-primary" />
              <span>Agent Synthesis Summary</span>
            </div>
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">
              {execution.summary}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-semibold text-foreground">
                Customer Response Draft
              </h4>
              <Badge variant="outline" className="text-[10px] text-emerald-700 dark:text-emerald-400 border-emerald-300">
                Ready to Send
              </Badge>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8 gap-1.5 text-xs font-medium cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Response</span>
                </>
              )}
            </Button>
          </div>

          <div className="rounded-xl border bg-muted/20 p-5 text-sm sm:text-base leading-relaxed text-foreground font-normal whitespace-pre-wrap selection:bg-primary/20">
            {execution.customerResponse ? (
              <TypewriterText
                text={execution.customerResponse}
                active={animateDraft}
                speedMs={8}
              />
            ) : (
              <span className="text-muted-foreground italic">
                No customer response text generated.
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            <span>
              Execution completed at {new Date(execution.completedAt || execution.createdAt).toLocaleTimeString()}
            </span>
          </div>
          <span className="font-mono text-[11px]">
            Status: {execution.status}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
