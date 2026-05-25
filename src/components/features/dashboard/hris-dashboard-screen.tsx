"use client";

import Link from "next/link";
import {
  Briefcase,
  Calendar,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";

const attendanceData = [
  { day: "Mon", value: 210 },
  { day: "Tue", value: 235 },
  { day: "Wed", value: 198 },
  { day: "Thu", value: 248, highlight: true },
  { day: "Fri", value: 220 },
  { day: "Sat", value: 45 },
  { day: "Sun", value: 12 },
];

const departmentData = [
  { name: "Engineering", value: 37, color: "bg-teal-500" },
  { name: "Operations", value: 24, color: "bg-grey-400" },
  { name: "Designs", value: 22, color: "bg-grey-300" },
];

const retentionData = [
  { month: "Jan", value: 88 },
  { month: "Mar", value: 90 },
  { month: "Jun", value: 91 },
  { month: "Sep", value: 93 },
  { month: "Dec", value: 94.2 },
];

const comingUp = [
  { date: "NOV", day: "12", title: "Aaliyah Wright", subtitle: "3rd Work Anniversary" },
  { date: "NOV", day: "14", title: "Liam Foster", subtitle: "Birthday Today" },
  {
    date: "NOV",
    day: "18",
    title: "Staff Town Hall",
    subtitle: "Virtual • 10:00 AM",
  },
];

const onLeave = [
  {
    name: "Tiger Nixon",
    type: "Parental Leave",
    dates: "Oct 12 - Oct 18",
    status: "Approved" as const,
    initials: "TN",
  },
  {
    name: "Garrett Winters",
    type: "Parental Leave",
    dates: "Oct 12 - Oct 18",
    status: "Pending" as const,
    initials: "GW",
  },
  {
    name: "Ashton Cox",
    type: "Sick leave",
    dates: "Oct 12 - Oct 18",
    status: "Approved" as const,
    initials: "AC",
  },
];

const recentActivity = [
  {
    text: "Aria Montgomery signed her offer...",
    meta: "2 hours ago • HR Operations",
    color: "bg-blue-500",
  },
  {
    text: "Marcus Chen requested sick leave...",
    meta: "5 hours ago • Engineering",
    color: "bg-error-500",
  },
  {
    text: "Monthly payroll finalized...",
    meta: "Yesterday • Finance",
    color: "bg-teal-500",
  },
];

function StatCard({
  title,
  value,
  badge,
  badgeVariant,
  icon: Icon,
}: {
  title: string;
  value: string;
  badge: string;
  badgeVariant: "blue" | "red";
  icon: typeof Users;
}) {
  return (
    <div className="rounded-xl border border-grey-200 bg-white p-5">
      <div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-blue-50">
        <Icon className="size-[18px] text-blue-500" strokeWidth={1.75} />
      </div>
      <p className="text-[13px] font-medium text-grey-500">{title}</p>
      <p className="mt-1 font-heading text-[28px] font-bold tracking-tight text-grey-900">
        {value}
      </p>
      <span
        className={cn(
          "mt-2 inline-block rounded-full px-2.5 py-0.5 text-[12px] font-medium",
          badgeVariant === "blue"
            ? "bg-blue-50 text-blue-600"
            : "bg-grey-100 text-grey-700",
        )}
      >
        {badge}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: "Approved" | "Pending" }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[12px] font-medium",
        status === "Approved"
          ? "bg-blue-50 text-blue-600"
          : "bg-grey-100 text-grey-700",
      )}
    >
      {status}
    </span>
  );
}

export function HrisDashboardScreen() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-[28px] font-bold tracking-tight text-grey-900">
            Overview
          </h1>
          <p className="mt-1 text-[15px] text-grey-600">
            Welcome back, Admin. Here is what&apos;s happening today.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="#"
            className="flex items-center gap-3 rounded-xl border border-grey-200 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50">
              <UserPlus className="size-5 text-blue-500" />
            </span>
            <span>
              <span className="block text-[14px] font-semibold text-grey-900">Add Employee</span>
              <span className="text-[12px] text-grey-500">Onboard talents</span>
            </span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-xl border border-grey-200 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50">
              <Briefcase className="size-5 text-blue-700" />
            </span>
            <span>
              <span className="block text-[14px] font-semibold text-grey-900">Post Job</span>
              <span className="text-[12px] text-grey-500">Open requisitions</span>
            </span>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Employees"
          value="1,248"
          badge="+12% vs Last Year"
          badgeVariant="blue"
          icon={Users}
        />
        <StatCard
          title="New Hires"
          value="34"
          badge="5 Joined Today"
          badgeVariant="blue"
          icon={UserPlus}
        />
        <StatCard
          title="Pending Leave Requests"
          value="22"
          badge="Action Required"
          badgeVariant="red"
          icon={Calendar}
        />
        <StatCard
          title="Active Openings"
          value="22"
          badge="5 Priority"
          badgeVariant="red"
          icon={Briefcase}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-grey-200 bg-white p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-[16px] font-semibold text-grey-900">
              Attendance Overview
            </h2>
            <select className="rounded-lg border border-grey-200 bg-white px-3 py-1.5 text-[13px] text-grey-700">
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#cbd5e0", fontSize: 12 }}
                  domain={[0, 260]}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7588", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #f1f2f4",
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {attendanceData.map((entry) => (
                    <Cell
                      key={entry.day}
                      fill={entry.highlight ? "#274376" : "#a0aec0"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-grey-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-[16px] font-semibold text-grey-900">Coming Up</h2>
            <Link href="#" className="text-[13px] font-medium text-[#2563EB]">
              View Calendar
            </Link>
          </div>
          <ul className="space-y-4">
            {comingUp.map((item) => (
              <li key={item.day + item.title} className="flex gap-3">
                <div className="flex w-12 shrink-0 flex-col items-center rounded-lg border border-grey-200 bg-[#F9FAFB] py-2 text-center">
                  <span className="text-[10px] font-semibold tracking-wide text-grey-500">
                    {item.date}
                  </span>
                  <span className="font-heading text-[18px] font-bold text-grey-900">
                    {item.day}
                  </span>
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className="text-[14px] font-semibold text-grey-900">{item.title}</p>
                  <p className="text-[13px] text-grey-500">{item.subtitle}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-grey-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-[16px] font-semibold text-grey-900">
                Employees on Leave
              </h2>
              <Link href="#" className="text-[13px] font-medium text-[#2563EB]">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-[14px]">
                <thead>
                  <tr className="border-b border-grey-100 text-[12px] font-semibold tracking-wide text-grey-500 uppercase">
                    <th className="pb-3 font-semibold">Name</th>
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {onLeave.map((row) => (
                    <tr key={row.name} className="border-b border-grey-50 last:border-0">
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#E0E7FF] text-[12px] font-semibold text-[#4F46E5]">
                            {row.initials}
                          </span>
                          <span className="font-medium text-grey-900">{row.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-grey-600">{row.type}</td>
                      <td className="py-3.5 text-grey-600">{row.dates}</td>
                      <td className="py-3.5">
                        <StatusBadge status={row.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-grey-200 bg-white p-5">
            <h2 className="mb-4 font-heading text-[16px] font-semibold text-grey-900">
              Recent Activity
            </h2>
            <ul className="space-y-4">
              {recentActivity.map((item) => (
                <li key={item.text} className="flex gap-3">
                  <span
                    className={cn("mt-1.5 size-2 shrink-0 rounded-full", item.color)}
                  />
                  <div>
                    <p className="text-[14px] font-medium text-grey-900">{item.text}</p>
                    <p className="text-[13px] text-grey-500">{item.meta}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-grey-200 bg-white p-5">
            <h2 className="mb-4 font-heading text-[16px] font-semibold text-grey-900">
              Employee Distribution by Department
            </h2>
            <div className="relative mx-auto h-[200px] w-full max-w-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {departmentData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="font-heading text-[22px] font-bold text-grey-900">37%</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-[11px] font-semibold tracking-wide text-grey-500 uppercase">
              {departmentData.map((d) => (
                <span key={d.name} className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  {d.name} ({d.value}%)
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-grey-200 bg-white p-5">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-heading text-[16px] font-semibold text-grey-900">
                Retention Trend
              </h2>
              <span className="flex items-center gap-1 text-[14px] font-semibold text-[#2563EB]">
                94.2%
                <TrendingUp className="size-4" />
              </span>
            </div>
            <div className="h-[160px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={retentionData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="retentionFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#93C5FD" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#93C5FD" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 11 }}
                  />
                  <YAxis hide domain={[85, 96]} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#retentionFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
