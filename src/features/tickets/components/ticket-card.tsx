import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow, parseISO } from 'date-fns';
import {
  User,
  Package,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Ticket } from '@/types';
import { TicketStatusBadge } from './ticket-status-badge';

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  const formattedDate = (() => {
    try {
      return formatDistanceToNow(parseISO(ticket.createdAt), { addSuffix: true });
    } catch {
      return ticket.createdAt;
    }
  })();

  return (
    <Card className="hover:border-primary/40 hover:shadow-md transition-all group">
      <CardContent className="p-5 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-sm font-bold text-foreground">
              {ticket.ticketNumber}
            </span>
            <TicketStatusBadge status={ticket.status} />
            {ticket.customer.currentTier && (
              <Badge variant="outline" className="text-[11px] font-normal">
                {ticket.customer.currentTier} Tier
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <p className="text-sm text-foreground/90 font-medium line-clamp-2 leading-relaxed">
          &ldquo;{ticket.message}&rdquo;
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span>
                {ticket.customer.name || ticket.customer.externalId}
                <span className="ml-1 text-[11px] text-muted-foreground/70">
                  ({ticket.customer.externalId})
                </span>
              </span>
            </div>

            {ticket.orderId ? (
              <div className="flex items-center gap-1.5 font-mono text-primary font-medium">
                <Package className="h-3.5 w-3.5 text-primary" />
                <span>{ticket.orderId}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-muted-foreground/60 italic">
                <Package className="h-3.5 w-3.5" />
                <span>No Order</span>
              </div>
            )}
          </div>

          <Link
            href={`/tickets/${ticket.ticketNumber}`}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'group-hover:bg-primary group-hover:text-primary-foreground transition-colors ml-auto h-8 px-3 text-xs gap-1.5'
            )}
          >
            <span>Inspect &amp; Triage</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}