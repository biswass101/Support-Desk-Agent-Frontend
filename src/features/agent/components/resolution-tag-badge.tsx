import React from 'react';
import { CheckCircle2, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ResolutionTag } from '@/types';
import { cn } from '@/lib/utils';

interface ResolutionTagBadgeProps {
  tag: ResolutionTag | null | undefined;
  className?: string;
  showIcon?: boolean;
}

export function ResolutionTagBadge({
  tag,
  className,
  showIcon = true,
}: ResolutionTagBadgeProps) {
  if (!tag) {
    return (
      <Badge variant="outline" className={className}>
        Unclassified
      </Badge>
    );
  }

  if (tag === 'AUTO_RESOLVE') {
    return (
      <Badge
        variant="success"
        className={cn(
          'gap-1.5 px-3 py-1 text-xs font-semibold tracking-wide border-emerald-300 dark:border-emerald-700',
          className
        )}
      >
        {showIcon && <CheckCircle2 className="h-3.5 w-3.5" />}
        <span>Auto-Resolve</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="warning"
      className={cn(
        'gap-1.5 px-3 py-1 text-xs font-semibold tracking-wide border-amber-300 dark:border-amber-700 bg-amber-500/15 text-amber-800 dark:text-amber-300',
        className
      )}
    >
      {showIcon && <TrendingUp className="h-3.5 w-3.5" />}
      <span>Escalate to Sales</span>
    </Badge>
  );
}
