'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Check, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TraceJsonViewerProps {
  label: string;
  data: unknown;
  defaultExpanded?: boolean;
}

export function TraceJsonViewer({
  label,
  data,
  defaultExpanded = false,
}: TraceJsonViewerProps) {
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);

  if (data === null || data === undefined) {
    return null;
  }

  const jsonString =
    typeof data === 'string'
      ? data
      : JSON.stringify(data, null, 2);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      toast.success(`${label} copied`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="mt-2 rounded-lg border border-border/80 bg-muted/30 overflow-hidden text-xs">
      <div className="flex items-center justify-between px-3 py-2 bg-muted/60">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 font-medium text-foreground hover:text-primary transition-colors cursor-pointer text-left"
        >
          {isOpen ? (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <Code2 className="h-3.5 w-3.5 text-primary" />
          <span>{label}</span>
        </button>

        {isOpen && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Copy JSON"
            onClick={handleCopy}
            className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1 text-emerald-500" />
                <span className="text-emerald-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                <span>Copy</span>
              </>
            )}
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="p-3 bg-zinc-950 text-zinc-100 overflow-x-auto">
          <pre className="font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
            {jsonString}
          </pre>
        </div>
      )}
    </div>
  );
}
