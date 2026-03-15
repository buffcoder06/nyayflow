// src/components/dashboard/dashboard-content.tsx
// Server component – fetches all data and composes the dashboard layout.

import { api } from "@/lib/api";
import { StatsRow } from "./stats-row";
import { TodaysDiary } from "./todays-diary";
import { QuickActions } from "./quick-actions";
import { UpcomingHearingsWidget } from "./upcoming-hearings-widget";
import { PendingFeesWidget } from "./pending-fees-widget";
import { RecentMattersWidget } from "./recent-matters-widget";
import { TasksWidget } from "./tasks-widget";
import { IncomeExpenseChart } from "./income-expense-chart";

export default async function DashboardContent() {
  // Fetch all data in parallel
  const [statsRes, hearingsRes, mattersRes, feesRes, tasksRes, clientsRes] =
    await Promise.all([
      api.dashboard.getStats(),
      api.hearings.list(undefined, { page: 1, pageSize: 100 }),
      api.matters.list(undefined, { page: 1, pageSize: 50 }),
      api.fees.list(),
      api.tasks.list(),
      api.clients.list(undefined, { page: 1, pageSize: 100 }),
    ]);

  const stats = statsRes.data;
  const allHearings = hearingsRes.data.data;
  const allMatters = mattersRes.data.data;
  const allFees = feesRes.data;
  const allTasks = tasksRes.data;
  const allClients = clientsRes.data.data;

  const today = new Date().toISOString().split("T")[0];
  const todaysHearings = allHearings.filter((h) => h.date === today);

  return (
    <div className="space-y-6">
      {/* Row 1 — Stat Cards */}
      <StatsRow stats={stats} todayHearingsCount={todaysHearings.length} />

      {/* Row 2 — Today's Court Diary (60%) + Quick Actions (40%) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TodaysDiary hearings={todaysHearings} today={today} />
        </div>
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
      </div>

      {/* Row 3 — Upcoming Hearings + Pending Fees */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <UpcomingHearingsWidget hearings={allHearings} />
        <PendingFeesWidget fees={allFees} />
      </div>

      {/* Row 4 — Recent Matters + Tasks Due Today */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentMattersWidget matters={allMatters} clients={allClients} />
        <TasksWidget tasks={allTasks} />
      </div>

      {/* Row 5 — Income vs Expense Chart */}
      <IncomeExpenseChart />
    </div>
  );
}
