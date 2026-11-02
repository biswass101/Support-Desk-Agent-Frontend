'use client';

import React from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { MobileNav } from './mobile-nav';

interface DashboardShellProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function DashboardShell({
  children,
  title,
  breadcrumbs,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <MobileNav />

      <div className="flex flex-1 flex-col min-w-0">
        <Header title={title} customBreadcrumbs={breadcrumbs} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
