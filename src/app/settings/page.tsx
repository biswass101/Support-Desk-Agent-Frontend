'use client';

import React from 'react';
import {
  Settings,
  Database,
  Cpu,
  Server,
  RotateCcw,
  Sparkles,
  Trash2,
  AlertCircle,
  Loader2,
  Layers,
  Users,
  Ticket,
  Sun,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  useSystemInfo,
  useResetToPending,
  useReseedDatabase,
  useClearAllData,
} from '@/features/settings/hooks/use-settings';
import { DashboardShell } from '@/components/layout/dashboard-shell';

export default function SettingsPage() {
  const { data: systemInfo, isLoading, isError, refetch } = useSystemInfo();

  const resetMutation = useResetToPending();
  const reseedMutation = useReseedDatabase();
  const clearMutation = useClearAllData();

  const isMutating =
    resetMutation.isPending ||
    reseedMutation.isPending ||
    clearMutation.isPending;

  const formatUptime = (seconds?: number) => {
    if (!seconds && seconds !== 0) return 'Unknown';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  return (
    <DashboardShell
      title="System Settings"
      breadcrumbs={[{ label: 'Settings' }]}
    >
      <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              System Settings &amp; Operations
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Monitor environment configurations, active LLM model parameters, and manage database operations.
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold tracking-tight">
                Appearance &amp; Theme
              </CardTitle>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              System Display
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Color Theme
              </p>
              <p className="text-xs text-muted-foreground">
                Select your preferred interface color mode or synchronize with your operating system.
              </p>
            </div>
            <ThemeToggle variant="segmented" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold tracking-tight">
                Backend System &amp; Environment Metadata
              </CardTitle>
            </div>
            {systemInfo && (
              <Badge
                variant="outline"
                className={
                  systemInfo.database === 'connected'
                    ? 'border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400'
                    : 'border-destructive text-destructive'
                }
              >
                {systemInfo.database === 'connected' ? 'Database Connected' : 'Database Disconnected'}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : isError || !systemInfo ? (
            <div className="text-center py-6 space-y-2">
              <AlertCircle className="h-6 w-6 text-destructive mx-auto" />
              <p className="text-xs text-destructive font-medium">
                Unable to load system metadata from backend.
              </p>
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-lg border bg-muted/20 p-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Cpu className="h-3.5 w-3.5 text-primary" />
                    <span>Active LLM Model</span>
                  </div>
                  <div className="font-mono text-sm font-bold text-foreground">
                    {systemInfo.geminiModel}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Google Gemini Function Calling SDK
                  </p>
                </div>

                <div className="rounded-lg border bg-muted/20 p-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Database className="h-3.5 w-3.5 text-primary" />
                    <span>Database Engine</span>
                  </div>
                  <div className="font-mono text-sm font-bold text-foreground">
                    PostgreSQL / Prisma ORM
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Environment: {systemInfo.nodeEnv}
                  </p>
                </div>

                <div className="rounded-lg border bg-muted/20 p-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Server className="h-3.5 w-3.5 text-primary" />
                    <span>Server Uptime</span>
                  </div>
                  <div className="font-mono text-sm font-bold text-foreground">
                    {formatUptime(systemInfo.uptimeSeconds)}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Status: {systemInfo.status}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-xs font-semibold text-foreground mb-3">
                  Current Database Entity Counts
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                    <Ticket className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Tickets</div>
                      <div className="text-base font-bold text-foreground font-mono">
                        {systemInfo.counts?.tickets ?? 0}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                    <Layers className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Agent Executions</div>
                      <div className="text-base font-bold text-foreground font-mono">
                        {systemInfo.counts?.executions ?? 0}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                    <Users className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Customers</div>
                      <div className="text-base font-bold text-foreground font-mono">
                        {systemInfo.counts?.customers ?? 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm border-primary/20">
        <CardHeader className="pb-3 border-b bg-gradient-to-r from-primary/5 via-card to-card">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold tracking-tight">
              Database Maintenance &amp; Data Operations
            </CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Administrative operations to reset ticket workflow states, restore sample datasets, or purge database records.
          </p>
        </CardHeader>

        <CardContent className="p-6 divide-y divide-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 first:pt-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-foreground">
                  Reset Tickets to Pending
                </h4>
                <Badge variant="secondary" className="text-[10px]">
                  Workflow Reset
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground max-w-xl">
                Clears all previous agent execution traces and resets all support tickets to PENDING status to allow fresh autonomous triage processing.
              </p>
            </div>

            <Button
              variant="default"
              size="sm"
              disabled={isMutating}
              onClick={() => resetMutation.mutate()}
              className="gap-2 shrink-0 cursor-pointer shadow-sm"
            >
              {resetMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Resetting...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset to Pending State</span>
                </>
              )}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-foreground">
                  Restore Sample Dataset
                </h4>
                <Badge variant="outline" className="text-[10px]">
                  Sample Support Data
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground max-w-xl">
                Populates sample customer records and benchmark tickets: TCK-001 (order inquiry), TCK-002 (tier upgrade), and TCK-003 (profile picture FAQ).
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={isMutating}
              onClick={() => reseedMutation.mutate()}
              className="gap-2 shrink-0 cursor-pointer"
            >
              {reseedMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Restoring...</span>
                </>
              ) : (
                <>
                  <Database className="h-3.5 w-3.5 text-primary" />
                  <span>Restore Sample Dataset</span>
                </>
              )}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-foreground">
                Clear All Database Records
              </h4>
              <p className="text-xs text-muted-foreground max-w-xl">
                Permanently deletes all tickets, customers, and execution traces from the database to start with a clean empty state.
              </p>
            </div>

            <Button
              variant="destructive"
              size="sm"
              disabled={isMutating}
              onClick={() => clearMutation.mutate()}
              className="gap-2 shrink-0 cursor-pointer"
            >
              {clearMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Clearing...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear All Records</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </DashboardShell>
  );
}
