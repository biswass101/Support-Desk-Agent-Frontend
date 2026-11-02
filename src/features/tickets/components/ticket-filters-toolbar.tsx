'use client';

import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TicketFilters, TicketStatus, Ticket } from '@/types';
import { cn } from '@/lib/utils';

interface TicketFiltersToolbarProps {
  filters: TicketFilters;
  onFilterChange: (filters: TicketFilters) => void;
  tickets?: Ticket[];
}

const statusOptions: { label: string; value: TicketStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Resolved', value: 'RESOLVED' },
  { label: 'Failed', value: 'FAILED' },
];

export function TicketFiltersToolbar({
  filters,
  onFilterChange,
  tickets = [],
}: TicketFiltersToolbarProps) {
  const currentStatus = filters.status || 'ALL';
  const currentSearch = filters.search || '';

  const getStatusCount = (statusVal: TicketStatus | 'ALL') => {
    if (statusVal === 'ALL') return tickets.length;
    return tickets.filter((t) => t.status === statusVal).length;
  };

  const handleStatusClick = (statusVal: TicketStatus | 'ALL') => {
    onFilterChange({
      ...filters,
      status: statusVal,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      search: e.target.value,
    });
  };

  const handleClearSearch = () => {
    onFilterChange({
      ...filters,
      search: '',
    });
  };

  const handleResetAll = () => {
    onFilterChange({
      status: 'ALL',
      search: '',
    });
  };

  const hasActiveFilters = currentStatus !== 'ALL' || currentSearch.length > 0;

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card/60 p-4 shadow-sm backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={currentSearch}
            onChange={handleSearchChange}
            placeholder="Search ticket #, customer, order ID, or message..."
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-8 text-xs sm:text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          {currentSearch.length > 0 && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
              aria-label="Clear Search Input"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetAll}
            className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground self-end sm:self-auto gap-1"
          >
            <Filter className="h-3 w-3" />
            <span>Reset Filters</span>
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t">
        <span className="text-[11px] font-medium text-muted-foreground uppercase mr-1">
          Status:
        </span>
        {statusOptions.map((opt) => {
          const isActive = currentStatus === opt.value;
          const count = getStatusCount(opt.value);

          return (
            <button
              key={opt.value}
              onClick={() => handleStatusClick(opt.value)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all cursor-pointer border',
                isActive
                  ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                  : 'border-transparent bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <span>{opt.label}</span>
              <Badge
                variant={isActive ? 'secondary' : 'outline'}
                className={cn(
                  'h-4 min-w-4 px-1 text-[10px] leading-none',
                  isActive && 'bg-primary-foreground/20 text-primary-foreground'
                )}
              >
                {count}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
}
