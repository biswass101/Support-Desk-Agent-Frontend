'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import {
  Menu,
  RotateCw,
  ChevronRight,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/ui-store';
import { useTickets } from '@/features/tickets/hooks/use-tickets';
import { toast } from 'sonner';

interface HeaderProps {
  title?: string;
  customBreadcrumbs?: { label: string; href?: string }[];
}

export function Header({ title, customBreadcrumbs }: HeaderProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { toggleSidebar } = useUiStore();
  const { data: ticketsData, isFetching } = useTickets();

  const handleRefresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['tickets'] }),
      queryClient.invalidateQueries({ queryKey: ['backend-health'] }),
    ]);
    toast.success('Dashboard refreshed');
  };

  const getPageTitle = () => {
    if (title) return title;
    if (pathname === '/') return 'Support Operations Dashboard';
    if (pathname === '/tickets') return 'All Support Tickets';
    if (pathname === '/activity') return 'Agent Activity & Observability';
    if (pathname.startsWith('/tickets/')) return 'Ticket Triage View';
    if (pathname.startsWith('/executions/')) return 'Execution Trace Audit';
    return 'SupportDesk';
  };

  const ticketCount = ticketsData?.tickets?.length ?? 0;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-card/80 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle Mobile Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex flex-col justify-center">
          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Link>

            {customBreadcrumbs ? (
              customBreadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.label + idx}>
                  <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-foreground transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-medium text-foreground">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))
            ) : pathname !== '/' ? (
              <>
                <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
                <span className="font-medium text-foreground capitalize">
                  {pathname.split('/')[1] || 'View'}
                </span>
              </>
            ) : null}
          </nav>

          <div className="flex items-center gap-2.5">
            <h1 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
              {getPageTitle()}
            </h1>
            <Badge variant="secondary" className="text-xs font-medium">
              {ticketCount} {ticketCount === 1 ? 'Ticket' : 'Tickets'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isFetching}
          className="h-9 gap-1.5 text-xs font-medium"
        >
          <RotateCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>
    </header>
  );
}