"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  ChevronDown,
  Download,
  Eye,
  GraduationCap,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Search,
  SlidersHorizontal,
  Star,
  Timer,
  Trash2,
  X,
  AlertTriangle,
  User,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  FileText,
  TrendingUp,
  Award,
  Clock,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { employeeApi } from "@/lib/api";
import type { Employee } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────
type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const businessUnits = ["Product & Eng", "Growth & Mktg", "Operations", "Human Resources", "Finance & Legal"];
const departments = ["Engineering", "Design & UX", "Product Mgmt", "Data Science", "DevOps", "Security"];

interface EmployeeDirectoryScreenProps {
  employees: Employee[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  onPageChange: (page: number) => void;
  onSearch: (search: string) => void;
  onRefresh: () => void;
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function EmployeeDirectoryScreen({
  employees,
  pagination,
  isLoading,
  error,
  onPageChange,
  onSearch,
  onRefresh,
}: EmployeeDirectoryScreenProps) {
  const [openFilter, setOpenFilter] = useState(false);
  const [openDeptPopover, setOpenDeptPopover] = useState(false);

  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);
  const [openAddWizard, setOpenAddWizard] = useState(false);

  const totalRecords = pagination?.total ?? 128;
  const currentPage = pagination?.page ?? 1;

  const avatarColors = [
    "bg-blue-600", "bg-violet-600", "bg-emerald-600",
    "bg-amber-600", "bg-rose-600", "bg-cyan-600",
  ];

  const getInitials = (e: Employee) =>
    `${e.firstName?.[0] ?? ""}${e.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <span>HRIS</span><ChevronRight className="w-3 h-3" /><span className="text-slate-600 font-medium">Employee Directory</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">Employee Directory</h1>
          <p className="text-sm text-slate-500 mt-0.5">{totalRecords} active workforce records</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            onClick={() => setOpenAddWizard(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1C4ED8] hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Employee
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Main Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4 min-w-0">

          {/* Search + filter bar */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search by name, ID, or email..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <button
                  onClick={() => setOpenDeptPopover((v) => !v)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Business Unit / Dept <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                {openDeptPopover && <DeptPopover onClose={() => setOpenDeptPopover(false)} />}
              </div>
              <button
                onClick={() => setOpenFilter(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
              >
                <SlidersHorizontal className="w-4 h-4" /> Advanced Filters
              </button>
            </div>
          </div>

          {/* Quick chips */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <label className="flex items-center gap-2 text-slate-700 text-[13px] font-medium cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 w-3.5 h-3.5 accent-blue-600" /> Active Only
            </label>
            <label className="flex items-center gap-2 text-slate-700 text-[13px] font-medium cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 w-3.5 h-3.5 accent-blue-600" /> Remote Only
            </label>
            <div className="hidden sm:block w-px h-4 bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Employment:</span>
              {["Contract", "Intern", "Terminated"].map((t) => (
                <span key={t} className="px-3 py-1 rounded-full border border-slate-200 bg-white text-[12px] font-medium text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px]">
                <thead className="bg-[#F8FAFC]">
                  <tr className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {isLoading ? (
                    <tr><td colSpan={5} className="p-10 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                        <span className="text-sm">Loading directory...</span>
                      </div>
                    </td></tr>
                  ) : employees.length === 0 ? (
                    <tr><td colSpan={5} className="p-10 text-center text-slate-400 text-sm">No employees found.</td></tr>
                  ) : (
                    employees.map((e, idx) => {
                      const isActive = e.employmentStatus === "ACTIVE";
                      const colorClass = avatarColors[idx % avatarColors.length];
                      return (
                        <tr key={e.id} className="hover:bg-slate-50/60 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-[12px] font-bold", colorClass)}>
                                {getInitials(e)}
                              </div>
                              <div className="min-w-0">
                                <div className="text-[14px] font-semibold text-slate-900 truncate">{e.firstName} {e.lastName}</div>
                                <div className="text-[12px] text-slate-500 truncate">{e.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[11px] font-bold text-blue-700 tracking-wide uppercase bg-blue-50 px-2 py-1 rounded">
                              {e.department?.name ?? "ENGINEERING"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[14px] text-slate-600">
                            {e.jobTitle ?? "Senior Developer"}
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide",
                              isActive ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-500"
                            )}>
                              <span className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-blue-600" : "bg-slate-400")} />
                              {isActive ? "Active" : (e.employmentStatus ?? "Inactive")}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3 text-slate-400">
                              <button onClick={() => setViewEmployee(e)} className="hover:text-slate-700 transition-colors" title="View profile">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button onClick={() => setEditEmployee(e)} className="hover:text-slate-700 transition-colors" title="Edit">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button onClick={() => setDeleteEmployee(e)} className="hover:text-red-500 transition-colors" title="Delete">
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
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 gap-3 bg-white">
              <span className="text-[13px] text-slate-500">
                Showing {Math.min(10, employees.length)} of {totalRecords} employees
              </span>
              <div className="flex items-center gap-1 text-[13px] font-medium text-slate-600">
                <button
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-md disabled:opacity-30"
                >
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
                {[1, 2, 3].map((p) => (
                  <button key={p} onClick={() => onPageChange(p)} className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-md transition-colors",
                    currentPage === p ? "bg-[#1C4ED8] text-white" : "hover:bg-slate-100"
                  )}>{p}</button>
                ))}
                <span className="px-1 text-slate-400">...</span>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-md">13</button>
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={isLoading}
                  className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-md disabled:opacity-30"
                >
                  <ChevronDown className="w-4 h-4 -rotate-90" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Rail */}
        <aside className="w-full lg:w-[260px] shrink-0 space-y-6">
          <MetricCard label="RETENTION RATE" value="94.2%" trend="+2%" />
          <div className="h-px bg-slate-100" />
          <MetricCard label="OPEN ROLES" value="12" trend="Hiring Active" trendTone="muted" />
          <div className="h-px bg-slate-100" />
          <div className="pt-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">HEALTH INDEX</div>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-[32px] leading-none font-semibold text-slate-800">4.8</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-blue-600 text-blue-600" />
                ))}
              </div>
            </div>
          </div>
          <div className="h-px bg-slate-100" />
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">DEPT BREAKDOWN</p>
            {[
              { dept: "Engineering", pct: 38 },
              { dept: "Operations", pct: 24 },
              { dept: "Sales & Mktg", pct: 20 },
              { dept: "HR & Legal", pct: 18 },
            ].map((d) => (
              <div key={d.dept} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>{d.dept}</span><span className="font-semibold">{d.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100">
                  <div className="h-1.5 rounded-full bg-blue-600" style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Overlays */}
      {openFilter && <FilterDrawer onClose={() => setOpenFilter(false)} />}
      {viewEmployee && (
        <ViewProfileDrawer
          employee={viewEmployee}
          onClose={() => setViewEmployee(null)}
          onEdit={() => { setEditEmployee(viewEmployee); setViewEmployee(null); }}
        />
      )}
      {editEmployee && (
        <EditEmployeeModal
          employee={editEmployee}
          onClose={() => setEditEmployee(null)}
          onSuccess={onRefresh}
        />
      )}
      {deleteEmployee && (
        <DeleteConfirmModal
          employee={deleteEmployee}
          onClose={() => setDeleteEmployee(null)}
          onSuccess={onRefresh}
        />
      )}
      <AddEmployeeModal isOpen={openAddWizard} onClose={() => setOpenAddWizard(false)} onSuccess={onRefresh} />
    </div>
  );
}

// ─── MetricCard ───────────────────────────────────────────────────────────────
function MetricCard({
  label, value, trend, trendTone = "positive",
}: { label: string; value: string; trend: string; trendTone?: "positive" | "muted" }) {
  return (
    <div className="pt-2">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="flex items-end gap-2 mt-3">
        <span className="text-[32px] leading-none font-semibold text-slate-800">{value}</span>
        <span className={cn("text-[12px] font-semibold mb-1", trendTone === "positive" ? "text-blue-600" : "text-slate-400")}>
          {trendTone === "positive" && "↗ "}{trend}
        </span>
      </div>
    </div>
  );
}

// ─── DeptPopover ──────────────────────────────────────────────────────────────
function DeptPopover({ onClose }: { onClose: () => void }) {
  const [selBU, setSelBU] = useState<string[]>([]);
  const [selDept, setSelDept] = useState<string[]>([]);

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute left-0 top-full mt-2 z-50 w-[460px] rounded-xl border border-slate-200 bg-white shadow-xl p-0 overflow-hidden">
        <div className="flex">
          {/* Business Units */}
          <div className="flex-1 border-r border-slate-100 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Business Units</p>
            <div className="space-y-1.5">
              {businessUnits.map((bu) => (
                <label key={bu} className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => toggle(selBU, setSelBU, bu)}
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                      selBU.includes(bu) ? "bg-blue-600 border-blue-600" : "border-slate-300 group-hover:border-blue-400"
                    )}
                  >
                    {selBU.includes(bu) && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className="text-[13px] text-slate-700">{bu}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Departments */}
          <div className="flex-1 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Departments</p>
            <div className="space-y-1.5">
              {departments.map((dept) => (
                <label key={dept} className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => toggle(selDept, setSelDept, dept)}
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                      selDept.includes(dept) ? "bg-blue-600 border-blue-600" : "border-slate-300 group-hover:border-blue-400"
                    )}
                  >
                    {selDept.includes(dept) && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className="text-[13px] text-slate-700">{dept}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50">
          <button onClick={() => { setSelBU([]); setSelDept([]); }} className="text-xs text-slate-500 hover:text-slate-700 font-medium">Clear all</button>
          <button onClick={onClose} className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700">
            Apply ({selBU.length + selDept.length} selected)
          </button>
        </div>
      </div>
    </>
  );
}

// ─── FilterDrawer ─────────────────────────────────────────────────────────────
function FilterDrawer({ onClose }: { onClose: () => void }) {
  const [empTypes, setEmpTypes] = useState<string[]>([]);
  const [dept, setDept] = useState("");
  const [locations, setLocations] = useState(["Lagos", "Nigeria", "Remote"]);
  const [newLoc, setNewLoc] = useState("");
  const [tenureRange, setTenureRange] = useState<[number, number]>([0, 10]);

  const toggleEmpType = (t: string) =>
    setEmpTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const addLocation = () => {
    if (newLoc.trim()) {
      setLocations((prev) => [...prev, newLoc.trim()]);
      setNewLoc("");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/30" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-full w-[380px] bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Filter Settings</h3>
            <p className="text-xs text-slate-500 mt-0.5">Narrow down employee records</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { setEmpTypes([]); setDept(""); setLocations([]); setTenureRange([0, 10]); }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700">Reset All</button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-7">
          {/* Employment Type */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">Employment Type</p>
            <div className="space-y-2.5">
              {["Full-Time", "Contract", "Intern"].map((t) => (
                <label key={t} className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => toggleEmpType(t)}
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                      empTypes.includes(t) ? "bg-blue-600 border-blue-600" : "border-slate-300 group-hover:border-blue-400"
                    )}
                  >
                    {empTypes.includes(t) && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className="text-sm text-slate-700">{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Department */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">Department</p>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All Departments</option>
              {departments.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>

          {/* Location */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">Location</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {locations.map((loc) => (
                <span key={loc} className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[12px] font-medium text-slate-700">
                  {loc}
                  <button onClick={() => setLocations((prev) => prev.filter((l) => l !== loc))} className="text-slate-400 hover:text-slate-700">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newLoc}
                onChange={(e) => setNewLoc(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addLocation()}
                placeholder="Add location..."
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <button onClick={addLocation} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 text-sm font-medium transition-colors">
                Add
              </button>
            </div>
          </div>

          {/* Tenure Range */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tenure Range</p>
              <span className="text-xs font-semibold text-blue-600">{tenureRange[0]}–{tenureRange[1]} years</span>
            </div>
            <div className="relative h-2 bg-slate-200 rounded-full">
              <div
                className="absolute h-2 bg-blue-600 rounded-full"
                style={{ left: `${tenureRange[0] * 10}%`, right: `${100 - tenureRange[1] * 10}%` }}
              />
              <input
                type="range" min={0} max={10} value={tenureRange[0]}
                onChange={(e) => setTenureRange([Math.min(+e.target.value, tenureRange[1] - 1), tenureRange[1]])}
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-2">
              <span>0 yr</span><span>5 yr</span><span>10 yr</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">
            Apply Filters
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── ViewProfileDrawer ────────────────────────────────────────────────────────
function ViewProfileDrawer({
  employee, onClose, onEdit,
}: { employee: Employee; onClose: () => void; onEdit: () => void }) {
  const [activeTab, setActiveTab] = useState<"Profile" | "Performance" | "Documents">("Profile");

  const name = `${employee.firstName} ${employee.lastName}`;
  const initials = `${employee.firstName?.[0] ?? ""}${employee.lastName?.[0] ?? ""}`;

  const perfBars = [
    { month: "Jan", score: 72 },
    { month: "Feb", score: 85 },
    { month: "Mar", score: 78 },
    { month: "Apr", score: 92 },
    { month: "May", score: 88 },
    { month: "Jun", score: 95 },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/30" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-full w-[460px] bg-white z-50 shadow-2xl flex flex-col overflow-hidden">
        {/* Profile header */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-6 pt-6 pb-0 relative">
          <button onClick={onClose} className="absolute right-4 top-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white text-xl font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-white">{name}</h2>
                <span className="px-2 py-0.5 bg-emerald-400/30 text-emerald-100 text-[10px] font-bold rounded-full uppercase">Active</span>
              </div>
              <p className="text-sm text-blue-100 mt-0.5">{employee.jobTitle ?? "Senior Frontend Developer"}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2 py-0.5 bg-white/20 text-white text-[11px] font-semibold rounded">
                  {employee.department?.name ?? "Engineering"}
                </span>
                <span className="text-blue-200 text-[11px]">EMP-{employee.id?.toString().slice(0, 4).toUpperCase() ?? "0042"}</span>
              </div>
            </div>
          </div>

          {/* Contact row */}
          <div className="flex items-center gap-4 pb-4 text-blue-100 text-[12px]">
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{employee.email}</span>
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />+234 800 000 0000</span>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/20">
            {(["Profile", "Performance", "Documents"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                  activeTab === t
                    ? "border-white text-white"
                    : "border-transparent text-blue-200 hover:text-white"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "Profile" && (
            <div className="p-6 space-y-6">
              {/* Employment Details */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Employment Details</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Start Date", value: "Jan 15, 2021" },
                    { label: "Employment Type", value: "Full-Time" },
                    { label: "Location", value: "Lagos, NG" },
                    { label: "Manager", value: "Elena Vance" },
                  ].map((d) => (
                    <div key={d.label} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                      <p className="text-[10px] font-semibold uppercase text-slate-400">{d.label}</p>
                      <p className="text-sm font-semibold text-slate-800 mt-0.5">{d.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Employment History */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Employment History</p>
                <div className="relative space-y-4 pl-5">
                  <div className="absolute left-[7px] top-1.5 bottom-1.5 w-px bg-slate-200" />
                  {[
                    { role: "Senior Frontend Developer", company: "360DegreesHR", period: "Jan 2021 – Present", current: true },
                    { role: "Frontend Developer", company: "TechCorp Ltd", period: "Mar 2019 – Dec 2020", current: false },
                    { role: "Junior Developer", company: "StartupXYZ", period: "Jun 2018 – Feb 2019", current: false },
                  ].map((h, i) => (
                    <div key={i} className="relative">
                      <div className={cn(
                        "absolute -left-5 top-1 w-3.5 h-3.5 rounded-full border-2 bg-white",
                        h.current ? "border-blue-600" : "border-slate-300"
                      )} />
                      <div className="bg-white border border-slate-100 rounded-lg p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{h.role}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{h.company}</p>
                          </div>
                          {h.current && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full">Current</span>}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{h.period}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competencies */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Competencies</p>
                <div className="flex flex-wrap gap-2">
                  {["React", "TypeScript", "Node.js", "System Design", "Team Leadership", "REST APIs", "GraphQL", "PostgreSQL"].map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-700 text-[12px] font-medium rounded-full border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Performance" && (
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-slate-900">Performance Overview</p>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">92nd Percentile</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">Jan–Jun 2024 · Engineering Dept</p>

                {/* SVG Bar Chart */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <svg viewBox="0 0 300 120" className="w-full">
                    {perfBars.map((b, i) => {
                      const x = 20 + i * 46;
                      const barH = (b.score / 100) * 80;
                      return (
                        <g key={b.month}>
                          <rect x={x} y={100 - barH} width={28} height={barH} rx={4}
                            fill={i === 5 ? "#1C4ED8" : i === 3 ? "#818CF8" : "#BFDBFE"} />
                          <text x={x + 14} y={115} textAnchor="middle" fontSize={8} fill="#94A3B8">{b.month}</text>
                          <text x={x + 14} y={100 - barH - 4} textAnchor="middle" fontSize={7} fill="#475569">{b.score}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Score Breakdown */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Score Breakdown</p>
                <div className="space-y-3">
                  {[
                    { label: "Quality of Work", score: 4.8, pct: 96 },
                    { label: "Productivity", score: 4.2, pct: 84 },
                    { label: "Communication", score: 3.9, pct: 78 },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-700">{s.label}</span>
                        <span className="font-semibold text-slate-900">{s.score}/5</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full">
                        <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Documents" && (
            <div className="p-6">
              <div className="space-y-2">
                {["Employment Contract.pdf", "Offer Letter.pdf", "NDA Agreement.pdf", "Performance Review Q1.pdf"].map((doc) => (
                  <div key={doc} className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-sm text-slate-700 flex-1">{doc}</span>
                    <Download className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="border-t border-slate-100 px-6 py-4 bg-slate-50">
          <div className="grid grid-cols-3 divide-x divide-slate-200 text-center">
            {[
              { label: "Tenure", value: "3.2 yr" },
              { label: "Projects", value: "12" },
              { label: "Promotions", value: "3" },
            ].map((s) => (
              <div key={s.label} className="px-2">
                <p className="text-base font-bold text-slate-900">{s.value}</p>
                <p className="text-[11px] text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={onEdit} className="flex-1 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-white transition-colors flex items-center justify-center gap-1.5">
              <Pencil className="w-4 h-4" /> Edit Record
            </button>
            <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> Performance
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── EditEmployeeModal ────────────────────────────────────────────────────────
const EDIT_TABS = ["Basic Info", "Job Details", "Compensation", "Emergency Contacts"] as const;
type EditTab = typeof EDIT_TABS[number];

function EditEmployeeModal({
  employee, onClose, onSuccess,
}: { employee: Employee; onClose: () => void; onSuccess: () => void }) {
  const [activeTab, setActiveTab] = useState<EditTab>("Basic Info");
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => employeeApi.update(employee.id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["employees"] }); onSuccess(); onClose(); },
  });

  const [form, setForm] = useState({
    firstName: employee.firstName ?? "",
    lastName: employee.lastName ?? "",
    middleName: "",
    email: employee.email ?? "",
    phone: "",
    gender: "MALE",
    dob: "",
    department: employee.department?.name ?? "",
    jobTitle: employee.jobTitle ?? "",
    manager: "",
    startDate: "",
    location: "Lagos, Nigeria",
    employmentType: "FULL_TIME",
    salaryAmount: "",
    currency: "USD",
    payPeriod: "Monthly",
    bonusType: "Performance",
    bonusAmount: "",
    benefitHealth: true,
    benefitPension: false,
    benefitHMO: false,
    ecName: "",
    ecRelationship: "",
    ecPhone: "",
    ecEmail: "",
  });

  const f = (key: keyof typeof form) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value })),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-[680px] bg-white rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Edit Employee Record</h3>
            <p className="text-xs text-slate-500 mt-0.5">{employee.firstName} {employee.lastName} · {employee.email}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6 bg-slate-50/50">
          {EDIT_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={cn(
                "px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors whitespace-nowrap",
                activeTab === t ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "Basic Info" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <FieldWrap label="First Name"><input {...f("firstName")} className={inputCls} /></FieldWrap>
                <FieldWrap label="Last Name"><input {...f("lastName")} className={inputCls} /></FieldWrap>
                <FieldWrap label="Middle Name"><input {...f("middleName")} placeholder="Optional" className={inputCls} /></FieldWrap>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FieldWrap label="Corporate Email"><input type="email" {...f("email")} className={inputCls} /></FieldWrap>
                <FieldWrap label="Phone Number"><input {...f("phone")} placeholder="+234 000 000 0000" className={inputCls} /></FieldWrap>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FieldWrap label="Gender">
                  <select {...f("gender")} className={inputCls}>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </FieldWrap>
                <FieldWrap label="Date of Birth"><input type="date" {...f("dob")} className={inputCls} /></FieldWrap>
              </div>
            </div>
          )}

          {activeTab === "Job Details" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FieldWrap label="Department">
                  <select {...f("department")} className={inputCls}>
                    <option value="">Select Department</option>
                    {departments.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </FieldWrap>
                <FieldWrap label="Job Title"><input {...f("jobTitle")} placeholder="e.g. Lead Architect" className={inputCls} /></FieldWrap>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FieldWrap label="Direct Manager"><input {...f("manager")} placeholder="Search manager..." className={inputCls} /></FieldWrap>
                <FieldWrap label="Start Date"><input type="date" {...f("startDate")} className={inputCls} /></FieldWrap>
              </div>
              <FieldWrap label="Location"><input {...f("location")} placeholder="e.g. Lagos, Nigeria" className={inputCls} /></FieldWrap>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Employment Type</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "FULL_TIME", label: "Full-Time", Icon: Briefcase },
                    { value: "CONTRACT", label: "Contract", Icon: Timer },
                    { value: "INTERN", label: "Intern", Icon: GraduationCap },
                  ].map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, employmentType: value }))}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                        form.employmentType === value
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-semibold">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Compensation" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <FieldWrap label="Base Salary"><input type="number" {...f("salaryAmount")} placeholder="85000" className={inputCls} /></FieldWrap>
                </div>
                <FieldWrap label="Currency">
                  <select {...f("currency")} className={inputCls}>
                    <option value="USD">USD ($)</option>
                    <option value="NGN">NGN (₦)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </FieldWrap>
              </div>
              <FieldWrap label="Pay Period">
                <select {...f("payPeriod")} className={inputCls}>
                  <option>Monthly</option>
                  <option>Bi-Weekly</option>
                  <option>Annually</option>
                </select>
              </FieldWrap>
              <div className="grid grid-cols-2 gap-4">
                <FieldWrap label="Bonus Type">
                  <select {...f("bonusType")} className={inputCls}>
                    <option>None</option>
                    <option>Performance</option>
                    <option>Annual</option>
                    <option>Signing</option>
                  </select>
                </FieldWrap>
                <FieldWrap label="Bonus Amount"><input type="number" {...f("bonusAmount")} placeholder="0" className={inputCls} /></FieldWrap>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Benefits</p>
                <div className="space-y-2.5">
                  {[
                    { key: "benefitHealth" as const, label: "Health Insurance" },
                    { key: "benefitPension" as const, label: "Pension / Retirement" },
                    { key: "benefitHMO" as const, label: "HMO Cover" },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                      <div
                        onClick={() => setForm((p) => ({ ...p, [key]: !p[key] }))}
                        className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                          form[key] ? "bg-blue-600 border-blue-600" : "border-slate-300"
                        )}
                      >
                        {form[key] && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className="text-sm text-slate-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Emergency Contacts" && (
            <div className="space-y-4">
              <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">Primary Contact</p>
                <div className="grid grid-cols-2 gap-4">
                  <FieldWrap label="Full Name"><input {...f("ecName")} placeholder="Jane Chen" className={inputCls} /></FieldWrap>
                  <FieldWrap label="Relationship">
                    <select {...f("ecRelationship")} className={inputCls}>
                      <option value="">Select...</option>
                      <option>Spouse</option>
                      <option>Parent</option>
                      <option>Sibling</option>
                      <option>Friend</option>
                      <option>Other</option>
                    </select>
                  </FieldWrap>
                  <FieldWrap label="Phone Number"><input {...f("ecPhone")} placeholder="+234 000 000 0000" className={inputCls} /></FieldWrap>
                  <FieldWrap label="Email"><input type="email" {...f("ecEmail")} placeholder="jane@example.com" className={inputCls} /></FieldWrap>
                </div>
              </div>
              <button className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Another Contact
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex gap-1">
            {EDIT_TABS.map((t, i) => (
              <div key={t} className={cn("w-2 h-2 rounded-full transition-colors", activeTab === t ? "bg-blue-600" : "bg-slate-200")} />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button
              onClick={() => updateMutation.mutate({ firstName: form.firstName, lastName: form.lastName, email: form.email, jobTitle: form.jobTitle })}
              disabled={updateMutation.isPending}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DeleteConfirmModal ───────────────────────────────────────────────────────
const TERMINATION_REASONS = [
  { value: "RESIGNATION", label: "Resignation", desc: "Employee voluntarily leaving the organisation" },
  { value: "ON_LEAVE", label: "On Leave", desc: "Employee on extended or unpaid leave" },
  { value: "DISCIPLINARY", label: "Disciplinary Action", desc: "Termination due to policy violation" },
] as const;

function DeleteConfirmModal({
  employee, onClose, onSuccess,
}: { employee: Employee; onClose: () => void; onSuccess: () => void }) {
  const [reason, setReason] = useState<string>("");
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => employeeApi.delete(employee.id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["employees"] }); onSuccess(); onClose(); },
  });

  const name = `${employee.firstName} ${employee.lastName}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Employee Record</h3>
              <p className="text-sm text-slate-500 mt-0.5">This action is permanent and cannot be undone.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Employee info */}
        <div className="mx-6 my-4 p-3 bg-slate-50 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {`${employee.firstName?.[0] ?? ""}${employee.lastName?.[0] ?? ""}`}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{name}</p>
            <p className="text-xs text-slate-500">{employee.email} · {employee.department?.name ?? "Engineering"}</p>
          </div>
        </div>

        {/* Reason selection */}
        <div className="px-6 pb-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">Reason for Termination</p>
          <div className="space-y-2">
            {TERMINATION_REASONS.map(({ value, label, desc }) => (
              <label
                key={value}
                onClick={() => setReason(value)}
                className={cn(
                  "flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all",
                  reason === value ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-colors",
                  reason === value ? "border-blue-600" : "border-slate-300"
                )}>
                  {reason === value && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => deleteMutation.mutate()}
            disabled={!reason || deleteMutation.isPending}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold disabled:opacity-40 transition-colors"
          >
            {deleteMutation.isPending ? "Processing..." : "Terminate Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── AddEmployeeModal ─────────────────────────────────────────────────────────
type AddFormData = {
  firstName: string; lastName: string; email: string; phone: string;
  departmentId: string; jobTitle: string; employmentType: string;
  salary: string; currency: string; startDate: string; manager: string;
};

const EMPTY: AddFormData = {
  firstName: "", lastName: "", email: "", phone: "",
  departmentId: "", jobTitle: "", employmentType: "FULL_TIME",
  salary: "", currency: "USD", startDate: "", manager: "",
};

function AddEmployeeModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<AddFormData>(EMPTY);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => employeeApi.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["employees"] }); onSuccess(); reset(); },
  });

  if (!isOpen) return null;

  const reset = () => { setStep(1); setForm(EMPTY); onClose(); };

  const f = (key: keyof AddFormData) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value })),
  });

  const handleNext = () => {
    if (step < 3) setStep((p) => (p + 1) as 1 | 2 | 3);
    else mutation.mutate({ ...form, password: "DefaultPassword123!", dateOfBirth: new Date("1990-01-01").toISOString(), hireDate: new Date().toISOString() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={reset} />
      <div className="relative w-full max-w-[860px] bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row min-h-[580px] border border-slate-100 z-10 overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-[240px] bg-[#F8FAFC] border-r border-slate-100 p-6 flex flex-col gap-8 shrink-0">
          <div>
            <h2 className="text-base font-bold text-[#1E3A8A]">360DegreesHR</h2>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Onboarding System</p>
          </div>
          <div className="relative flex flex-col gap-6 pl-2">
            <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-slate-200" />
            {([
              [1, "Personal Info"],
              [2, "Job Details"],
              [3, "Payroll & Benefits"],
            ] as [number, string][]).map(([s, label]) => (
              <div key={s} className="relative flex items-center gap-3">
                <div className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center z-10 transition-all border-2",
                  step === s ? "bg-white border-blue-600 ring-4 ring-blue-50"
                    : step > s ? "bg-blue-600 border-blue-600" : "bg-slate-200 border-slate-200"
                )}>
                  {step > s && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  {step === s && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                </div>
                <div>
                  <p className={cn("text-[10px] font-bold uppercase tracking-wide", step === s ? "text-blue-600" : "text-slate-400")}>Step 0{s}</p>
                  <p className={cn("text-xs mt-0.5", step === s ? "font-bold text-blue-900" : "font-semibold text-slate-500")}>{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="px-8 py-6 border-b border-slate-100 relative">
            <button onClick={reset} className="absolute right-6 top-6 p-1.5 rounded-lg hover:bg-slate-50 text-slate-400">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-slate-900">
              {step === 1 ? "Personal Information" : step === 2 ? "Job Assignment" : "Payroll & Benefits"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {step === 1 ? "Basic employee identification details" : step === 2 ? "Assign role and team placement" : "Set compensation and benefits"}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FieldWrap label="First Name"><input {...f("firstName")} placeholder="Marcus" className={inputCls} /></FieldWrap>
                  <FieldWrap label="Last Name"><input {...f("lastName")} placeholder="Chen" className={inputCls} /></FieldWrap>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FieldWrap label="Corporate Email"><input type="email" {...f("email")} placeholder="m.chen@360hr.com" className={inputCls} /></FieldWrap>
                  <FieldWrap label="Mobile Number"><input {...f("phone")} placeholder="+234 800 000 0000" className={inputCls} /></FieldWrap>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FieldWrap label="Department">
                    <select {...f("departmentId")} className={inputCls}>
                      <option value="">Select Department</option>
                      {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </FieldWrap>
                  <FieldWrap label="Official Role / Title"><input {...f("jobTitle")} placeholder="e.g. Lead Architect" className={inputCls} /></FieldWrap>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FieldWrap label="Direct Manager"><input {...f("manager")} placeholder="Search by name..." className={inputCls} /></FieldWrap>
                  <FieldWrap label="Start Date"><input type="date" {...f("startDate")} className={inputCls} /></FieldWrap>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Employment Type</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "FULL_TIME", label: "Full-Time", Icon: Briefcase, desc: "Permanent" },
                      { value: "CONTRACT", label: "Contract", Icon: Timer, desc: "Fixed Term" },
                      { value: "INTERN", label: "Intern", Icon: GraduationCap, desc: "Learning" },
                    ].map(({ value, label, Icon, desc }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, employmentType: value }))}
                        className={cn(
                          "flex flex-col items-center gap-1.5 p-4 rounded-xl border transition-all",
                          form.employmentType === value
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-bold">{label}</span>
                        <span className="text-[10px] opacity-70">{desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FieldWrap label="Base Salary"><input type="number" {...f("salary")} placeholder="85000" className={inputCls} /></FieldWrap>
                  <FieldWrap label="Currency">
                    <select {...f("currency")} className={inputCls}>
                      <option value="USD">USD ($)</option>
                      <option value="NGN">NGN (₦)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </FieldWrap>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">Ready for Provisioning</p>
                    <p className="text-xs text-amber-700 mt-0.5 leading-normal">Submitting will create the workforce record in the system.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100">
            <button
              onClick={() => setStep((p) => Math.max(1, p - 1) as 1 | 2 | 3)}
              disabled={step === 1}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-30"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <div className="flex items-center gap-3">
              <button onClick={reset} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button
                onClick={handleNext}
                disabled={mutation.isPending}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold disabled:opacity-50"
              >
                {step === 3 ? (mutation.isPending ? "Creating..." : "Create Employee") : (<>Next Step <ArrowRight className="w-3.5 h-3.5" /></>)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared UI Helpers ────────────────────────────────────────────────────────
const inputCls = "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function FieldWrap({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</label>
      {children}
    </div>
  );
}
