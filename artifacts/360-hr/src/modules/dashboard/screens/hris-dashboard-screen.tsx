"use client";
import React, { ComponentType } from "react";
import Link from "next/link";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {

  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

import { dashboardApi } from "@/lib/api";
import { AddEmployeeModal } from "@/modules/hris/screens/employee-directory-screen";
import type { DepartmentTree } from "@/types";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";
import { AddIcon, MultipleUserStat, RecentActivityIconFirst, RecentActivityIconSecond, RecentActivityIconThird } from "@/shared/icons/dashboard_overview_icons";

interface DepartmentData {
  name: string;
  value: number;
  color: string;
}

interface PieSectorProps {
  cx?: number;
  cy?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
  midAngle?: number;
}

const renderActiveShape = (props: PieSectorProps) => {
  const {
    cx = 0,
    cy = 0,
    innerRadius = 0,
    outerRadius = 0,
    startAngle = 0,
    endAngle = 0,
    fill = "#ccc",
    midAngle = 0,
  } = props;

  const RADIAN = Math.PI / 180;
  const offset = 12;

  const x = cx + offset * Math.cos(-midAngle * RADIAN);
  const y = cy + offset * Math.sin(-midAngle * RADIAN);

  return (
    <Sector
      cx={x}
      cy={y}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 10}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      stroke="#FFFFFF"
      strokeWidth={4}
      cornerRadius={4}
    />
  );
};

// --- Data Constants ---
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
  { name: "ENGINEERING", value: 37, color: "#00E5BE" },
  { name: "OPERATIONS", value: 39, color: "#A0AEC0" },
  { name: "DESIGNS", value: 24, color: "#CBD5E1" },
];

const DEPT_COLORS = ["#00E5BE", "#A0AEC0", "#CBD5E1", "#93C5FD", "#FBBF24", "#F472B6"];

function countTreeMembers(node: DepartmentTree): number {
  const own = node.employees?.length ?? 0;
  const nested = (node.children ?? []).reduce((s, c) => s + countTreeMembers(c), 0);
  return own + nested;
}

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

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_ABBR_TO_IDX: Record<string, number> = {
  JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
  JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
};
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type CalendarEvent = { month: number; day: number; title: string; subtitle: string };

const calendarEvents: CalendarEvent[] = comingUp.map((e) => ({
  month: MONTH_ABBR_TO_IDX[e.date.toUpperCase()] ?? 0,
  day: parseInt(e.day, 10),
  title: e.title,
  subtitle: e.subtitle,
}));

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
    icon: RecentActivityIconFirst,
    bg: "bg-red-200",
    IconColor: "text-red-700",
  },
  {
    text: "Marcus Chen requested sick leave...",
    meta: "5 hours ago • Engineering",
    icon: RecentActivityIconSecond,
    bg: "bg-gray-300",
    IconColor: "text-gray-700"
  },
  {
    text: "Monthly payroll finalized...",
    meta: "Yesterday • Finance",
    icon: RecentActivityIconThird,
    bg: "bg-blue-200",
    IconColor: "text-blue-700"
  },
];

// --- Sub Components ---
function StatCard({
  title,
  value,
  badge,
  badgeVariant,
  icon: IconComponent,
}: {
  title: string;
  value: string;
  badge: string;
  badgeVariant: "blue" | "red";
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  return (
    <div className="rounded-xl border border-grey-200 bg-white p-5">
      <div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-blue-50">
        <IconComponent className="size-4.5 text-blue-500" strokeWidth={1.75} />
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
            : "bg-grey-100 text-grey-700"
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
          : "bg-grey-100 text-grey-700"
      )}
    >
      {status}
    </span>
  );
}

// --- Main Screen Component ---
export function HrisDashboardScreen() {

  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const queryClient = useQueryClient();

  const { data: employeeData } = useQuery({
    queryKey: ["dashboard-employees"],
    queryFn: () => dashboardApi.getEmployees(1, 100),
    retry: false,
  });

  const { data: deptTree } = useQuery({
    queryKey: ["dashboard-dept-tree"],
    queryFn: () => dashboardApi.getDepartmentTree(),
    retry: false,
  });

  // Total employees — real count when the company has data, otherwise demo figure.
  const realTotal = employeeData?.pagination?.total ?? 0;
  const totalEmployees = realTotal > 0 ? realTotal.toLocaleString() : "1,248";

  // Department distribution — derived from the live department tree, falling back
  // to demo data when the company has no departments yet.
  const liveDeptData =
    Array.isArray(deptTree) && deptTree.length > 0
      ? deptTree
          .map((node, i) => ({
            name: node.name.toUpperCase(),
            value: countTreeMembers(node),
            color: DEPT_COLORS[i % DEPT_COLORS.length],
          }))
          .filter((d) => d.value > 0)
      : [];
  const chartDeptData = liveDeptData.length > 0 ? liveDeptData : departmentData;

  // Percentages derived from the live (or fallback) distribution so the overlay
  // labels stay consistent with the rendered segments.
  const deptTotal = chartDeptData.reduce((sum, d) => sum + d.value, 0) || 1;
  const deptPct = chartDeptData.map((d) => Math.round((d.value / deptTotal) * 100));

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
        <div className="flex flex-wrap gap-6">

          <button
            type="button"
            onClick={() => setShowAddEmployee(true)}
            className="flex items-center rounded-xl border border-grey-200 bg-white text-left shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="flex size-15 rounded-left px-2 py-2 items-center justify-center bg-blue-50">
              <AddIcon className="size-5 text-blue-700" />
            </span>
            <span className="px-4 py-1">
              <span className="block text-[14px] font-semibold text-grey-900">Add Employee </span>
              <span className="text-[12px] text-grey-500">Onboard talents</span>
            </span>
          </button>

          <Link
            href="#"
            className="flex items-center rounded-xl border border-grey-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="flex size-15 rounded-left px-2 py-2 items-center justify-center bg-blue-50">
              <AddIcon className="size-5 text-blue-700" />
            </span>
            <span className="px-4 py-1">
              <span className="block text-[14px] font-semibold text-grey-900">Post Job </span>
              <span className="text-[12px] text-grey-500">Open requisitions</span>
            </span>
          </Link>


          <Link
            href="#"
            className="flex items-center rounded-xl border border-grey-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="flex size-15 rounded-left px-2 py-2 items-center justify-center bg-blue-50">
              <AddIcon className="size-5 text-blue-700" />
            </span>
            <span className="px-4 py-1">
              <span className="block text-[14px] font-semibold text-grey-900">Run Payroll </span>
              <span className="text-[12px] text-grey-500">Monthly Cycle</span>
            </span>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          badge="+12% vs Last Year"
          badgeVariant="blue"
          icon={MultipleUserStat}
        />
        <StatCard
          title="New Hires"
          value="34"
          badge="5 Joined Today"
          badgeVariant="blue"
          icon={MultipleUserStat}
        />
        <StatCard
          title="Pending Leave Requests"
          value="22"
          badge="Action Required"
          badgeVariant="red"
          icon={MultipleUserStat}
        />
        <StatCard
          title="Active Openings"
          value="22"
          badge="5 Priority"
          badgeVariant="red"
          icon={MultipleUserStat}
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
          <div className="h-65 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={attendanceData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                barGap={0}
                barCategoryGap={0}
                barSize={100}
              >
                <YAxis
                  axisLine={true}
                  tickLine={true}
                  tick={{ fill: "#cbd5e0", fontSize: 12 }}
                  tickMargin={10}
                  domain={[0, 260]}
                />
                <XAxis
                  dataKey="day"
                  axisLine={true}
                  tickLine={true}
                  tick={{ fill: "#6b7588", fontSize: 12 }}
                  dy={10}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #f1f2f4",
                    fontSize: 13,
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]} // Applies border radius of 4px to top-left and top-right only
                  onMouseEnter={(_, index) => setHoveredBarIndex(index)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                >
                  {attendanceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        hoveredBarIndex === null || hoveredBarIndex === index
                          ? "#2563EB" // Solid corporate blue (Default or Hovered state)
                          : "rgba(37, 99, 235, 0.15)" // 15% opacity blue (Faded out state)
                      }
                      style={{ transition: "fill 0.2s ease-in-out" }} // Adds a smooth fade transition
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
            <button
              type="button"
              onClick={() => setShowCalendar(true)}
              className="text-[13px] font-medium text-[#2563EB] hover:underline"
            >
              View Calendar
            </button>
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
              <table className="w-full min-w-120 text-left text-[14px]">
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
                  <span className="mt-1.5 w-10 h-8 shrink-0 flex items-center justify-center rounded-lg relative">
                    <span
                      className={cn(
                        "absolute inset-0 rounded-lg opacity-20",
                        item.bg ?? ""
                      )}
                    />
                    {item.icon && (
                      <item.icon
                        className={cn("w-5 h-5 relative z-10", item.IconColor ?? "text-white")}
                      />
                    )}
                  </span>
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

          <div className="rounded-xl border border-grey-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-heading text-[16px] font-semibold text-grey-900">
              Employee Distribution by Department
            </h2>

            <div className="flex flex-col bg-white rounded-[20px] shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-50 p-7 w-85 mx-auto font-sans">
              <div className="relative mx-auto mt-2 h-60 w-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartDeptData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={82}
                      activeShape={renderActiveShape}
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={2}
                      stroke="#FFFFFF"
                      strokeWidth={4}
                      isAnimationActive
                      animationBegin={0}
                      animationDuration={1400}
                      animationEasing="ease-out"
                    >
                      {chartDeptData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip defaultIndex={0} content={() => null} cursor={false} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute right-5 top-23.75">
                  <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-500 shadow">
                    {deptPct[0] ?? 0}%
                  </span>
                </div>

                <div className="absolute left-2.5 top-13.75">
                  <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-500 shadow">
                    {deptPct[1] ?? 0}%
                  </span>
                </div>

                <div className="absolute bottom-1.25 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-500 shadow">
                    {deptPct[2] ?? 0}%
                  </span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2">
                {chartDeptData.slice(0, 3).map((dept) => (
                  <div
                    key={dept.name}
                    className="px-2.5 py-1.5 border border-[#F1F5F9] rounded-md text-[10px] font-medium text-[#64748B] bg-white shadow-sm tracking-wide"
                  >
                    {dept.name}
                  </div>
                ))}
              </div>
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
            <div className="h-40 w-full">
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

      {showCalendar && <CalendarModal onClose={() => setShowCalendar(false)} />}

      <AddEmployeeModal
        isOpen={showAddEmployee}
        onClose={() => setShowAddEmployee(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["dashboard-employees"] });
        }}
      />
    </div>
  );
}

// --- Calendar Modal ---
function CalendarModal({ onClose }: { onClose: () => void }) {
  const today = new Date();
  const initial = calendarEvents[0];
  const [viewMonth, setViewMonth] = useState(initial ? initial.month : today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthEvents = calendarEvents.filter((e) => e.month === viewMonth);
  const eventDays = new Set(monthEvents.map((e) => e.day));

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };
  const goNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-grey-200 bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="size-5 text-[#2563EB]" />
            <h2 className="font-heading text-[16px] font-semibold text-grey-900">Calendar</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-grey-500 hover:bg-grey-100"
            aria-label="Close calendar"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={goPrev}
            className="rounded-md p-1.5 text-grey-600 hover:bg-grey-100"
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="font-heading text-[15px] font-semibold text-grey-900">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            onClick={goNext}
            className="rounded-md p-1.5 text-grey-600 hover:bg-grey-100"
            aria-label="Next month"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-1 text-[11px] font-semibold text-grey-500">
              {d}
            </div>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <div key={`blank-${i}`} />;
            const isToday =
              day === today.getDate() &&
              viewMonth === today.getMonth() &&
              viewYear === today.getFullYear();
            const hasEvent = eventDays.has(day);
            return (
              <div
                key={`day-${day}`}
                className={cn(
                  "relative flex aspect-square items-center justify-center rounded-md text-[13px]",
                  isToday
                    ? "bg-[#2563EB] font-semibold text-white"
                    : hasEvent
                      ? "bg-blue-50 font-medium text-[#2563EB]"
                      : "text-grey-700",
                )}
              >
                {day}
                {hasEvent && !isToday && (
                  <span className="absolute bottom-1 size-1 rounded-full bg-[#2563EB]" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 border-t border-grey-100 pt-4">
          <h3 className="mb-3 text-[13px] font-semibold text-grey-900">
            Events in {MONTH_NAMES[viewMonth]}
          </h3>
          {monthEvents.length > 0 ? (
            <ul className="space-y-3">
              {monthEvents
                .slice()
                .sort((a, b) => a.day - b.day)
                .map((e) => (
                  <li key={e.day + e.title} className="flex gap-3">
                    <div className="flex w-10 shrink-0 flex-col items-center rounded-lg border border-grey-200 bg-[#F9FAFB] py-1.5 text-center">
                      <span className="text-[9px] font-semibold tracking-wide text-grey-500">
                        {MONTH_NAMES[viewMonth].slice(0, 3).toUpperCase()}
                      </span>
                      <span className="font-heading text-[16px] font-bold text-grey-900">
                        {e.day}
                      </span>
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-[14px] font-semibold text-grey-900">{e.title}</p>
                      <p className="text-[13px] text-grey-500">{e.subtitle}</p>
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-[13px] text-grey-500">No events this month.</p>
          )}
        </div>
      </div>
    </div>
  );
}