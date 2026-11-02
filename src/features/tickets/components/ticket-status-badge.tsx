import React from 'react';
import { Clock, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TicketStatus } from '@/types';
import { cn } from '@/lib/utils';

interface TicketStatusBadgeProps {
  status: TicketStatus;
  className?: string;
  showIcon?: boolean;
}

export function TicketStatusBadge({
  status,
  className,
  showIcon = true,
}: TicketStatusBadgeProps) {
  switch (status) {
    case 'PENDING':
      return (
        <Badge
          variant="warning"
          className={cn('gap-1.5 font-medium', className)}
        >
          {showIcon && <Clock className="h-3 w-3" />}
          <span>Pending</span>
        </Badge>
      );
    case 'PROCESSING':
      return (
        <Badge
          variant="info"
          className={cn('gap-1.5 font-medium animate-pulse', className)}
        >
          {showIcon && <Cpu className="h-3 w-3 animate-spin" />}
          <span>Processing</span>
        </Badge>
      );
    case 'RESOLVED':
      return (
        <Badge
          variant="success"
          className={cn('gap-1.5 font-medium', className)}
        >
          {showIcon && <CheckCircle2 className="h-3 w-3" />}
          <span>Resolved</span>
        </Badge>
      );
    case 'FAILED':
      return (
        <Badge
          variant="destructive"
          className={cn('gap-1.5 font-medium', className)}
        >
          {showIcon && <AlertCircle className="h-3 w-3" />}
          <span>Failed</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className={className}>
          {status}
        </Badge>
      );
  }
}
