"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronDown,
  Download,
  Eye,
  Filter,
  Search,
  Shield,
  X,
  Check,
  Clock,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
type EventType = "CREATE" | "UPDATE" | "DELETE" | "VIEW" | "LOGIN" | "EXPORT";
type AuditLog = {
  id: string;
  event: string;
  eventType: EventType;
  module: string;
  actor: { name: string; role: string; avatar: string };
  timestamp: string;
  ip: string;
  status: "Success" | "Failed" | "Pending";
  before?: Record<string, string>;
  after?: Record<string, string>;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_LOGS: AuditLog[] = [
  {
    id: "1",
    event: "Updated Salary Record",
    eventType: "UPDATE",
    module: "Compensation",
    actor: { name: "Priya Okafor", role: "HR Manager", avatar: "PO" },
    timestamp: "Jun 3, 2026 · 09:14 AM",
    ip: "192.168.1.45",
    status: "Success",
    before: { "Salary": "$65,000", "Job Title": "Software Developer", "Department": "Engineering" },
    after: { "Salary": "$72,000", "Job Title": "Senior Software Developer", "Department": "Engineering" },
  },
  {
    id: "2",
    event: "Employee Record Created",
    eventType: "CREATE",
    module: "Employee Directory",
    actor: { name: "Elena Vance", role: "Admin", avatar: "EV" },
    timestamp: "Jun 3, 2026 · 08:52 AM",
    ip: "10.0.0.12",
    status: "Success",
    before: {},
    after: { "Name": "James Mitchell", "Email": "j.mitchell@360hr.com", "Role": "Operations Lead" },
  },
  {
    id: "3",
    event: "Employee Record Deleted",
    eventType: "DELETE",
    module: "Employee Directory",
    actor: { name: "Marcus Sterling", role: "CEO", avatar: "MS" },
    timestamp: "Jun 3, 2026 · 08:20 AM",
    ip: "10.0.0.2",
    status: "Success",
    before: { "Name": "Sara Lee", "Status": "Terminated", "Reason": "Resignation" },
    after: {},
  },
  {
    id: "4",
    event: "Department Report Exported",
    eventType: "EXPORT",
    module: "Reports",
    actor: { name: "James Mitchell", role: "Ops Lead", avatar: "JM" },
    timestamp: "Jun 3, 2026 · 07:55 AM",
    ip: "172.20.10.4",
    status: "Success",
    before: {},
    after: {},
  },
  {
    id: "5",
    event: "Failed Login Attempt",
    eventType: "LOGIN",
    module: "Authentication",
    actor: { name: "Unknown", role: "—", avatar: "?" },
    timestamp: "Jun 2, 2026 · 11:38 PM",
    ip: "203.0.113.55",
    status: "Failed",
    before: {},
    after: {},
  },
  {
    id: "6",
    event: "Org Structure Updated",
    eventType: "UPDATE",
    module: "Org Structure",
    actor: { name: "Clara Nwosu", role: "Product Director", avatar: "CN" },
    timestamp: "Jun 2, 2026 · 04:30 PM",
    ip: "192.168.1.78",
    status: "Success",
    before: { "Unit Name": "Product", "Head": "Clara Nwosu", "Budget": "$260k/yr" },
    after: { "Unit Name": "Product & Design", "Head": "Clara Nwosu", "Budget": "$285k/yr" },
  },
  {
    id: "7",
    event: "Employee Profile Viewed",
    eventType: "VIEW",
    module: "Employee Directory",
    actor: { name: "Sofia Adebayo", role: "HR Analyst", avatar: "SA" },
    timestamp: "Jun 2, 2026 · 02:10 PM",
    ip: "10.0.0.34",
    status: "Success",
    before: {},
    after: {},
  },
  {
    id: "8",
    event: "Payroll Batch Processed",
    eventType: "CREATE",
    module: "Payroll",
    actor: { name: "David Chen", role: "Finance Head", avatar: "DC" },
    timestamp: "Jun 2, 2026 · 11:05 AM",
    ip: "10.0.0.22",
    status: "Success",
    before: {},
    after: { "Batch ID": "PAY-2026-06", "Records": "127", "Total": "$2.4M" },
  },
];

const EVENT_COLORS: Record<EventType, { bg: string; text: string; dot: string }> = {
  CREATE: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  UPDATE: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  DELETE: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  VIEW: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
  LOGIN: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  EXPORT: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
};

const STATUS_COLORS = {
  Success: "bg-emerald-50 text-emerald-700",
  Failed: "bg-red-50 text-red-700",
  Pending: "bg-amber-50 text-amber-700",
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AuditLogsScreen() {
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState<EventType | "">("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = MOCK_LOGS.filter((log) => {
    const matchSearch = !search ||
      log.event.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.name.toLowerCase().includes(search.toLowerCase()) ||
      log.module.toLowerCase().includes(search.toLowerCase());
    const matchEvent = !eventFilter || log.eventType === eventFilter;
    const matchStatus = !statusFilter || log.status === statusFilter;
    return matchSearch && matchEvent && matchStatus;
  });

  const stats = [
    { label: "Total Events", value: "2,847", icon: Activity, trend: "+127 today", color: "text-blue-600 bg-blue-50" },
    { label: "Today's Activity", value: "127", icon: Clock, trend: "↑ 18% vs yesterday", color: "text-emerald-600 bg-emerald-50" },
    { label: "Active Users", value: "34", icon: Users, trend: "Across all modules", color: "text-violet-600 bg-violet-50" },
    { label: "Compliance Score", value: "98.7%", icon: Shield, trend: "Excellent standing", color: "text-indigo-600 bg-indigo-50" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1400px] mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">Audit Logs</h1>
          <p className="text-sm text-slate-500 mt-0.5">Complete activity trail across the system</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
          <Download className="w-4 h-4" /> Export Logs
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{s.label}</p>
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", s.color)}>
                <s.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.trend}</p>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, users, modules..."
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 bg-white">
            <Calendar className="w-4 h-4" /> Date Range <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value as EventType | "")}
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white focus:outline-none focus:border-blue-500 appearance-none"
          >
            <option value="">All Event Types</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="VIEW">View</option>
            <option value="LOGIN">Login</option>
            <option value="EXPORT">Export</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white focus:outline-none focus:border-blue-500 appearance-none"
          >
            <option value="">All Status</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
            <option value="Pending">Pending</option>
          </select>
          {(search || eventFilter || statusFilter) && (
            <button
              onClick={() => { setSearch(""); setEventFilter(""); setStatusFilter(""); }}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 px-2"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#F8FAFC]">
              <tr className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <th className="px-5 py-4 w-[260px]">Event</th>
                <th className="px-5 py-4">Module</th>
                <th className="px-5 py-4">Actor</th>
                <th className="px-5 py-4">Timestamp</th>
                <th className="px-5 py-4">IP Address</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 w-[60px]" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400 text-sm">No audit logs found matching your filters.</td>
                </tr>
              ) : (
                filtered.map((log) => {
                  const ec = EVENT_COLORS[log.eventType];
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold", ec.bg, ec.text)}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", ec.dot)} />
                            {log.eventType}
                          </span>
                          <span className="text-[13px] font-medium text-slate-800">{log.event}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[13px] text-slate-600">{log.module}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {log.actor.avatar}
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-slate-900">{log.actor.name}</p>
                            <p className="text-[11px] text-slate-500">{log.actor.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[13px] text-slate-600 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="px-5 py-4">
                        <code className="text-[12px] font-mono text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded">
                          {log.ip}
                        </code>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-bold", STATUS_COLORS[log.status])}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-white">
          <span className="text-[13px] text-slate-500">
            Showing {filtered.length} of {MOCK_LOGS.length} events
          </span>
          <div className="flex items-center gap-1">
            <button disabled className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-md text-slate-400 disabled:opacity-30">
              <ArrowLeft className="w-4 h-4" />
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-md text-[13px] font-medium transition-colors",
                  currentPage === p ? "bg-blue-600 text-white" : "hover:bg-slate-100 text-slate-600"
                )}
              >
                {p}
              </button>
            ))}
            <span className="px-1 text-slate-400 text-sm">...</span>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-md text-[13px] text-slate-600">12</button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-md text-slate-500">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Compliance Notice */}
      <div className="flex items-start gap-4 p-5 bg-indigo-50 border border-indigo-100 rounded-xl">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-indigo-900">Compliance & Data Retention</p>
          <p className="text-xs text-indigo-700 mt-0.5">Audit logs are retained for 24 months in compliance with ISO 27001 and NDPR requirements. All sensitive field changes are hashed and tamper-evident.</p>
        </div>
        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-full shrink-0">Compliant</span>
      </div>

      {/* History Detail Modal */}
      {selectedLog && <AuditDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />}
    </div>
  );
}

// ─── Audit Detail Modal ───────────────────────────────────────────────────────
function AuditDetailModal({ log, onClose }: { log: AuditLog; onClose: () => void }) {
  const ec = EVENT_COLORS[log.eventType];
  const hasBefore = Object.keys(log.before ?? {}).length > 0;
  const hasAfter = Object.keys(log.after ?? {}).length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold", ec.bg, ec.text)}>
              <span className={cn("w-1.5 h-1.5 rounded-full", ec.dot)} />
              {log.eventType}
            </span>
            <h3 className="text-base font-bold text-slate-900">{log.event}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Actor + Meta */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold shrink-0">
                {log.actor.avatar}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{log.actor.name}</p>
                <p className="text-xs text-slate-500">{log.actor.role}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">{log.timestamp}</p>
              <code className="text-[11px] font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                IP: {log.ip}
              </code>
            </div>
          </div>

          {/* Module */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Module:</span>
            <span className="text-sm font-semibold text-slate-700">{log.module}</span>
            <span className={cn("ml-auto px-2.5 py-1 rounded-full text-[11px] font-bold", STATUS_COLORS[log.status])}>
              {log.status}
            </span>
          </div>

          {/* Before / After */}
          {(hasBefore || hasAfter) && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Change Details</p>
              <div className="grid grid-cols-2 gap-4">
                {/* Before */}
                <div className="rounded-xl border border-red-100 bg-red-50/40 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-500 mb-3">Before</p>
                  {hasBefore ? (
                    <div className="space-y-2">
                      {Object.entries(log.before ?? {}).map(([key, val]) => (
                        <div key={key}>
                          <p className="text-[10px] font-semibold text-slate-400 uppercase">{key}</p>
                          <p className="text-sm font-semibold text-slate-800">{val}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No previous state</p>
                  )}
                </div>

                {/* After */}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-3">After</p>
                  {hasAfter ? (
                    <div className="space-y-2">
                      {Object.entries(log.after ?? {}).map(([key, val]) => (
                        <div key={key}>
                          <p className="text-[10px] font-semibold text-slate-400 uppercase">{key}</p>
                          <p className="text-sm font-semibold text-slate-800">{val}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Record removed</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <span className="text-xs text-slate-500">Log ID: {log.id.padStart(6, "0")}</span>
          <button onClick={onClose} className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
