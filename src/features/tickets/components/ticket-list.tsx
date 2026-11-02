'use client';

import React, { useState } from 'react';
import {
  Inbox,
  AlertTriangle,
  RotateCw,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TicketFilters, Ticket } from '@/types';
import { useTickets } from '../hooks/use-tickets';
import { TicketFiltersToolbar } from './ticket-filters-toolbar';
import { TicketCard } from './ticket-card';

interface TicketListProps {
  initialFilters?: TicketFilters;
}

export function TicketList({ initialFilters }: TicketListProps) {
  const [filters, setFilters] = useState<TicketFilters>(
    initialFilters || { status: 'ALL', search: '' }
  );

  const { data, isLoading, isError, refetch, isFetching } = useTickets(filters);
  const { data: allData } = useTickets();

  const tickets = data?.tickets || [];
  const allTickets = allData?.tickets || [];

  return (
    <div className="space-y-4">
      <TicketFiltersToolbar
        filters={filters}
        onFilterChange={setFilters}
        tickets={allTickets}
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-5 space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-10 w-full" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-8 w-24" />
              </div>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-3">
            <div className="rounded-full bg-destructive/10 p-3 text-destructive">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Failed to Load Tickets</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Unable to retrieve ticket records from the backend API. Please verify the backend server is running.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="gap-1.5 text-xs h-8"
              disabled={isFetching}
            >
              <RotateCw className="h-3 w-3" />
              <span>Retry Request</span>
            </Button>
          </CardContent>
        </Card>
      ) : tickets.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-3">
            <div className="rounded-full bg-muted p-3 text-muted-foreground">
              <Inbox className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">No Tickets Found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                {filters.search || filters.status !== 'ALL'
                  ? 'No support tickets match your current search and filter criteria.'
                  : 'There are currently no tickets in the database.'}
              </p>
            </div>
            {(filters.search || filters.status !== 'ALL') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ status: 'ALL', search: '' })}
                className="text-xs h-8"
              >
                Clear Search &amp; Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket: Ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
