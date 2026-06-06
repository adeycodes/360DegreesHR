


































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  Shield,
  PhoneCall,
  Calendar,
  Tag,
  Upload,
  Info,
  Printer,
  ChevronUp,
  MoreVertical,
  Wallet,
  Users,
  RefreshCw,
  CheckCircle2,
  Copy,
  KeyRound,
  FileSpreadsheet,
  UserPlus,
  FolderOpen,
  Filter,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { employeeApi, departmentApi, toUserMessage } from "@/lib/api";
import type { Employee } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────
type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const businessUnits = [
  "Product & Eng",
  "Growth & Mktg",
  "Operations",
  "Human Resources",
  "Finance & Legal",
];

const departments = [
  "Engineering",
  "Design & UX",
  "Product Mgmt",
  "Data Science",
  "DevOps",
  "Security",
];

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
  const [addDropdownOpen, setAddDropdownOpen] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showOpenRecord, setShowOpenRecord] = useState(false);

  const totalRecords = pagination?.total ?? 128;
  const currentPage = pagination?.page ?? 1;

  const avatarColors = [
    "bg-blue-600",
    "bg-violet-600",
    "bg-emerald-600",
    "bg-amber-600",
    "bg-rose-600",
    "bg-cyan-600",
  ];

  const getInitials = (e: Employee) =>
    `${e.firstName?.[0] ?? ""}${e.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-[28px] font-semibold text-slate-800 tracking-tight">
            Employee Directory
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            {totalRecords} active workforce records
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <div className="relative">
            <button
              onClick={() => setAddDropdownOpen((v) => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1C4ED8] hover:bg-[#1a3eb8] text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Employee
            </button>
            {addDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden">
                <button
                  onClick={() => {
                    setAddDropdownOpen(false);
                    setShowDocumentUpload(true);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <FolderOpen className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="font-medium">Upload Document</p>
                    <p className="text-[11px] text-slate-500">NYSC, letter, etc.</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setAddDropdownOpen(false);
                    setShowBulkUpload(true);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <FileSpreadsheet className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="font-medium">Bulk Upload</p>
                    <p className="text-[11px] text-slate-500">Import via Excel</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setAddDropdownOpen(false);
                    setShowOpenRecord(true);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <UserPlus className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="font-medium">Open Employee Record</p>
                    <p className="text-[11px] text-slate-500">Find and view by ID</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setAddDropdownOpen(false);
                    setOpenAddWizard(true);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <UserPlus className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="font-medium">Add Manually</p>
                    <p className="text-[11px] text-slate-500">Create via form</p>
                  </div>
                </button>
              </div>
            )}
          </div>
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
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1C4ED8] focus:ring-1 focus:ring-[#1C4ED8]/20 placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <button
                  onClick={() => setOpenDeptPopover((v) => !v)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Business Unit{" "}
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                {openDeptPopover && (
                  <DeptPopover onClose={() => setOpenDeptPopover(false)} />
                )}
              </div>
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  Team / Dept <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <button
                onClick={() => setOpenFilter(true)}
                className="flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick chips */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <label className="flex items-center gap-2 text-slate-700 text-[13px] font-medium cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-slate-300 w-3.5 h-3.5 accent-[#1C4ED8]"
              />{" "}
              Active Only
            </label>
            <label className="flex items-center gap-2 text-slate-700 text-[13px] font-medium cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-slate-300 w-3.5 h-3.5 accent-[#1C4ED8]"
              />{" "}
              Remote Only
            </label>
            <div className="hidden sm:block w-px h-4 bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                EMPLOYMENT:
              </span>
              {["Contract", "Intern", "Terminated"].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full border border-slate-200 bg-white text-[12px] font-medium text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="bg-[#F8FAFC]">
                  <tr className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                    <th className="px-5 py-3">Employee</th>
                    <th className="px-5 py-3">Department</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <Filter className="w-3 h-3" />
                        Actions
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-10 text-center text-slate-400"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-6 h-6 border-2 border-blue-200 border-t-[#1C4ED8] rounded-full animate-spin" />
                          <span className="text-sm">Loading directory...</span>
                        </div>
                      </td>
                    </tr>
                  ) : employees.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-10 text-center text-slate-400 text-sm"
                      >
                        No employees found.
                      </td>
                    </tr>
                  ) : (
                    employees.map((e, idx) => {
                      const isActive = ["ACTIVE", "Active", "active"].includes(e.employmentStatus ?? "");
                      const colorClass = avatarColors[idx % avatarColors.length];
                      return (
                        <tr
                          key={e.id}
                          className="hover:bg-slate-50/60 transition-colors group"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-[12px] font-bold",
                                  colorClass
                                )}
                              >
                                {getInitials(e)}
                              </div>
                              <div className="min-w-0">
                                <div className="text-[14px] font-semibold text-slate-900 truncate">
                                  {e.firstName} {e.lastName}
                                </div>
                                <div className="text-[12px] text-slate-500 truncate">
                                  {e.user?.email ?? e.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-[11px] font-bold text-[#1C4ED8] tracking-wide uppercase bg-blue-50 px-2 py-0.5 rounded">
                              {e.department?.name ?? "—"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-[14px] text-slate-600">
                            {e.jobTitle ?? "—"}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide",
                                isActive
                                  ? "bg-blue-50 text-[#1C4ED8]"
                                  : "bg-slate-100 text-slate-500"
                              )}
                            >
                              <span
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  isActive ? "bg-[#1C4ED8]" : "bg-slate-400"
                                )}
                              />
                              {isActive ? "ACTIVE" : (e.employmentStatus ?? "INACTIVE")}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3 text-slate-400">
                              <button
                                onClick={() => setViewEmployee(e)}
                                className="hover:text-slate-700 transition-colors"
                                title="View profile"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditEmployee(e)}
                                className="hover:text-slate-700 transition-colors"
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteEmployee(e)}
                                className="hover:text-red-500 transition-colors"
                                title="Delete"
                              >
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
            <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 border-t border-slate-100 gap-3 bg-white">
              <span className="text-[13px] text-slate-500">
                Showing {Math.min(10, employees.length)} of {totalRecords}{" "}
                employees
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
                  <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-md transition-colors",
                      currentPage === p
                        ? "bg-[#1C4ED8] text-white"
                        : "hover:bg-slate-100"
                    )}
                  >
                    {p}
                  </button>
                ))}
                <span className="px-1 text-slate-400">...</span>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-md">
                  13
                </button>
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
          <MetricCard
            label="OPEN ROLES"
            value="12"
            trend="Hiring Active"
            trendTone="muted"
          />
          <div className="h-px bg-slate-100" />
          <div className="pt-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              HEALTH INDEX
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-[32px] leading-none font-semibold text-slate-800">
                4.8
              </span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="w-4 h-4 fill-[#1C4ED8] text-[#1C4ED8]"
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Overlays */}
      {openFilter && <FilterDrawer onClose={() => setOpenFilter(false)} />}
      {viewEmployee && (
        <ViewProfileDrawer
          employee={viewEmployee}
          onClose={() => setViewEmployee(null)}
          onEdit={() => {
            setEditEmployee(viewEmployee);
            setViewEmployee(null);
          }}
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
      <AddEmployeeModal
        isOpen={openAddWizard}
        onClose={() => setOpenAddWizard(false)}
        onSuccess={onRefresh}
      />
      {showBulkUpload && (
        <BulkUploadModal
          onClose={() => setShowBulkUpload(false)}
          onSuccess={onRefresh}
        />
      )}
      {showDocumentUpload && (
        <DocumentUploadModal
          onClose={() => setShowDocumentUpload(false)}
          onSuccess={onRefresh}
        />
      )}
      {showOpenRecord && (
        <OpenRecordModal
          onClose={() => setShowOpenRecord(false)}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
}

// ─── MetricCard ───────────────────────────────────────────────────────────────────
function MetricCard({
  label,
  value,
  trend,
  trendTone = "positive",
}: {
  label: string;
  value: string;
  trend: string;
  trendTone?: "positive" | "muted";
}) {
  return (
    <div className="pt-2">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div className="flex items-end gap-2 mt-3">
        <span className="text-[32px] leading-none font-semibold text-slate-800">
          {value}
        </span>
        <span
          className={cn(
            "text-[12px] font-semibold mb-1",
            trendTone === "positive"
              ? "text-[#1C4ED8]"
              : "text-slate-400"
          )}
        >
          {trendTone === "positive" && "↑ "}
          {trend}
        </span>
      </div>
    </div>
  );
}

// ─── DeptPopover ──────────────────────────────────────────────────────────────
function DeptPopover({ onClose }: { onClose: () => void }) {
  const [selBU, setSelBU] = useState<string[]>([]);
  const [selDept, setSelDept] = useState<string[]>([]);

  const toggle = (
    arr: string[],
    setArr: (v: string[]) => void,
    val: string
  ) => {
    setArr(
      arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute left-0 top-full mt-2 z-50 w-[460px] rounded-xl border border-slate-200 bg-white shadow-xl p-0 overflow-hidden">
        {/* Search bar */}
        <div className="px-4 pt-4 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search units or departments..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1C4ED8] placeholder:text-slate-400"
            />
          </div>
        </div>
        <div className="flex">
          {/* Business Units */}
          <div className="flex-1 border-r border-slate-100 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              Business Units
            </p>
            <div className="space-y-1.5">
              {businessUnits.map((bu) => (
                <label
                  key={bu}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <div
                    onClick={() => toggle(selBU, setSelBU, bu)}
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                      selBU.includes(bu)
                        ? "bg-[#1C4ED8] border-[#1C4ED8]"
                        : "border-slate-300 group-hover:border-[#1C4ED8]"
                    )}
                  >
                    {selBU.includes(bu) && (
                      <Check className="w-2.5 h-2.5 text-white" />
                    )}
                  </div>
                  <span className="text-[13px] text-slate-700">{bu}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Departments */}
          <div className="flex-1 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              Departments
            </p>
            <div className="space-y-1.5">
              {departments.map((dept) => (
                <label
                  key={dept}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <div
                    onClick={() => toggle(selDept, setSelDept, dept)}
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                      selDept.includes(dept)
                        ? "bg-[#1C4ED8] border-[#1C4ED8]"
                        : "border-slate-300 group-hover:border-[#1C4ED8]"
                    )}
                  >
                    {selDept.includes(dept) && (
                      <Check className="w-2.5 h-2.5 text-white" />
                    )}
                  </div>
                  <span className="text-[13px] text-slate-700">{dept}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50">
          <button
            onClick={() => {
              setSelBU([]);
              setSelDept([]);
            }}
            className="text-xs text-slate-500 hover:text-slate-700 font-medium"
          >
            Clear all
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1C4ED8] text-white text-xs font-bold rounded-lg hover:bg-[#1a3eb8]"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </>
  );
}

// ─── FilterDrawer ──────────────────────────────────────────────────────────────
function FilterDrawer({ onClose }: { onClose: () => void }) {
  const [empTypes, setEmpTypes] = useState<string[]>(["Full-time"]);
  const [dept, setDept] = useState("");
  const [locations, setLocations] = useState([
    "San Francisco",
    "New York",
  ]);
  const [newLoc, setNewLoc] = useState("");
  const [tenureRange, setTenureRange] = useState<[number, number]>([0, 10]);

  const toggleEmpType = (t: string) =>
    setEmpTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const addLocation = () => {
    if (newLoc.trim()) {
      setLocations((prev) => [...prev, newLoc.trim()]);
      setNewLoc("");
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/30"
        onClick={onClose}
      />
      <aside className="fixed right-0 top-0 h-full w-[380px] bg-[#F8FAFC] z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Filter Settings
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Refine your directory view
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-7">
          {/* Employment Type */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
              Employment Type
            </p>
            <div className="space-y-2.5">
              {["Full-time", "Contract", "Intern"].map((t) => (
                <label
                  key={t}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div
                    onClick={() => toggleEmpType(t)}
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                      empTypes.includes(t)
                        ? "bg-[#1C4ED8] border-[#1C4ED8]"
                        : "border-slate-300 group-hover:border-[#1C4ED8]"
                    )}
                  >
                    {empTypes.includes(t) && (
                      <Check className="w-2.5 h-2.5 text-white" />
                    )}
                  </div>
                  <span className="text-sm text-slate-700">{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Department */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
              Department
            </p>
            <div className="relative">
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:border-[#1C4ED8] appearance-none"
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
              Location
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {locations.map((loc) => (
                <span
                  key={loc}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#1C4ED8]/10 text-[#1C4ED8] rounded-full text-[12px] font-medium"
                >
                  {loc}
                  <button
                    onClick={() =>
                      setLocations((prev) => prev.filter((l) => l !== loc))
                    }
                    className="text-[#1C4ED8]/60 hover:text-[#1C4ED8]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <span className="flex items-center gap-1 px-3 py-1 border border-dashed border-slate-300 rounded-full text-[12px] text-slate-500 hover:border-[#1C4ED8] hover:text-[#1C4ED8] cursor-pointer transition-colors">
                <Plus className="w-3 h-3" /> Add Location
              </span>
            </div>
          </div>

          {/* Tenure Range */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Tenure Range
              </p>
              <span className="text-[11px] font-bold text-[#1C4ED8] bg-blue-50 px-2 py-0.5 rounded-full">
                {tenureRange[0]}–{tenureRange[1]}+ Years
              </span>
            </div>
            <div className="relative h-1.5 bg-slate-200 rounded-full">
              <div
                className="absolute h-1.5 bg-[#1C4ED8] rounded-full"
                style={{
                  left: `${tenureRange[0] * 10}%`,
                  right: `${100 - tenureRange[1] * 10}%`,
                }}
              />
              <div
                className="absolute -top-1.5 w-3 h-3 rounded-full bg-[#1C4ED8] border-2 border-white shadow cursor-pointer"
                style={{ left: `${tenureRange[0] * 10}%` }}
              />
              <div
                className="absolute -top-1.5 w-3 h-3 rounded-full bg-[#1C4ED8] border-2 border-white shadow cursor-pointer"
                style={{ left: `${tenureRange[1] * 10}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-3">
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500">
                NEW JOINER
              </span>
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500">
                EXPERT
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
          <button
            onClick={() => {
              setEmpTypes([]);
              setDept("");
              setLocations([]);
              setTenureRange([0, 10]);
            }}
            className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-[#1C4ED8] hover:bg-[#1a3eb8] text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── ViewProfileDrawer ──────────────────────────────────────────────────────────────────────────
function ViewProfileDrawer({
  employee,
  onClose,
  onEdit,
}: {
  employee: Employee;
  onClose: () => void;
  onEdit: () => void;
}) {
  const name = `${employee.firstName} ${employee.lastName}`;
  const initials = `${employee.firstName?.[0] ?? ""}${employee.lastName?.[0] ?? ""}`;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/30" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-full w-[480px] bg-white z-50 shadow-2xl flex flex-col overflow-hidden">
        {/* Header buttons */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-[12px] font-semibold text-slate-700 hover:bg-slate-50">
              Edit Profile
            </button>
            <button className="px-3 py-1.5 bg-[#1C4ED8] hover:bg-[#1a3eb8] text-white rounded-lg text-[12px] font-semibold transition-colors">
              Download CV
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Profile Card */}
          <div className="px-6 pb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{name}</h2>
                </div>
                <p className="text-[13px] font-semibold text-[#1C4ED8] mt-0.5">
                  {employee.jobTitle ?? "Senior Technical Architect"}
                </p>
                <div className="flex items-center gap-3 mt-1 text-[12px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Lagos, HQ
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    4.5 Years Tenured
                  </span>
                </div>
                <span className="mt-2 inline-block px-2 py-0.5 bg-[#1C4ED8]/10 text-[#1C4ED8] text-[10px] font-bold rounded-full uppercase tracking-wider">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>

          {/* Recent Performance */}
          <div className="mx-6 p-5 bg-[#F8FAFC] rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                RECENT PERFORMANCE
              </p>
              <span className="px-2.5 py-0.5 bg-[#1C4ED8]/10 text-[#1C4ED8] text-[10px] font-bold rounded-full">
                Exceeds Expectations
              </span>
            </div>
            {/* Bar chart */}
            <div className="flex items-end gap-2 h-24 mb-3">
              {[
                { h: 40, active: false },
                { h: 55, active: false },
                { h: 50, active: false },
                { h: 70, active: false },
                { h: 95, active: true },
              ].map((b, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-t-sm",
                    b.active ? "bg-[#1C4ED8]" : "bg-[#1C4ED8]/20"
                  )}
                  style={{ height: `${b.h}%` }}
                />
              ))}
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed">
              &ldquo;Marcus successfully led the Q3 Infrastructure Migration,
              reducing latency by 42% across core services while maintaining
              99.99% uptime.&rdquo;
            </p>
          </div>

          {/* Employment History + Core Competencies */}
          <div className="px-6 py-6 grid grid-cols-2 gap-6">
            {/* Employment History */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                EMPLOYMENT HISTORY
              </p>
              <div className="space-y-3">
                {[
                  {
                    role: "Senior Technical Architect",
                    period: "Jan 2021 — Present",
                    active: true,
                  },
                  {
                    role: "Systems Engineer IV",
                    period: "May 2019 — Dec 2020",
                    active: false,
                  },
                  {
                    role: "Full Stack Developer",
                    period: "Jan 2018 — Apr 2019",
                    active: false,
                  },
                ].map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="mt-1">
                      <div
                        className={cn(
                          "w-2.5 h-2.5 rounded-full",
                          h.active
                            ? "bg-[#1C4ED8]"
                            : "border-2 border-slate-300"
                        )}
                      />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-slate-900">
                        {h.role}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {h.period}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Competencies */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                CORE COMPETENCIES
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Cloud Architecture",
                  "React & Node.js",
                  "DevOps",
                  "Security Governance",
                  "GraphQL",
                  "Team Leadership",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-[#F8FAFC] text-slate-600 text-[11px] font-medium rounded border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Direct Contact */}
          <div className="px-6 pb-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              DIRECT CONTACT
            </p>
            <div className="space-y-2">
              <a
                href={`mailto:${employee.user?.email ?? employee.email}`}
                className="flex items-center gap-2 text-[13px] text-[#1C4ED8] hover:underline"
              >
                <Mail className="w-3.5 h-3.5" />
                {employee.user?.email ?? employee.email}
              </a>
              <p className="flex items-center gap-2 text-[13px] text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                +1 (415) 555-0192
              </p>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mx-6 mb-6 grid grid-cols-3 divide-x divide-slate-200 border border-slate-100 rounded-xl bg-[#F8FAFC]">
            {[
              { label: "REPORTS", value: "12" },
              { label: "PROJECTS", value: "48" },
              { label: "IMPACT SCORE", value: "9.8" },
            ].map((s) => (
              <div key={s.label} className="px-4 py-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {s.label}
                </p>
                <p className="text-xl font-bold text-[#1C4ED8] mt-1">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── EditEmployeeModal ─────────────────────────────────────────────────────────────────────
const EDIT_TABS = [
  "Basic Info",
  "Job Details",
  "Compensation",
  "Emergency Contacts",
] as const;
type EditTab = (typeof EDIT_TABS)[number];

const EDIT_TAB_ICONS: Record<EditTab, React.ReactNode> = {
  "Basic Info": <User className="w-4 h-4" />,
  "Job Details": <Briefcase className="w-4 h-4" />,
  Compensation: <Wallet className="w-4 h-4" />,
  "Emergency Contacts": <Users className="w-4 h-4" />,
};

function EditEmployeeModal({
  employee,
  onClose,
  onSuccess,
}: {
  employee: Employee;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [activeTab, setActiveTab] = useState<EditTab>("Basic Info");
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      employeeApi.update(employee.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onSuccess();
      onClose();
    },
  });

  const [form, setForm] = useState({
    firstName: employee.firstName ?? "",
    lastName: employee.lastName ?? "",
    email: employee.user?.email ?? employee.email ?? "",
    phone: "+234 012-9984",
    location: "Lagos HQ - Architectural Row",
    bio: "Senior Structural Architect with over 12 years of experience in sustainable urban curation. Lead designer for the Sky Garden Initiative.",
    department: employee.department?.name ?? "",
    jobTitle: employee.jobTitle ?? "",
    employeeId: "EMP-9021",
    designation: "Senior Structural Architect",
    employmentType: "FULL_TIME",
    dateOfJoining: "2026-03-02",
    reportingManager: "Ali Mike",
    salaryBase: "124500",
    housingAllowance: "12000",
    transportAllowance: "4800",
    bankName: "Global Commercial Bank",
    accountNumber: "8821 0049 3321 09",
    swift: "GCB-US-NYC-441-2",
    tin: "990-21-XXXX",
    ecName: "Marco Rodriguez",
    ecRelationship: "Spouse",
    ecPhone: "+1 (555) 293-4852",
    ecEmail: "m.rodriguez@email.com",
    ecAddress: "4822 Vista Del Mar Way, Suite 400, San Francisco, CA 94121",
    ec2Name: "Sofia Chen",
    ec2Relationship: "Friend",
    ec2Phone: "+1 (555) 912-0034",
    ec2Address: "122 Post St, Apartment 9B, San Francisco, CA 94108",
  });

  const f = (key: keyof typeof form) => ({
    value: form[key] as string,
    onChange: (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => setForm((prev) => ({ ...prev, [key]: e.target.value })),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-[720px] bg-white rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Edit Employee Record
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Update details for {employee.firstName} {employee.lastName} ·
              EMP-9021
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-[200px] bg-[#F8FAFC] border-r border-slate-100 flex flex-col">
            <div className="p-4 space-y-1">
              {EDIT_TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-colors text-left",
                    activeTab === t
                      ? "bg-white text-[#1C4ED8] shadow-sm border border-slate-200"
                      : "text-slate-600 hover:bg-white/50"
                  )}
                >
                  {EDIT_TAB_ICONS[t]}
                  {t}
                </button>
              ))}
            </div>
            <div className="mt-auto p-4 space-y-3 border-t border-slate-100">
              <div className="flex items-start gap-2">
                <Pencil className="w-3.5 h-3.5 text-[#1C4ED8] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-500">
                    Last edited 2 days ago by Sarah Femi
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#1C4ED8] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-500">
                    Role History Promoted Oct 2023
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "Basic Info" && (
              <div className="space-y-5">
                {/* Personal Identity */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 text-lg font-bold shrink-0">
                    {`${employee.firstName?.[0] ?? ""}${employee.lastName?.[0] ?? ""}`}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Personal Identity
                    </p>
                    <p className="text-xs text-slate-500">
                      Upload a high-resolution photo for the corporate
                      directory.
                    </p>
                    <button className="text-[12px] font-semibold text-[#1C4ED8] mt-0.5 hover:underline">
                      Replace profile image
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FieldWrap label="First Name">
                    <input {...f("firstName")} className={inputCls} />
                  </FieldWrap>
                  <FieldWrap label="Last Name">
                    <input {...f("lastName")} className={inputCls} />
                  </FieldWrap>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FieldWrap label="Work Email">
                    <input type="email" {...f("email")} className={inputCls} />
                  </FieldWrap>
                  <FieldWrap label="Personal Mobile">
                    <input {...f("phone")} className={inputCls} />
                  </FieldWrap>
                </div>
                <FieldWrap label="Primary Office Location">
                  <div className="relative">
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select {...f("location")} className={inputCls}>
                      <option>Lagos HQ - Architectural Row</option>
                      <option>San Francisco HQ</option>
                      <option>London Office</option>
                    </select>
                  </div>
                </FieldWrap>
                <FieldWrap label="Bio & Specializations">
                  <textarea
                    {...f("bio")}
                    rows={3}
                    className={cn(inputCls, "resize-none")}
                  />
                </FieldWrap>

                {/* Info Box */}
                <div className="flex items-start gap-3 p-3.5 bg-blue-50 rounded-lg">
                  <Info className="w-4 h-4 text-[#1C4ED8] shrink-0 mt-0.5" />
                  <p className="text-[12px] text-[#1C4ED8]">
                    <span className="font-semibold">
                      Identity Verification:
                    </span>{" "}
                    Updating the official legal name will trigger a secondary
                    verification request from the compliance department.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "Job Details" && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-bold shrink-0">
                    {`${employee.firstName?.[0] ?? ""}${employee.lastName?.[0] ?? ""}`}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Job Details
                    </p>
                    <p className="text-xs text-slate-500">
                      Update employment parameters and reporting hierarchy
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FieldWrap label="Employee ID">
                    <input {...f("employeeId")} className={inputCls} />
                  </FieldWrap>
                  <FieldWrap label="Designation">
                    <input {...f("designation")} className={inputCls} />
                  </FieldWrap>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FieldWrap label="Department">
                    <div className="relative">
                      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select {...f("department")} className={inputCls}>
                        <option value="">Select Department</option>
                        {departments.map((d) => (
                          <option key={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </FieldWrap>
                  <FieldWrap label="Employment Type">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                            form.employmentType === "FULL_TIME"
                              ? "border-[#1C4ED8]"
                              : "border-slate-300"
                          )}
                          onClick={() =>
                            setForm((p) => ({
                              ...p,
                              employmentType: "FULL_TIME",
                            }))
                          }
                        >
                          {form.employmentType === "FULL_TIME" && (
                            <div className="w-2 h-2 bg-[#1C4ED8] rounded-full" />
                          )}
                        </div>
                        <span className="text-sm text-slate-700">
                          Full-time
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                            form.employmentType === "CONTRACT"
                              ? "border-[#1C4ED8]"
                              : "border-slate-300"
                          )}
                          onClick={() =>
                            setForm((p) => ({
                              ...p,
                              employmentType: "CONTRACT",
                            }))
                          }
                        >
                          {form.employmentType === "CONTRACT" && (
                            <div className="w-2 h-2 bg-[#1C4ED8] rounded-full" />
                          )}
                        </div>
                        <span className="text-sm text-slate-700">
                          Contract
                        </span>
                      </label>
                    </div>
                  </FieldWrap>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FieldWrap label="Date of Joining">
                    <input type="date" {...f("dateOfJoining")} className={inputCls} />
                  </FieldWrap>
                  <FieldWrap label="Reporting Manager">
                    <input {...f("reportingManager")} className={inputCls} />
                  </FieldWrap>
                </div>
                <FieldWrap label="Internal Notes">
                  <textarea
                    placeholder="Add additional role-specific details..."
                    rows={3}
                    className={cn(inputCls, "resize-none")}
                  />
                </FieldWrap>
              </div>
            )}

            {activeTab === "Compensation" && (
              <div className="space-y-5">
                {/* Salary Details */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      SALARY DETAILS
                    </p>
                    <span className="px-2 py-0.5 bg-[#1C4ED8]/10 text-[#1C4ED8] text-[10px] font-bold rounded-full">
                      MONTHLY PAYOUT
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#F8FAFC] rounded-lg p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        ANNUAL BASE
                      </p>
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        ${form.salaryBase}
                      </p>
                    </div>
                    <div className="bg-[#F8FAFC] rounded-lg p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        HOUSING ALLOWANCE
                      </p>
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        ${form.housingAllowance}
                      </p>
                    </div>
                    <div className="bg-[#F8FAFC] rounded-lg p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        TRANSPORT ALLOWANCE
                      </p>
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        ${form.transportAllowance}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bank Account + Tax */}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                      BANK ACCOUNT INFORMATION
                    </p>
                    <div className="space-y-3">
                      <FieldWrap label="Bank Name">
                        <input {...f("bankName")} className={inputCls} />
                      </FieldWrap>
                      <FieldWrap label="Account Number">
                        <input {...f("accountNumber")} className={inputCls} />
                      </FieldWrap>
                      <FieldWrap label="SWIFT / IBAN">
                        <input {...f("swift")} className={inputCls} />
                      </FieldWrap>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                      TAX & REGULATORY
                    </p>
                    <div className="space-y-3">
                      <FieldWrap label="Tax Identification Number (TIN)">
                        <input {...f("tin")} className={inputCls} />
                      </FieldWrap>
                      <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                        <Info className="w-4 h-4 text-[#1C4ED8] shrink-0 mt-0.5" />
                        <p className="text-[11px] text-[#1C4ED8]">
                          All tax documents are verified against local regional
                          requirements. Updates to TIN require secondary approval.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Salary Adjustments */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                    RECENT SALARY ADJUSTMENTS
                  </p>
                  <div className="border border-slate-100 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-4 gap-4 px-4 py-2 bg-[#F8FAFC] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <div>Effective Date</div>
                      <div>Change Reason</div>
                      <div>Amount Change</div>
                      <div>New Total</div>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {[
                        {
                          date: "Jan 01, 2024",
                          reason: "Annual Performance Review",
                          change: "+$8,500.00",
                          total: "$124,500.00",
                        },
                        {
                          date: "Jun 12, 2023",
                          reason: "Promotion (Mid-Senior)",
                          change: "+$12,000.00",
                          total: "$116,000.00",
                        },
                      ].map((row, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-4 gap-4 px-4 py-3 text-[13px]"
                        >
                          <div className="text-slate-700">{row.date}</div>
                          <div className="text-slate-700">{row.reason}</div>
                          <div className="text-[#1C4ED8] font-semibold">
                            {row.change}
                          </div>
                          <div className="text-slate-900 font-semibold">
                            {row.total}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Emergency Contacts" && (
              <div className="space-y-5">
                {/* Primary Contact */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      PRIMARY CONTACT
                    </p>
                    <span className="px-2 py-0.5 bg-[#1C4ED8]/10 text-[#1C4ED8] text-[10px] font-bold rounded-full">
                      DEFAULT
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FieldWrap label="Full Name">
                      <input {...f("ecName")} className={inputCls} />
                    </FieldWrap>
                    <FieldWrap label="Relationship">
                      <div className="relative">
                        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select {...f("ecRelationship")} className={inputCls}>
                          <option>Spouse</option>
                          <option>Parent</option>
                          <option>Sibling</option>
                          <option>Friend</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </FieldWrap>
                    <FieldWrap label="Phone Number">
                      <input {...f("ecPhone")} className={inputCls} />
                    </FieldWrap>
                    <FieldWrap label="Email Address (Optional)">
                      <input type="email" {...f("ecEmail")} className={inputCls} />
                    </FieldWrap>
                  </div>
                  <FieldWrap label="Residential Address">
                    <input {...f("ecAddress")} className={inputCls} />
                  </FieldWrap>
                </div>

                {/* Secondary Contact */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      SECONDARY CONTACT
                    </p>
                    <button className="flex items-center gap-1 text-[11px] font-semibold text-[#1C4ED8] hover:underline">
                      <X className="w-3 h-3" /> Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FieldWrap label="Full Name">
                      <input {...f("ec2Name")} className={inputCls} />
                    </FieldWrap>
                    <FieldWrap label="Relationship">
                      <div className="relative">
                        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select {...f("ec2Relationship")} className={inputCls}>
                          <option>Friend</option>
                          <option>Spouse</option>
                          <option>Parent</option>
                          <option>Sibling</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </FieldWrap>
                    <FieldWrap label="Phone Number">
                      <input {...f("ec2Phone")} className={inputCls} />
                    </FieldWrap>
                    <FieldWrap label="Residential Address">
                      <input {...f("ec2Address")} className={inputCls} />
                    </FieldWrap>
                  </div>
                </div>

                {/* Add Another */}
                <button className="w-full py-3 border border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-500 hover:border-[#1C4ED8] hover:text-[#1C4ED8] transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add Another Emergency Contact
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-[#F8FAFC]">
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Pencil className="w-3 h-3 text-[#1C4ED8]" /> Last edited 2 days ago by Sarah Femi
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-[#1C4ED8]" /> Role History Promoted Oct 2023
            </span>
          </div>
          <div className="flex gap-3">
            {activeTab === "Job Details" && (
              <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Printer className="w-4 h-4" /> Preview PDF
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                updateMutation.mutate({
                  firstName: form.firstName,
                  lastName: form.lastName,
                  email: form.email,
                  jobTitle: form.jobTitle,
                })
              }
              disabled={updateMutation.isPending}
              className="px-4 py-2 bg-[#1C4ED8] hover:bg-[#1a3eb8] text-white rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DeleteConfirmModal ────────────────────────────────────────────────────────────────
const TERMINATION_REASONS = [
  {
    value: "RESIGNATION",
    label: "Resignation",
    desc: "Employee voluntarily leaving the organisation",
  },
  {
    value: "ON_LEAVE",
    label: "On Leave",
    desc: "Employee on extended or unpaid leave",
  },
  {
    value: "DISCIPLINARY",
    label: "Disciplinary Action",
    desc: "Termination due to policy violation",
  },
] as const;

function DeleteConfirmModal({
  employee,
  onClose,
  onSuccess,
}: {
  employee: Employee;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [reason, setReason] = useState<string>("");
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => employeeApi.delete(employee.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onSuccess();
      onClose();
    },
  });

  const name = `${employee.firstName} ${employee.lastName}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden z-10 p-8 text-center">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>

        <h3 className="text-lg font-bold text-slate-900">
          Delete Employee Record
        </h3>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          Are you sure you want to delete {name}&apos;s record? This action
          will archive all historical data and cannot be undone.
        </p>

        {/* Reason selection */}
        <div className="mt-6 text-left">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">
            REASON FOR TERMINATION
          </p>
          <div className="space-y-2">
            {TERMINATION_REASONS.map(({ value, label }) => (
              <label
                key={value}
                onClick={() => setReason(value)}
                className={cn(
                  "flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all",
                  reason === value
                    ? "border-[#1C4ED8] bg-blue-50"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                    reason === value ? "border-[#1C4ED8]" : "border-slate-300"
                  )}
                >
                  {reason === value && (
                    <div className="w-2 h-2 bg-[#1C4ED8] rounded-full" />
                  )}
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-2">
          <button
            onClick={() => deleteMutation.mutate()}
            disabled={!reason || deleteMutation.isPending}
            className="w-full py-2.5 bg-[#1C4ED8] hover:bg-[#1a3eb8] text-white rounded-lg text-sm font-semibold disabled:opacity-40 transition-colors"
          >
            {deleteMutation.isPending
              ? "Processing..."
              : "Terminate Employee"}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-[#1C4ED8] hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Bottom tag */}
        <p className="mt-4 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
          <Shield className="w-3 h-3 inline mr-1" />
          ADMINISTRATIVE ACTION
        </p>
      </div>
    </div>
  );
}

// ─── AddEmployeeModal ─────────────────────────────────────────────────────────
// Generate a unique, reasonably strong temporary password (>= 8 chars, mixed
// case + digit + symbol) so each created employee gets distinct credentials.
function generateTempPassword(): string {
  const rand = Math.random().toString(36).slice(2, 8);
  const RAND = Math.random().toString(36).slice(2, 6).toUpperCase();
  const num = Math.floor(1000 + Math.random() * 9000);
  return `Hr${RAND}${rand}${num}!`;
}

type AddFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  password: string;
  departmentId: string;
  jobTitle: string;
  employmentType: string;
  salary: string;
  currency: string;
  startDate: string;
  manager: string;
};

const EMPTY: AddFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: "MALE",
  password: "",
  departmentId: "",
  jobTitle: "",
  employmentType: "FULL_TIME",
  salary: "",
  currency: "USD",
  startDate: "",
  manager: "",
};

export function AddEmployeeModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<AddFormData>(EMPTY);
  const queryClient = useQueryClient();

  const { data: realDepartments } = useQuery({
    queryKey: ["departments"],
    queryFn: () => departmentApi.getAll(),
    retry: false,
  });

  // Captures what was submitted so the success screen can confirm the details
  // (and surface the generated temp password) instead of closing silently.
  const [created, setCreated] = useState<{
    name: string;
    email: string;
    password: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => employeeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onSuccess();
      // Keep the modal open and show a success confirmation instead of closing.
    },
  });

  if (!isOpen) return null;

  const reset = () => {
    setStep(1);
    setForm(EMPTY);
    setCreated(null);
    setCopied(false);
    mutation.reset();
    onClose();
  };

  const f = (key: keyof AddFormData) => ({
    value: form[key],
    onChange: (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => setForm((p) => ({ ...p, [key]: e.target.value })),
  });

  const handleNext = () => {
    if (step < 3) {
      setStep((p) => (p + 1) as 1 | 2 | 3);
      return;
    }
    // Use the admin-supplied password, or generate a unique temporary one so we
    // never ship a shared/predictable credential. The employee resets it later.
    const password = form.password.trim() || generateTempPassword();
    // Build a payload matching the backend CreateEmployeeRequest schema.
    const payload: Record<string, unknown> = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password,
      gender: form.gender,
      employmentType: form.employmentType,
      dateOfBirth: new Date("1990-01-01").toISOString(),
    };
    if (form.phone) payload.phone = form.phone;
    if (form.jobTitle) payload.jobTitle = form.jobTitle;
    // Only send departmentId when a real department UUID was selected.
    if (form.departmentId) payload.departmentId = form.departmentId;
    setCreated({
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      password,
    });
    mutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={reset} />
      {mutation.isSuccess && created ? (
        <div className="relative z-10 w-full max-w-[460px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="size-8 text-green-600" />
          </div>
          <h2 className="mt-4 font-heading text-[20px] font-bold text-slate-900">
            Employee created
          </h2>
          <p className="mt-1 text-[14px] text-slate-500">
            <span className="font-semibold text-slate-700">{created.name}</span> has
            been added to your workforce in the backend.
          </p>

          <div className="mt-6 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 text-left">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <KeyRound className="size-3.5" /> Login credentials
            </div>
            <div className="mt-3 space-y-2 text-[13px]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Email</span>
                <span className="font-medium text-slate-800 truncate">{created.email}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Temp password</span>
                <span className="font-mono font-medium text-slate-800">{created.password}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard
                  ?.writeText(`Email: ${created.email}\nPassword: ${created.password}`)
                  .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  })
                  .catch(() => {});
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50"
            >
              {copied ? (
                <>
                  <Check className="size-4 text-green-600" /> Copied
                </>
              ) : (
                <>
                  <Copy className="size-4" /> Copy credentials
                </>
              )}
            </button>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
              Share these with the new employee so they can sign in and reset their password.
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setForm(EMPTY);
                setCreated(null);
                setCopied(false);
                mutation.reset();
              }}
              className="flex-1 rounded-lg border border-slate-200 py-2.5 text-[13px] font-semibold text-slate-700 hover:bg-slate-50"
            >
              Add another
            </button>
            <button
              type="button"
              onClick={reset}
              className="flex-1 rounded-lg bg-[#1C4ED8] py-2.5 text-[13px] font-semibold text-white hover:bg-[#1a3eb8]"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
      <div className="relative w-full max-w-[860px] bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row min-h-[580px] border border-slate-100 z-10 overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-[260px] bg-[#F8FAFC] border-r border-slate-100 p-6 flex flex-col gap-8 shrink-0">
          <div className="space-y-8">
            <div>
              <h2 className="text-base font-bold text-[#1E3A8A]">
                360DegreesHR
              </h2>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                Onboarding System
              </p>
            </div>
            <div className="relative flex flex-col gap-6 pl-2">
              <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-slate-200" />
              {(
                [
                  [1, "Personal Info"],
                  [2, "Job Details"],
                  [3, "Payroll & Benefits"],
                ] as [number, string][]
              ).map(([s, label]) => (
                <div key={s} className="relative flex items-center gap-3">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center z-10 transition-all border-2",
                      step === s
                        ? "bg-white border-[#1C4ED8] ring-4 ring-blue-50"
                        : step > s
                          ? "bg-[#1C4ED8] border-[#1C4ED8]"
                          : "bg-slate-200 border-slate-200"
                    )}
                  >
                    {step > s && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                    {step === s && (
                      <div className="w-1.5 h-1.5 bg-[#1C4ED8] rounded-full" />
                    )}
                  </div>
                  <div>
                    <p
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wide leading-none",
                        step === s ? "text-[#1C4ED8]" : "text-slate-400"
                      )}
                    >
                      STEP 0{s}
                    </p>
                    <p
                      className={cn(
                        "text-xs mt-0.5",
                        step === s
                          ? "font-bold text-[#1E3A8A]"
                          : "font-semibold text-slate-500"
                      )}
                    >
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer avatar */}
          <div className="mt-auto flex items-center gap-3 pt-4 border-t border-slate-100">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-[10px] font-bold">
              AL
            </div>
            <div>
              <p className="text-[12px] font-semibold text-slate-900">
                Alex Lawai
              </p>
              <p className="text-[10px] text-slate-500">
                HR Administrator
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="px-8 py-6 border-b border-slate-100 relative">
            <button
              onClick={reset}
              className="absolute right-6 top-6 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-slate-900">
              {step === 1
                ? "Personal Information"
                : step === 2
                  ? "Job Details"
                  : "Financial Payroll & Perks"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {step === 1
                ? "Basic employee identification details"
                : step === 2
                  ? "Define the organizational structure and role for the new team member."
                  : "Set compensation and benefits"}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FieldWrap label="First Name">
                    <input
                      {...f("firstName")}
                      placeholder="Marcus"
                      className={inputCls}
                    />
                  </FieldWrap>
                  <FieldWrap label="Last Name">
                    <input
                      {...f("lastName")}
                      placeholder="Chen"
                      className={inputCls}
                    />
                  </FieldWrap>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FieldWrap label="Corporate Email">
                    <input
                      type="email"
                      {...f("email")}
                      placeholder="m.chen@360hr.com"
                      className={inputCls}
                    />
                  </FieldWrap>
                  <FieldWrap label="Mobile Number">
                    <input
                      {...f("phone")}
                      placeholder="+234 800 000 0000"
                      className={inputCls}
                    />
                  </FieldWrap>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FieldWrap label="Gender">
                    <div className="relative">
                      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select {...f("gender")} className={inputCls}>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </select>
                    </div>
                  </FieldWrap>
                  <FieldWrap label="Temporary Password">
                    <input
                      type="text"
                      {...f("password")}
                      placeholder="Auto-generated if left blank"
                      className={inputCls}
                    />
                  </FieldWrap>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FieldWrap label="Department">
                    <div className="relative">
                      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select {...f("departmentId")} className={inputCls}>
                        <option value="">Select Department</option>
                        {(realDepartments ?? []).map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </FieldWrap>
                  <FieldWrap label="Role / Title">
                    <input
                      {...f("jobTitle")}
                      placeholder="e.g. Senior UX Architect"
                      className={inputCls}
                    />
                  </FieldWrap>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FieldWrap label="Direct Manager">
                    <div className="flex items-center gap-2.5 px-3 py-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-slate-300">
                      <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        JS
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-[13px] font-semibold text-slate-800">Jordan Smith</p>
                        <p className="text-[10px] text-slate-400">Head of Design</p>
                      </div>
                      <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </FieldWrap>
                  <FieldWrap label="Start Date">
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="date"
                        {...f("startDate")}
                        className={inputCls}
                      />
                    </div>
                  </FieldWrap>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Employment Type
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        value: "FULL_TIME",
                        label: "Full-Time",
                        Icon: Briefcase,
                        desc: "Permanent",
                      },
                      {
                        value: "CONTRACT",
                        label: "Contract",
                        Icon: Timer,
                        desc: "Fixed Term",
                      },
                      {
                        value: "INTERN",
                        label: "Intern",
                        Icon: GraduationCap,
                        desc: "Learning",
                      },
                    ].map(({ value, label, Icon, desc }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setForm((p) => ({ ...p, employmentType: value }))
                        }
                        className={cn(
                          "flex flex-col items-center gap-1.5 p-4 rounded-xl border transition-all",
                          form.employmentType === value
                            ? "border-[#1C4ED8] bg-blue-50 text-[#1C4ED8]"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-bold">{label}</span>
                        <span className="text-[10px] opacity-70">
                          {desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-blue-50 rounded-t-lg border border-blue-100 border-b-0">
                    <Info className="w-3.5 h-3.5 text-[#1C4ED8] shrink-0" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#1C4ED8]">Internal Context</p>
                  </div>
                  <textarea
                    placeholder="Mention specific equipment needs or specialized onboarding requirements..."
                    rows={3}
                    className={cn(inputCls, "resize-none rounded-t-none border-blue-100")}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FieldWrap label="Base Salary">
                    <input
                      type="number"
                      {...f("salary")}
                      placeholder="85000"
                      className={inputCls}
                    />
                  </FieldWrap>
                  <FieldWrap label="Currency">
                    <div className="relative">
                      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select {...f("currency")} className={inputCls}>
                        <option value="USD">USD ($)</option>
                        <option value="NGN">NGN (₦)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                  </FieldWrap>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                      Ready for Provisioning
                    </p>
                    <p className="text-xs text-amber-700 mt-0.5 leading-normal">
                      Submitting will create the workforce record in the
                      system.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {mutation.isError && (
            <div className="mx-8 mb-1 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-500" />
              <p className="text-[13px] text-red-700">
                Couldn&apos;t create employee: {toUserMessage(mutation.error)}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100">
            <button
              onClick={() =>
                setStep((p) => Math.max(1, p - 1) as 1 | 2 | 3)
              }
              disabled={step === 1}
              className="flex items-center gap-1.5 text-[13px] font-bold text-[#1C4ED8] hover:text-[#1a3eb8] disabled:opacity-30"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={reset}
                className="px-4 py-2 text-[13px] font-bold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              {step === 2 && (
                <button className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-700 hover:bg-slate-50">
                  Save Draft
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={mutation.isPending}
                className="flex items-center gap-1.5 bg-[#1C4ED8] hover:bg-[#1a3eb8] text-white px-5 py-2 rounded-lg text-[13px] font-bold disabled:opacity-50"
              >
                {step === 3 ? (
                  mutation.isPending ? (
                    "Creating..."
                  ) : (
                    "Create Employee"
                  )
                ) : (
                  <>
                    Next Phase <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

// ─── Shared UI Helpers ────────────────────────────────────────────────────────────────────
const inputCls =
  "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-[#1C4ED8] focus:ring-1 focus:ring-[#1C4ED8]/20";

function FieldWrap({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Bulk Upload Modal ─────────────────────────────────────────────────────────────
function BulkUploadModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const mutation = useMutation({
    mutationFn: (f: File) => employeeApi.bulkUpload(f),
    onSuccess: (data) => {
      onSuccess();
      alert(
        `Upload complete! ${data.successful} of ${data.totalRows} employees imported. ${data.failed} failed.`,
      );
      onClose();
    },
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-slate-100 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-bold text-slate-900">Bulk Upload</h2>
          <button onClick={onClose} className="p-1 rounded-md text-slate-500 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-6 text-center transition-colors",
            drag ? "border-[#1C4ED8] bg-blue-50" : "border-slate-200 bg-slate-50",
          )}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            const f = e.dataTransfer.files[0];
            if (f) setFile(f);
          }}
        >
          <FileSpreadsheet className="w-8 h-8 mx-auto text-slate-400 mb-2" />
          <p className="text-[13px] text-slate-600">
            Drag & drop an Excel file here, or{" "}
            <label className="text-[#1C4ED8] font-medium cursor-pointer">
              browse
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setFile(f);
                }}
              />
            </label>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Columns: firstName, lastName, email, gender (optional: phone, jobTitle, departmentId)
          </p>
        </div>
        {file && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <FileText className="w-4 h-4 text-slate-500" />
            <span className="text-[13px] text-slate-700 flex-1 truncate">{file.name}</span>
            <span className="text-[11px] text-slate-400">{Math.round(file.size / 1024)} KB</span>
          </div>
        )}
        {mutation.isError && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
            <p className="text-[13px] text-red-700">{toUserMessage(mutation.error)}</p>
          </div>
        )}
        <div className="mt-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={() => {
              if (file) mutation.mutate(file);
            }}
            disabled={!file || mutation.isPending}
            className="flex-1 py-2.5 bg-[#1C4ED8] hover:bg-[#1a3eb8] text-white rounded-lg text-[13px] font-semibold disabled:opacity-50"
          >
            {mutation.isPending ? "Uploading..." : "Upload Spreadsheet"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Document Upload Modal ─────────────────────────────────────────────────────────────
function DocumentUploadModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [drag, setDrag] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-slate-100 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-bold text-slate-900">Upload Document</h2>
          <button onClick={onClose} className="p-1 rounded-md text-slate-500 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Document Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className={inputCls}
            >
              <option value="">Select type</option>
              <option value="NYSC">NYSC Certificate</option>
              <option value="LOM">Letter of Recommendation</option>
              <option value="CV">Resume / CV</option>
              <option value="ID">Government ID</option>
              <option value="DEGREE">Degree Certificate</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Employee ID (optional)</label>
            <input
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Paste employee ID or leave empty"
              className={inputCls}
            />
          </div>
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-5 text-center transition-colors",
              drag ? "border-[#1C4ED8] bg-blue-50" : "border-slate-200 bg-slate-50",
            )}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              const f = e.dataTransfer.files[0];
              if (f) setFile(f);
            }}
          >
            <Upload className="w-7 h-7 mx-auto text-slate-400 mb-1" />
            <p className="text-[13px] text-slate-600">
              Drag & drop, or{" "}
              <label className="text-[#1C4ED8] font-medium cursor-pointer">
                browse
                <input type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
              </label>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">PDF, JPG, PNG (max 5MB)</p>
          </div>
          {file && (
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <span className="text-[13px] text-slate-700 flex-1 truncate">{file.name}</span>
              <span className="text-[11px] text-slate-400">{Math.round(file.size / 1024)} KB</span>
            </div>
          )}
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
            <p className="text-[12px] text-amber-800">
              Document storage endpoint is not available on the backend yet. The file will be stored locally for now.
            </p>
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={() => { onSuccess(); onClose(); }}
            disabled={!file || !docType}
            className="flex-1 py-2.5 bg-[#1C4ED8] hover:bg-[#1a3eb8] text-white rounded-lg text-[13px] font-semibold disabled:opacity-50"
          >
            Upload Document
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Open Employee Record Modal ─────────────────────────────────────────────────────────────
function OpenRecordModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [id, setId] = useState("");
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!id.trim()) return;
    setLoading(true);
    setError(null);
    setEmployee(null);
    try {
      const emp = await employeeApi.getById(id.trim());
      setEmployee(emp);
    } catch (e) {
      setError(toUserMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-slate-100 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-bold text-slate-900">Open Employee Record</h2>
          <button onClick={onClose} className="p-1 rounded-md text-slate-500 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Employee ID</label>
            <div className="flex gap-2">
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter employee ID..."
                className={cn(inputCls, "flex-1")}
              />
              <button
                onClick={handleSearch}
                disabled={loading || !id.trim()}
                className="px-4 py-2 bg-[#1C4ED8] hover:bg-[#1a3eb8] text-white rounded-lg text-[13px] font-semibold disabled:opacity-50"
              >
                {loading ? "Loading..." : "Search"}
              </button>
            </div>
          </div>
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
              <p className="text-[13px] text-red-700">{error}</p>
            </div>
          )}
          {employee && (
            <div className="rounded-xl border border-slate-200 p-4 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-[12px] font-bold">
                  {(employee.firstName?.[0] ?? "") + (employee.lastName?.[0] ?? "")}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-slate-900">
                    {employee.firstName} {employee.lastName}
                  </p>
                  <p className="text-[12px] text-slate-500">{employee.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[13px]">
                <div>
                  <span className="text-slate-500">Department:</span>{" "}
                  <span className="font-medium text-slate-800">{employee.department?.name ?? "—"}</span>
                </div>
                <div>
                  <span className="text-slate-500">Role:</span>{" "}
                  <span className="font-medium text-slate-800">{employee.jobTitle ?? "—"}</span>
                </div>
                <div>
                  <span className="text-slate-500">Status:</span>{" "}
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold",
                    employee.employmentStatus === "ACTIVE" ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-600",
                  )}>
                    {employee.employmentStatus ?? "Unknown"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Type:</span>{" "}
                  <span className="font-medium text-slate-800">{employee.employmentType ?? "—"}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="w-full py-2 bg-[#1C4ED8] hover:bg-[#1a3eb8] text-white rounded-lg text-[13px] font-semibold"
              >
                View Full Profile
              </button>
            </div>
          )}
          {!employee && !error && !loading && (
            <div className="text-center text-[13px] text-slate-400 py-6">
              <User className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              Enter an employee ID and click Search to find a record.
            </div>
          )}
        </div>
        <div className="mt-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-700 hover:bg-slate-50">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
