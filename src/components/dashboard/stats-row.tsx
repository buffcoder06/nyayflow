// src/components/dashboard/stats-row.tsx
"use client";

import {
  Briefcase,
  CalendarDays,
  IndianRupee,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrencyCompact } from "@/lib/utils";
import type { DashboardStats } from "@/types";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  trend?: string;
  trendUp?: boolean;
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  iconColor,
  trend,
  trendUp,
}: StatCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide truncate">
              {title}
            </p>
            <p className="mt-1.5 text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {value}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
            {trend && (
              <p
                className={`mt-1 text-xs font-medium ${
                  trendUp ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {trendUp ? "↑" : "↓"} {trend}
              </p>
            )}
          </div>
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
          >
            <span className={iconColor}>{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatsRowProps {
  stats: DashboardStats;
  todayHearingsCount: number;
}

export function StatsRow({ stats, todayHearingsCount }: StatsRowProps) {
  const cards: StatCardProps[] = [
    {
      title: "Active Matters",
      value: stats.totalActiveMatters,
      subtitle: `${stats.pendingTasks} pending tasks`,
      icon: <Briefcase className="h-5 w-5" />,
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
      iconColor: "text-blue-600 dark:text-blue-400",
      trend: "across all courts",
    },
    {
      title: "Today's Hearings",
      value: todayHearingsCount,
      subtitle: `${stats.upcomingHearings} upcoming this week`,
      icon: <CalendarDays className="h-5 w-5" />,
      iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Pending Fees",
      value: stats.pendingPayments,
      subtitle: `${stats.overduePayments} overdue entries`,
      icon: <IndianRupee className="h-5 w-5" />,
      iconBg: "bg-red-100 dark:bg-red-900/40",
      iconColor: "text-red-600 dark:text-red-400",
      trend: `${stats.overduePayments} overdue`,
      trendUp: false,
    },
    {
      title: "Monthly Collections",
      value: formatCurrencyCompact(stats.monthlyCollections),
      subtitle: `Expenses: ${formatCurrencyCompact(stats.monthlyExpenses)}`,
      icon: <TrendingUp className="h-5 w-5" />,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      trend: `Net: ${formatCurrencyCompact(stats.monthlyCollections - stats.monthlyExpenses)}`,
      trendUp: stats.monthlyCollections > stats.monthlyExpenses,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}
