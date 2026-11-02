'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Ticket,
  Activity,
  Bot,
  X,
  Server,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUiStore } from '@/stores/ui-store';
import { useHealth } from '@/features/dashboard/hooks/use-health';

export function MobileNav() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  const { data: health, isLoading: healthLoading, isError: healthError } = useHealth();

  if (!sidebarOpen) return null;

  const items = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'All Tickets', href: '/tickets', icon: Ticket },
    { label: 'Agent Activity', href: '/activity', icon: Activity },
  ];

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={() => setSidebarOpen(false)}
      />

      <div className="relative flex w-full max-w-xs flex-1 flex-col bg-card border-r p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-6 border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">SupportDesk Agent</h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Operations
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close Navigation Menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1.5 py-6">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t pt-4">
          <div className="rounded-xl border bg-muted/40 p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <Server className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Backend Status</span>
              </div>
              {healthLoading ? (
                <Badge variant="outline" className="text-[10px]">
                  Checking
                </Badge>
              ) : healthError ? (
                <Badge variant="destructive" className="text-[10px]">
                  Offline
                </Badge>
              ) : (
                <Badge variant="success" className="text-[10px]">
                  Online
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {health ? health.service : 'http://localhost:5000'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
