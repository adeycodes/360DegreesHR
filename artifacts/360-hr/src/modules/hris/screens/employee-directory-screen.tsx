"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  Download,
  Eye,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
  AlertTriangle,
  User,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { employeeApi } from "@/lib/api";

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

const businessUnits = ["Product & Eng", "Growth & Mktg", "Operations", "Human Resources", "Finance & Legal"];
const departments = ["Engineering", "Design & UX", "Product Mgmt", "Data Science", "DevOps", "Security"];

interface EmployeeDirectoryScreenProps {
  employees: any[];
  pagination: any;
  isLoading: boolean;
  error: string | null;
  onPageChange: (page: number) => void;
  onSearch: (search: string) => void;
  onRefresh: () => void;
}

export function EmployeeDirectoryScreen({
  employees,
  pagination,
  isLoading,
  error,
  onPageChange,
  onSearch,
  onRefresh
}: EmployeeDirectoryScreenProps) {
  const [openFilter, setOpenFilter] = useState(false);
  const [openDeptPopover, setOpenDeptPopover] = useState(false);
  const [openAddWizard, setOpenAddWizard] = useState(false);

  const [viewEmployee, setViewEmployee] = useState<any>(null);
  const [editEmployee, setEditEmployee] = useState<any>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<any>(null);

  const totalRecords = pagination?.total || 128;
  const currentPage = pagination?.page || 1;
  console.log(employees);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">Employee Directory</h1>
          <p className="text-sm text-slate-500 mt-1">{totalRecords} active workforce records</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300">
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            onClick={() => setOpenAddWizard(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1C4ED8] hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
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

      {/* Main Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Left Column: Table & Filters */}
        <div className="flex-1 space-y-6 min-w-0">

          {/* Search + filters bar */}
          <div className="space-y-4">

            {/* FIXED: Removed w-full and gap-8 from buttons so they stay compact */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <div className="relative w-full lg:flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  placeholder="Search by name, ID, or email..."
                  onChange={(e) => onSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                <div className="relative shrink-0">
                  <button
                    onClick={() => setOpenDeptPopover((v) => !v)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50/50 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                  >
                    Business Unit <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                  {openDeptPopover && <DeptPopover onClose={() => setOpenDeptPopover(false)} />}
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-50/50 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 shrink-0">
                  Team / Dept <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => setOpenFilter(true)}
                  className="p-2 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 shrink-0"
                  aria-label="Advanced filters"
                >
                  <SlidersHorizontal className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-4 text-sm">
              <label className="flex items-center gap-2 text-slate-700 text-[13px] font-medium cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" /> Active Only
              </label>
              <label className="flex items-center gap-2 text-slate-700 text-[13px] font-medium cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" /> Remote Only
              </label>

              <div className="hidden sm:block w-px h-4 bg-slate-200 mx-1" />

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Employment:</span>
                {["Contract", "Intern", "Terminated"].map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full border border-slate-200 bg-white text-[12px] font-medium text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
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
                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading directory...</td></tr>
                  ) : employees.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">No employees found.</td></tr>
                  ) : (
                    employees.map((e: any) => {
                      const isActive = e.employmentStatus === "ACTIVE";
                      return (
                        <tr key={e.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                                <User className="w-5 h-5 text-slate-300" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[14px] font-medium text-slate-900 truncate">{e.firstName} {e.lastName}</div>
                                <div className="text-[12px] text-slate-500 truncate">{e.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[12px] font-bold text-blue-600/90 tracking-wide uppercase">
                              {e.department?.name || "ENGINEERING"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[14px] text-slate-600">
                              {e.jobTitle || "Senior Developer"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase",
                              isActive ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"
                            )}>
                              <span className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-blue-600" : "bg-slate-400")} />
                              {e.employmentStatus || "ACTIVE"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3 text-slate-400">
                              <button onClick={() => setViewEmployee(e)} className="hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 rounded-md" aria-label="View">
                                <Eye className="w-[18px] h-[18px]" />
                              </button>
                              <button onClick={() => setEditEmployee(e)} className="hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 rounded-md" aria-label="Edit">
                                <Pencil className="w-[18px] h-[18px]" />
                              </button>
                              <button onClick={() => setDeleteEmployee(e)} className="hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 rounded-md" aria-label="Delete">
                                <Trash2 className="w-[18px] h-[18px]" />
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

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white border-t border-slate-100 gap-4">
              <span className="text-[13px] text-slate-500">
                Showing 1-10 of {totalRecords} employees
              </span>

              <div className="flex items-center gap-1 text-[13px] font-medium text-slate-600">
                <button
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-md disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                >
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>

                <button className="w-8 h-8 flex items-center justify-center bg-[#1C4ED8] text-white rounded-md">1</button>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-md">2</button>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-md">3</button>
                <span className="w-8 h-8 flex items-center justify-center text-slate-400">...</span>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-md">13</button>

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={isLoading}
                  className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-md disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                >
                  <ChevronDown className="w-4 h-4 -rotate-90" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Rail Metrics (Sidebar) */}
        <aside className="w-full lg:w-[280px] shrink-0 space-y-6">
          <MetricCard label="RETENTION RATE" value="94.2%" trend="+2%" />
          <div className="h-px w-full bg-slate-100" />
          <MetricCard label="OPEN ROLES" value="12" trend="Hiring Active" trendTone="muted" />
          <div className="h-px w-full bg-slate-100" />

          <div className="pt-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">HEALTH INDEX</div>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-[32px] leading-none font-medium text-slate-800">4.8</span>
              <div className="flex text-[#1C4ED8]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {openFilter && <FilterDrawer onClose={() => setOpenFilter(false)} />}
      {viewEmployee && <ViewProfileDrawer employee={viewEmployee} onClose={() => setViewEmployee(null)} onEdit={() => { setViewEmployee(null); setEditEmployee(viewEmployee); }} />}
      {editEmployee && <EditEmployeeModal employee={editEmployee} onClose={() => setEditEmployee(null)} onSuccess={onRefresh} />}
      {deleteEmployee && <DeleteConfirmModal employee={deleteEmployee} onClose={() => setDeleteEmployee(null)} onSuccess={onRefresh} />}
      <AddEmployeeModal isOpen={openAddWizard} onClose={() => setOpenAddWizard(false)} onSuccess={onRefresh} />
    </div>
  );
}

// =========================================================================
// DECOUPLED SUB-COMPONENTS
// =========================================================================

function MetricCard({ label, value, trend, trendTone = "positive" }: { label: string; value: string; trend: string; trendTone?: "positive" | "muted" }) {
  return (
    <div className="pt-2">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="flex items-end gap-3 mt-3">
        <span className="text-[32px] leading-none font-medium text-slate-800">{value}</span>
        <span className={cn("text-[12px] font-semibold mb-1", trendTone === "positive" ? "text-[#1C4ED8]" : "text-slate-400 font-medium")}>
          {trendTone === "positive" && "↗ "}{trend}
        </span>
      </div>
    </div>
  );
}

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function AddEmployeeModal({ isOpen, onClose, onSuccess }: AddEmployeeModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", gender: "MALE",
    jobTitle: "", departmentId: "", employmentType: "FULL_TIME",
    salary: "", currency: "USD"
  });

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: (data: any) => employeeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onSuccess();
      handleClose();
    }
  });

  if (!isOpen) return null;

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({ firstName: "", lastName: "", email: "", phone: "", gender: "MALE", jobTitle: "", departmentId: "", employmentType: "FULL_TIME", salary: "", currency: "USD" });
    onClose();
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3);
    } else {
      createMutation.mutate({
        ...formData,
        password: "DefaultPassword123!",
        dateOfBirth: new Date("1990-01-01").toISOString(),
        hireDate: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={handleClose} />
      <div className="relative w-full max-w-[860px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-slate-100 z-10">
        <div className="w-full md:w-[260px] bg-[#F8FAFC] border-r border-slate-100 p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-bold text-[#1E3A8A] tracking-tight">360DegreesHR</h2>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Onboarding System</p>
            </div>
            <div className="relative flex flex-col gap-6 pl-2">
              <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-slate-200" />
              {[1, 2, 3].map((step) => (
                <div key={step} className="relative flex items-center gap-3">
                  <div className={cn("w-4 h-4 rounded-full flex items-center justify-center z-10 transition-all", currentStep === step ? "bg-white border-2 border-blue-600 ring-4 ring-blue-50" : currentStep > step ? "bg-blue-600 border-2 border-blue-600" : "bg-slate-200 border-2 border-slate-200")}>
                    {currentStep > step && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    {currentStep === step && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                  </div>
                  <div>
                    <p className={cn("text-[10px] font-bold uppercase tracking-wide leading-none", currentStep === step ? "text-blue-600" : "text-slate-400")}>Step 0{step}</p>
                    <p className={cn("text-xs mt-0.5", currentStep === step ? "font-bold text-blue-900" : "font-semibold text-slate-500")}>
                      {step === 1 ? "Personal Info" : step === 2 ? "Job Details" : "Payroll & Benefits"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between bg-white">
          <div className="p-6 md:p-8 border-b border-slate-50 relative">
            <button onClick={handleClose} className="absolute right-6 top-6 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-slate-900">
              {currentStep === 1 && "Personal Information"}
              {currentStep === 2 && "Job Assignment Framework"}
              {currentStep === 3 && "Financial Payroll & Perks"}
            </h3>
          </div>

          <div className="p-6 md:p-8 flex-1 space-y-5 overflow-y-auto max-h-[calc(90vh-160px)]">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">First Name</label>
                    <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} placeholder="Marcus" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Last Name</label>
                    <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} placeholder="Chen" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Corporate Email</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="m.chen@360hr.com" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Mobile Number</label>
                    <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+234..." className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Department ID (UUID)</label>
                    <input type="text" value={formData.departmentId} onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })} placeholder="e.g. 7e1f9d..." className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Official Role Title</label>
                    <input type="text" value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} placeholder="Lead Architect" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employment Classification</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["FULL_TIME", "CONTRACT", "INTERN"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, employmentType: type })}
                        className={cn("flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500", formData.employmentType === type ? "border-blue-600 bg-blue-50 text-blue-600 ring-1 ring-blue-600" : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100")}
                      >
                        <span className="text-xs font-bold">{type.replace("_", " ")}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Base Salary Value</label>
                    <input type="number" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} placeholder="85000" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Currency</label>
                    <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="USD">USD ($)</option>
                      <option value="NGN">NGN (₦)</option>
                    </select>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">Ready for Provisioning</p>
                    <p className="text-xs text-amber-700 mt-0.5 leading-normal">Submitting will execute the API POST request to save the workforce record.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 md:px-8 md:py-5 bg-white border-t border-slate-100 flex items-center justify-between">
            <button type="button" onClick={() => setCurrentStep(p => Math.max(1, p - 1) as 1 | 2 | 3)} disabled={currentStep === 1} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-30">
              <ArrowLeft className="w-3.5 h-3.5" /> Back Step
            </button>
            <div className="flex items-center gap-3">
              <button type="button" onClick={handleClose} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button type="button" onClick={handleNext} disabled={createMutation.isPending} className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold disabled:opacity-50">
                {createMutation.isPending ? "Processing..." : currentStep === 3 ? "Complete Registration" : "Next Phase"}
                {!createMutation.isPending && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeptPopover({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<string[]>(["Engineering"]);
  return (
    <div className="absolute top-full left-0 sm:right-0 sm:left-auto mt-2 w-[320px] sm:w-[480px] bg-white border border-slate-200 rounded-xl shadow-xl z-50">
      <div className="p-4 border-b border-slate-100">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Search units or departments..." className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 max-h-72">
        <ul className="border-b sm:border-b-0 sm:border-r border-slate-100 py-2 overflow-y-auto">
          {businessUnits.map((u, i) => (
            <li key={u}>
              <button onClick={() => setActive(i)} className={cn("w-full text-left px-4 py-2.5 text-sm", active === i ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700 hover:bg-slate-50")}>
                {u}
              </button>
            </li>
          ))}
        </ul>
        <div className="py-2 overflow-y-auto">
          <div className="px-4 py-2 text-xs uppercase tracking-wider text-slate-400">Departments</div>
          {departments.map((d) => (
            <label key={d} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" checked={selected.includes(d)} onChange={(e) => setSelected((prev) => e.target.checked ? [...prev, d] : prev.filter((x) => x !== d))} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              {d}
            </label>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between p-4 border-t border-slate-100">
        <button onClick={() => setSelected([])} className="text-sm font-medium text-slate-600 hover:text-slate-900">Clear All</button>
        <button onClick={onClose} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Apply Filter</button>
      </div>
    </div>
  );
}

function FilterDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-[440px] bg-white shadow-2xl flex flex-col">
        <header className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Filter Settings</h2>
            <p className="text-sm text-slate-500 mt-1">Refine your directory view</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </header>
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section>
            <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-3">Employment Type</h3>
            <div className="space-y-2">
              {[{ label: "Full-time", checked: true }, { label: "Contract", checked: false }, { label: "Intern", checked: false }].map((o) => (
                <label key={o.label} className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" defaultChecked={o.checked} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" /> {o.label}
                </label>
              ))}
            </div>
          </section>
        </div>
        <footer className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <button className="text-sm font-medium text-slate-700 hover:text-slate-900">Reset</button>
          <button onClick={onClose} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Apply Filters</button>
        </footer>
      </aside>
    </div>
  );
}

function ViewProfileDrawer({ employee, onClose, onEdit }: { employee: any; onClose: () => void; onEdit: () => void }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-[560px] bg-white shadow-2xl flex flex-col">
        <header className="p-6 flex items-center justify-between">
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
          <div className="flex items-center gap-2">
            <button onClick={onEdit} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Edit Profile</button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Download CV</button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-xl bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-700">
                {employee.firstName?.[0]}{employee.lastName?.[0]}
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-semibold tracking-wider uppercase">
                {employee.employmentStatus || "ACTIVE"}
              </span>
            </div>
            <div className="pt-1">
              <h2 className="text-2xl font-semibold text-slate-900">{employee.firstName} {employee.lastName}</h2>
              <p className="text-blue-600 font-medium">{employee.jobTitle || "No title set"}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> Dept: {employee.department?.name || "N/A"}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-slate-500 mt-6 mb-3">Direct Contact</h3>
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> {employee.email}</div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /> {employee.phone || "No phone provided"}</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function EditEmployeeModal({ employee, onClose, onSuccess }: { employee: any; onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    firstName: employee.firstName || "",
    lastName: employee.lastName || "",
    jobTitle: employee.jobTitle || "",
    employmentStatus: employee.employmentStatus || "ACTIVE"
  });

  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: (data: any) => employeeApi.update(employee.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onSuccess();
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row">
        <div className="flex-1 overflow-y-auto flex flex-col sm:flex-row">
          <nav className="w-full sm:w-56 bg-slate-50 p-4 space-y-1 border-b sm:border-b-0 sm:border-r border-slate-100">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm bg-white text-blue-600 font-medium shadow-sm">
              <User className="w-4 h-4" /> Basic Info
            </button>
          </nav>
          <div className="flex-1 flex flex-col min-w-0">
            <header className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Edit Employee Record</h2>
                <p className="text-sm text-slate-500 mt-1">Update details for {employee.firstName} {employee.lastName}</p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </header>
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">First Name</label>
                  <input value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Last Name</label>
                  <input value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Job Title</label>
                  <input value={formData.jobTitle} onChange={e => setFormData({ ...formData, jobTitle: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Status</label>
                  <select value={formData.employmentStatus} onChange={e => setFormData({ ...formData, employmentStatus: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="ACTIVE">Active</option>
                    <option value="TERMINATED">Terminated</option>
                  </select>
                </div>
              </div>
            </div>
            <footer className="p-6 border-t border-slate-100 flex items-center justify-end bg-slate-50">
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900">Cancel</button>
                <button
                  onClick={() => updateMutation.mutate(formData)}
                  disabled={updateMutation.isPending}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ employee, onClose, onSuccess }: { employee: any; onClose: () => void; onSuccess: () => void }) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: string) => employeeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onSuccess();
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center z-10">
        <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Delete Employee Record</h3>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          Are you sure you want to delete <strong>{employee.firstName} {employee.lastName}'s</strong> record? This action will archive all historical data and cannot be undone.
        </p>
        <div className="mt-6 space-y-2">
          <button
            onClick={() => deleteMutation.mutate(employee.id)}
            disabled={deleteMutation.isPending}
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-50"
          >
            {deleteMutation.isPending ? "Processing..." : "Confirm Delete"}
          </button>
          <button onClick={onClose} className="w-full py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors bg-white">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}