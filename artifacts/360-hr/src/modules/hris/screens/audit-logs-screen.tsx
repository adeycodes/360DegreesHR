"use client";

import { useState } from "react";
import {
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
  AlertTriangle,
  TrendingUp,
  Users,
  Activity,
  FileText,
  Trash2,
  Pencil,
  ChevronUp,
  Globe,
  ShieldCheck,
  Minus,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────
type EventType = "CREATE" | "UPDATE" | "DELETE" | "VIEW" | "LOGIN" | "EXPORT";

type AuditLog = {
  id: string;
  event: string;
  eventType: EventType;
  module: string;
  actor: { name: string; role: string; avatar: string; avatarColor: string };
  timestamp: string;
  timeDetail: string;
  affected: { name: string; id: string } | null;
  ip: string;
  status: "Success" | "Failed" | "Pending";
  before?: Record<string, string>;
  after?: Record<string, string>;
  changeContext?: string;
  changeNotes?: string;
  admin?: string;
};

// ─── Mock Data ─────────────────────────────────────────────────────────────────────────
const MOCK_LOGS: AuditLog[] = [
  {
    id: "1",
    event: "Salary Change",
    eventType: "UPDATE",
    module: "Compensation",
    actor: { name: "Alex Rivers", role: "Global Admin", avatar: "AR", avatarColor: "bg-amber-600" },
    timestamp: "Oct 24, 2023",
    timeDetail: "09:42:15 AM",
    affected: { name: "Jonathan Miller", id: "EMP-9042" },
    ip: "192.168.1.45",
    status: "Success",
    before: { "Base Salary (Annual)": "$85,000", "Effective": "Jan 01, 2023" },
    after: { "Base Salary (Annual)": "$92,500", "Effective": "Oct 24, 2023" },
    changeContext: "Merit-based increase following Q3 Performance Review. Marcus has consistently exceeded KPIs for the editorial design system project and led the migration of the core asset library.",
    admin: "Sarah Chen",
  },
  {
    id: "2",
    event: "Document Upload",
    eventType: "CREATE",
    module: "Employee Directory",
    actor: { name: "Sarah Chen", role: "HR Manager", avatar: "SC", avatarColor: "bg-rose-600" },
    timestamp: "Oct 24, 2023",
    timeDetail: "08:15:02 AM",
    affected: { name: "Elena Rodriguez", id: "EMP-7721" },
    ip: "10.0.0.12",
    status: "Success",
    after: { "Document": "Employment Contract.pdf", "Size": "2.4 MB" },
    admin: "Sarah Chen",
  },
  {
    id: "3",
    event: "Role Update",
    eventType: "UPDATE",
    module: "Employee Directory",
    actor: { name: "Marcus Wright", role: "Recruiter", avatar: "MW", avatarColor: "bg-violet-600" },
    timestamp: "Oct 23, 2023",
    timeDetail: "04:59:30 PM",
    affected: { name: "David Kim", id: "EMP-1044" },
    ip: "192.168.1.78",
    status: "Success",
    before: { "Role": "Junior Developer", "Department": "Engineering" },
    after: { "Role": "Senior Developer", "Department": "Engineering" },
  },
  {
    id: "4",
    event: "Login Failure",
    eventType: "LOGIN",
    module: "Authentication",
    actor: { name: "Unauthorized User", role: "—", avatar: "?", avatarColor: "bg-slate-400" },
    timestamp: "Oct 23, 2023",
    timeDetail: "02:12:44 PM",
    affected: null,
    ip: "192.168.1.45",
    status: "Failed",
    before: {},
    after: {},
    admin: "Sarah Chen",
  },
];

const EVENT_STYLES: Record<EventType, { bg: string; text: string; dot: string }> = {
  CREATE: { bg: "bg-blue-50", text: "text-[#1C4ED8]", dot: "bg-[#1C4ED8]" },
  UPDATE: { bg: "bg-violet-50", text: "text-violet-600", dot: "bg-violet-500" },
  DELETE: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
  VIEW: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
  LOGIN: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500" },
  EXPORT: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
};

// ─── Main Screen ──────────────────────────────────────────────────────────────────────────
export default function AuditLogsScreen() {
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState<EventType | "">("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [currentPage] = useState(1);

  const filtered = MOCK_LOGS.filter((log) => {
    const matchSearch = !search ||
      log.event.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.name.toLowerCase().includes(search.toLowerCase());
    const matchEvent = !eventFilter || log.eventType === eventFilter;
    return matchSearch && matchEvent;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1400px] mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-[28px] font-semibold text-slate-800 tracking-tight">Audit Logs</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Historical data tracking and system monitoring</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_280px] gap-4">
        {/* Total Logs */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">TOTAL LOGS TODAY</p>
          <div className="flex items-end gap-3">
            <p className="text-[32px] leading-none font-bold text-slate-900">1,482</p>
            <span className="text-[12px] font-bold text-[#1C4ED8] mb-1">↑ 12%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Activity peaked at 10:00 AM EST</p>
        </div>

        {/* Security Alerts */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">SECURITY ALERTS</p>
          <div className="flex items-end gap-3">
            <p className="text-[32px] leading-none font-bold text-red-500">03</p>
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full mb-1">CRITICAL</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Last unauthorized attempt 2h ago</p>
        </div>

        {/* Compliance Card */}
        <div className="bg-[#1C4ED8] rounded-xl p-5 text-white">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/70 mb-1">Compliance Ready</p>
          <p className="text-[12px] text-white/80 mb-4">Export full system history for Q3 reporting.</p>
          <button className="w-full py-2 bg-white/15 hover:bg-white/25 text-white text-[12px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
            <Download className="w-3.5 h-3.5" /> Export Log
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <div className="relative">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-50">
              All Modules <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>
          <div className="relative">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-50">
              <Calendar className="w-4 h-4" /> Oct 01, 2023 - Oct 07, 2023
            </button>
          </div>
          <div className="relative">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-50">
              All Admin Users <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>
        <div className="flex-1" />
        <button className="text-[12px] font-bold text-[#1C4ED8] hover:underline">
          CLEAR ALL
        </button>
      </div>

      {/* Table */}
      <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#F8FAFC]">
              <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <th className="px-5 py-3 w-[130px]">Timestamp</th>
                <th className="px-5 py-3">Performed By</th>
                <th className="px-5 py-3">Action</th>
                <th className="px-5 py-3">Employee Affected</th>
                <th className="px-5 py-3 w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-400 text-sm">
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => {
                  const ec = EVENT_STYLES[log.eventType];
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-[13px] font-medium text-slate-900">{log.timestamp}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{log.timeDetail}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0", log.actor.avatarColor)}>
                            {log.actor.avatar}
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-slate-900">{log.actor.name}</p>
                            <p className="text-[11px] text-slate-400">{log.actor.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold", ec.bg, ec.text)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", ec.dot)} />
                          {log.event}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {log.affected ? (
                          <div>
                            <p className="text-[13px] font-semibold text-slate-900">{log.affected.name}</p>
                            <p className="text-[11px] text-slate-400">{log.affected.id}</p>
                          </div>
                        ) : (
                          <span className="text-[13px] text-slate-500">N/A</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 text-slate-400">
                          <button onClick={() => setSelectedLog(log)} className="hover:text-[#1C4ED8] transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="hover:text-[#1C4ED8] transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button className="hover:text-red-500 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-white">
          <span className="text-[13px] text-slate-500">
            Showing 1 to {filtered.length} of {MOCK_LOGS.length} logs
          </span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600">
              <ArrowLeft className="w-4 h-4" />
            </button>
            {[1, 2, 3].map((p) => (
              <button key={p} className={cn(
                "w-8 h-8 flex items-center justify-center rounded-md text-[13px] font-medium transition-colors",
                currentPage === p ? "bg-[#1C4ED8] text-white" : "hover:bg-slate-100 text-slate-600"
              )}>{p}</button>
            ))}
            <span className="px-1 text-slate-400 text-[13px]">...</span>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-md text-[13px] text-slate-600">59</button>
            <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* History Detail Modal */}
      {selectedLog && <AuditDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />}
    </div>
  );
}

// ─── Audit Detail Modal ─────────────────────────────────────────────────────────────────────
function AuditDetailModal({ log, onClose }: { log: AuditLog; onClose: () => void }) {
  const hasBefore = Object.keys(log.before ?? {}).length > 0;
  const hasAfter = Object.keys(log.after ?? {}).length > 0;
  const hasSalary = log.before?.["Base Salary (Annual)"] || log.after?.["Base Salary (Annual)"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-[520px] bg-white rounded-2xl shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1C4ED8]/10 flex items-center justify-center text-[#1C4ED8]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">History Detail</h3>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {log.timestamp}</span>
                <span>·</span>
                <span>Admin: {log.admin || log.actor.name}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Target Subject */}
          <div className="bg-[#F8FAFC] rounded-xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">TARGET SUBJECT</p>
            <p className="text-sm font-bold text-slate-900">
              {log.affected?.name || "N/A"} — {log.affected?.id ? `${log.affected.id}` : ""}
            </p>
          </div>

          {/* Before / After */}
          {(hasBefore || hasAfter) && (
            <div className="grid grid-cols-2 gap-4">
              {/* Previous State */}
              <div className="rounded-xl border border-red-100 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                    <Minus className="w-3 h-3" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">PREVIOUS STATE</p>
                </div>
                {hasBefore ? (
                  <div className="space-y-2">
                    {log.before?.["Base Salary (Annual)"] && (
                      <>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Base Salary (Annual)</p>
                        <p className="text-2xl font-bold text-slate-900">{log.before?.["Base Salary (Annual)"]}</p>
                      </>
                    )}
                    {log.before?.["Effective"] && (
                      <p className="text-[11px] text-slate-400 mt-2">Effective: {log.before["Effective"]}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No previous state</p>
                )}
              </div>

              {/* Current State */}
              <div className="rounded-xl border border-blue-100 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-[#1C4ED8]">
                    <Plus className="w-3 h-3" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#1C4ED8]">CURRENT STATE</p>
                </div>
                {hasAfter ? (
                  <div className="space-y-2">
                    {log.after?.["Base Salary (Annual)"] && (
                      <>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Base Salary (Annual)</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-bold text-slate-900">{log.after?.["Base Salary (Annual)"]}</p>
                          <span className="text-[12px] font-bold text-[#1C4ED8]">+8.8%</span>
                        </div>
                      </>
                    )}
                    {log.after?.["Effective"] && (
                      <p className="text-[11px] text-[#1C4ED8] mt-2">Effective: {log.after["Effective"]}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Record removed</p>
                )}
              </div>
            </div>
          )}

          {/* Change Context */}
          {log.changeContext && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">CHANGE CONTEXT & NOTES</p>
              <p className="text-[13px] text-slate-600 leading-relaxed">{log.changeContext}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-[#F8FAFC]">
          <button className="text-[13px] font-semibold text-[#1C4ED8] hover:underline">
            Revert Change
          </button>
          <button onClick={onClose} className="px-5 py-2 bg-[#1C4ED8] hover:bg-[#1a3eb8] text-white rounded-lg text-[13px] font-semibold transition-colors">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
