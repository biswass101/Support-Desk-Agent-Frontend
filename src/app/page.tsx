import { DashboardShell } from '@/components/layout/dashboard-shell';
import { SummaryCards } from '@/features/dashboard/components/summary-cards';

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Operations Overview
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time status of support tickets and autonomous triage metrics.
          </p>
        </div>

        <SummaryCards />
      </div>
    </DashboardShell>
  );
}