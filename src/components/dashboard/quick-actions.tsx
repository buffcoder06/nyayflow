// src/components/dashboard/quick-actions.tsx
"use client";

import Link from "next/link";
import {
  Briefcase,
  UserPlus,
  IndianRupee,
  CalendarPlus,
  Upload,
  CheckSquare,
  Receipt,
  Bell,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  href: string;
  iconBg: string;
  iconColor: string;
}

const actions: QuickAction[] = [
  {
    label: "Add Matter",
    icon: <Briefcase className="h-5 w-5" />,
    href: "/matters/new",
    iconBg: "bg-blue-100 dark:bg-blue-900/40 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    label: "Add Client",
    icon: <UserPlus className="h-5 w-5" />,
    href: "/clients/new",
    iconBg: "bg-green-100 dark:bg-green-900/40 group-hover:bg-green-200 dark:group-hover:bg-green-900/60",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    label: "Log Payment",
    icon: <IndianRupee className="h-5 w-5" />,
    href: "/fees/new",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/60",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Add Hearing",
    icon: <CalendarPlus className="h-5 w-5" />,
    href: "/hearings/new",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/40 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/60",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    label: "Upload Document",
    icon: <Upload className="h-5 w-5" />,
    href: "/documents/upload",
    iconBg: "bg-purple-100 dark:bg-purple-900/40 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/60",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    label: "Create Task",
    icon: <CheckSquare className="h-5 w-5" />,
    href: "/tasks/new",
    iconBg: "bg-orange-100 dark:bg-orange-900/40 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/60",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    label: "Add Expense",
    icon: <Receipt className="h-5 w-5" />,
    href: "/expenses/new",
    iconBg: "bg-red-100 dark:bg-red-900/40 group-hover:bg-red-200 dark:group-hover:bg-red-900/60",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    label: "Send Reminder",
    icon: <Bell className="h-5 w-5" />,
    href: "/reminders/new",
    iconBg: "bg-teal-100 dark:bg-teal-900/40 group-hover:bg-teal-200 dark:group-hover:bg-teal-900/60",
    iconColor: "text-teal-600 dark:text-teal-400",
  },
];

export function QuickActions() {
  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group flex flex-col items-center gap-2.5 rounded-xl border border-transparent bg-slate-50 dark:bg-slate-800/50 p-3.5 text-center transition-all duration-150 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${action.iconBg}`}
              >
                <span className={action.iconColor}>{action.icon}</span>
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-tight">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
