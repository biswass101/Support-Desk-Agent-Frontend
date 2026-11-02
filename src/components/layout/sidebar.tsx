'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Ticket,
  Activity,
  Settings,
  Bot,
  Server,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useHealth } from '@/features/dashboard/hooks/use-health';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'All Tickets',
    href: '/tickets',
    icon: Ticket,
  },
  {
    label: 'Agent Activity',
    href: '/activity',
    icon: Activity,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: health, isLoading: healthLoading, isError: healthError } = useHealth();

  return (
    <aside className="hidden h-screen w-64 flex-col border-r bg-card/60 backdrop-blur-md lg:flex">
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Bot className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-foreground">
            SupportDesk Agent
          </h1>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            AI Operations
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.disabled) {
            return (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium text-muted-foreground/60 cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground/50">
                  Soon
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
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

      <div className="border-t p-4">
        <div className="rounded-xl border bg-muted/30 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-foreground">Backend API</span>
            </div>
            {healthLoading ? (
              <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                Connecting
              </Badge>
            ) : healthError ? (
              <Badge variant="destructive" className="text-[10px] py-0 px-1.5">
                Offline
              </Badge>
            ) : (
              <Badge variant="success" className="text-[10px] py-0 px-1.5">
                Online
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'inline-block h-2 w-2 rounded-full',
                healthLoading && 'bg-amber-500 animate-pulse',
                healthError && 'bg-rose-500',
                !healthLoading && !healthError && 'bg-emerald-500'
              )}
            />
            <span className="text-[11px] text-muted-foreground truncate">
              {health ? health.service : 'http://localhost:5000'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
