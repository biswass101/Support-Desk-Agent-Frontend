'use client';

import React from 'react';
import {
  Inbox,
  Clock,
  Cpu,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTickets } from '@/features/tickets/hooks/use-tickets';

export function SummaryCards() {
  const { data, isLoading, isError } = useTickets();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-12" />
          </Card>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        Unable to load dashboard statistics from backend service.
      </div>
    );
  }

  const tickets = data.tickets || [];
  const total = tickets.length;
  const pending = tickets.filter((t) => t.status === 'PENDING').length;
  const processing = tickets.filter((t) => t.status === 'PROCESSING').length;
  const resolved = tickets.filter((t) => t.status === 'RESOLVED').length;
  const failed = tickets.filter((t) => t.status === 'FAILED').length;

  const cards = [
    {
      label: 'Total Tickets',
      value: total,
      icon: Inbox,
      color: 'text-foreground',
      bgColor: 'bg-muted/50',
    },
    {
      label: 'Pending Triage',
      value: pending,
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'In Processing',
      value: processing,
      icon: Cpu,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Resolved',
      value: resolved,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Failed Triage',
      value: failed,
      icon: TrendingUp,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className="border shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">
                  {card.value}
                </p>
              </div>
              <div className={`rounded-lg p-2.5 ${card.bgColor} ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
