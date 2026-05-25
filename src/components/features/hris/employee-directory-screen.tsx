"use client";

import { useState } from "react";
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
  Clock,
  User,
  Briefcase,
  DollarSign,
  Users as UsersIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

// ---------- mock data ----------
const employees = Array.from({ length: 3 }).map((_, i) => ({
  id: `EMP-902${i + 1}`,
  name: "Marcus Chen",
  email: "m.chen@360hr.com",
  department: "ENGINEERING",
  role: "Senior Developer",
  status: "Active" as const,
  avatar: "/avatars/marcus.jpg",
}));

const businessUnits = ["Product & Eng", "Growth & Mktg", "Operations", "Human Resources", "Finance & Legal"];
const departments = ["Engineering", "Design & UX", "Product Mgmt", "Data Science", "DevOps", "Security"];

// ---------- main screen ----------
export function EmployeeDirectoryScreen() {
  const [openFilter, setOpenFilter] = useState(false);
  const [openDeptPopover, setOpenDeptPopover] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-grey-900">Employee Directory</h1>
          <p className="text-sm text-grey-500 mt-1">128 active workforce records</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-grey-200 rounded-lg text-sm font-medium text-grey-700 hover:bg-grey-50">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" /> Add Employee
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main column */}
        <div className="col-span-12 lg:col-span-9 space-y-4">
          {/* Search + filters bar */}
          <div className="bg-white border border-grey-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-grey-400" />
                <input
                  placeholder="Search by name, ID, or email..."
                  className="w-full pl-10 pr-3 py-2.5 bg-grey-50 border border-grey-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setOpenDeptPopover((v) => !v)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-grey-200 rounded-lg text-sm text-grey-700 hover:bg-grey-50"
                >
                  Business Unit <ChevronDown className="w-4 h-4" />
                </button>
                {openDeptPopover && <DeptPopover onClose={() => setOpenDeptPopover(false)} />}
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-grey-200 rounded-lg text-sm text-grey-700 hover:bg-grey-50">
                Team / Dept <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => setOpenFilter(true)}
                className="p-2.5 border border-grey-200 rounded-lg hover:bg-grey-50"
                aria-label="Advanced filters"
              >
                <SlidersHorizontal className="w-4 h-4 text-grey-700" />
              </button>
            </div>

            {/* Quick chips */}
            <div className="flex items-center gap-4 text-sm">
              <label className="flex items-center gap-2 text-grey-700">
                <input type="checkbox" className="rounded border-grey-300" /> Active Only
              </label>
              <label className="flex items-center gap-2 text-grey-700">
                <input type="checkbox" className="rounded border-grey-300" /> Remote Only
              </label>
              <span className="text-xs uppercase tracking-wider text-grey-400 ml-2">Employment:</span>
              {["Contract", "Intern", "Terminated"].map((t) => (
                <span key={t} className="px-3 py-1 rounded-full bg-grey-100 text-xs text-grey-700">{t}</span>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-grey-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-grey-50">
                <tr className="text-left text-xs uppercase tracking-wider text-grey-500">
                  <th className="px-6 py-3 font-medium">Employee</th>
                  <th className="px-6 py-3 font-medium">Department</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grey-100">
                {employees.map((e) => (
                  <tr key={e.id} className="hover:bg-grey-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-grey-200 flex items-center justify-center text-xs font-medium text-grey-600">
                          MC
                        </div>
                        <div>
                          <div className="text-sm font-medium text-grey-900">{e.name}</div>
                          <div className="text-xs text-grey-500">{e.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-blue-600 tracking-wider">{e.department}</td>
                    <td className="px-6 py-4 text-sm text-grey-700">{e.role}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-xs font-medium text-blue-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> ACTIVE
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-grey-500">
                        <button onClick={() => setOpenView(true)} className="p-2 hover:bg-grey-100 rounded-lg" aria-label="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => setOpenEdit(true)} className="p-2 hover:bg-grey-100 rounded-lg" aria-label="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setOpenDelete(true)} className="p-2 hover:bg-grey-100 rounded-lg" aria-label="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-grey-100">
              <span className="text-sm text-grey-500">
                Showing <span className="font-medium text-grey-700">1-10</span> of <span className="font-medium text-grey-700">128</span> employees
              </span>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1.5 text-sm text-grey-500 hover:bg-grey-100 rounded-md">‹</button>
                <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md">1</button>
                <button className="px-3 py-1.5 text-sm text-grey-700 hover:bg-grey-100 rounded-md">2</button>
                <button className="px-3 py-1.5 text-sm text-grey-700 hover:bg-grey-100 rounded-md">3</button>
                <span className="px-2 text-grey-400">…</span>
                <button className="px-3 py-1.5 text-sm text-grey-700 hover:bg-grey-100 rounded-md">13</button>
                <button className="px-3 py-1.5 text-sm text-grey-500 hover:bg-grey-100 rounded-md">›</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right rail metrics */}
        <aside className="col-span-12 lg:col-span-3 space-y-4">
          <MetricCard label="Retention Rate" value="94.2%" trend="+2%" />
          <MetricCard label="Open Roles" value="12" trend="Hiring Active" trendTone="muted" />
          <div className="bg-white border border-grey-200 rounded-xl p-5">
            <div className="text-xs uppercase tracking-wider text-grey-500">Health Index</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-3xl font-semibold text-grey-900">4.8</span>
              <span className="text-yellow-500">★★★★★</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Overlays */}
      {openFilter && <FilterDrawer onClose={() => setOpenFilter(false)} />}
      {openView && <ViewProfileDrawer onClose={() => setOpenView(false)} onEdit={() => { setOpenView(false); setOpenEdit(true); }} />}
      {openEdit && <EditEmployeeModal onClose={() => setOpenEdit(false)} />}
      {openDelete && <DeleteConfirmModal onClose={() => setOpenDelete(false)} />}
    </div>
  );
}

// ---------- right-rail metric card ----------
function MetricCard({ label, value, trend, trendTone = "positive" }: { label: string; value: string; trend: string; trendTone?: "positive" | "muted" }) {
  return (
    <div className="bg-white border border-grey-200 rounded-xl p-5">
      <div className="text-xs uppercase tracking-wider text-grey-500">{label}</div>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-3xl font-semibold text-grey-900">{value}</span>
        <span className={cn("text-xs font-medium", trendTone === "positive" ? "text-teal-600" : "text-grey-500")}>
          {trendTone === "positive" && "↗ "}{trend}
        </span>
      </div>
    </div>
  );
}

// ---------- Business Unit / Department popover ----------
function DeptPopover({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<string[]>(["Engineering"]);
  return (
    <div className="absolute top-full right-0 mt-2 w-[480px] bg-white border border-grey-200 rounded-xl shadow-xl z-50">
      <div className="p-4 border-b border-grey-100">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-grey-400" />
          <input placeholder="Search units or departments..." className="w-full pl-10 pr-3 py-2 bg-grey-50 border border-grey-200 rounded-lg text-sm focus:outline-none" />
        </div>
      </div>
      <div className="grid grid-cols-2 max-h-72">
        <ul className="border-r border-grey-100 py-2 overflow-y-auto">
          {businessUnits.map((u, i) => (
            <li key={u}>
              <button onClick={() => setActive(i)} className={cn("w-full text-left px-4 py-2.5 text-sm", active === i ? "bg-blue-50 text-blue-600 font-medium" : "text-grey-700 hover:bg-grey-50")}>
                {u}
              </button>
            </li>
          ))}
        </ul>
        <div className="py-2 overflow-y-auto">
          <div className="px-4 py-2 text-xs uppercase tracking-wider text-grey-400">Departments</div>
          {departments.map((d) => (
            <label key={d} className="flex items-center gap-3 px-4 py-2 text-sm text-grey-700 hover:bg-grey-50 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(d)}
                onChange={(e) => setSelected((prev) => e.target.checked ? [...prev, d] : prev.filter((x) => x !== d))}
                className="rounded border-grey-300"
              />
              {d}
            </label>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between p-4 border-t border-grey-100">
        <button onClick={() => setSelected([])} className="text-sm font-medium text-grey-600 hover:text-grey-900">Clear All</button>
        <button onClick={onClose} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Apply Filter</button>
      </div>
    </div>
  );
}

// ---------- Advanced Filter Drawer ----------
function FilterDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-[440px] bg-white shadow-2xl flex flex-col">
        <header className="p-6 border-b border-grey-100 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-grey-900">Filter Settings</h2>
            <p className="text-sm text-grey-500 mt-1">Refine your directory view</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1 text-grey-400 hover:text-grey-700">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section>
            <h3 className="text-xs uppercase tracking-wider text-grey-500 mb-3">Employment Type</h3>
            <div className="space-y-2">
              {[
                { label: "Full-time", checked: true },
                { label: "Contract", checked: false },
                { label: "Intern", checked: false },
              ].map((o) => (
                <label key={o.label} className="flex items-center gap-3 text-sm text-grey-700">
                  <input type="checkbox" defaultChecked={o.checked} className="rounded border-grey-300" />
                  {o.label}
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs uppercase tracking-wider text-grey-500 mb-3">Department</h3>
            <button className="w-full flex items-center justify-between px-4 py-2.5 border border-grey-200 rounded-lg text-sm text-grey-700">
              All Departments <ChevronDown className="w-4 h-4" />
            </button>
          </section>

          <section>
            <h3 className="text-xs uppercase tracking-wider text-grey-500 mb-3">Location</h3>
            <div className="flex flex-wrap items-center gap-2">
              {["San Francisco", "New York"].map((loc) => (
                <span key={loc} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-sm text-blue-700">
                  {loc} <X className="w-3 h-3 cursor-pointer" />
                </span>
              ))}
              <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-grey-300 text-sm text-grey-600">
                <Plus className="w-3 h-3" /> Add Location
              </button>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs uppercase tracking-wider text-grey-500">Tenure Range</h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-xs text-blue-700">0 - 10+ Years</span>
            </div>
            <input type="range" defaultValue={100} className="w-full accent-blue-600" />
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-grey-400 mt-1">
              <span>New Joiner</span><span>Expert</span>
            </div>
          </section>
        </div>

        <footer className="p-6 border-t border-grey-100 flex items-center justify-between bg-grey-50">
          <button className="text-sm font-medium text-grey-700 hover:text-grey-900">Reset</button>
          <button onClick={onClose} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Apply Filters</button>
        </footer>
      </aside>
    </div>
  );
}

// ---------- View Profile Drawer ----------
function ViewProfileDrawer({ onClose, onEdit }: { onClose: () => void; onEdit: () => void }) {
  const perf = [40, 55, 60, 75, 100];
  const history = [
    { role: "Senior Technical Architect", period: "Jan 2021 — Present", active: true },
    { role: "Systems Engineer IV", period: "May 2019 — Dec 2020" },
    { role: "Full Stack Developer", period: "Jan 2018 — Apr 2019" },
  ];
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-[560px] bg-white shadow-2xl flex flex-col">
        <header className="p-6 flex items-center justify-between">
          <button onClick={onClose} aria-label="Close" className="text-grey-400 hover:text-grey-700">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <button onClick={onEdit} className="px-4 py-2 border border-grey-200 rounded-lg text-sm font-medium text-grey-700 hover:bg-grey-50">Edit Profile</button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Download CV</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
          {/* Identity */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-xl bg-grey-200" />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-semibold tracking-wider">ACTIVE</span>
            </div>
            <div className="pt-1">
              <h2 className="text-2xl font-semibold text-grey-900">Marcus Chen</h2>
              <p className="text-blue-600 font-medium">Senior Technical Architect</p>
              <div className="flex items-center gap-4 text-xs text-grey-500 mt-2">
                <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> Lagos, HQ</span>
                <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> 4.5 Years Tenured</span>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-grey-50 border border-grey-100 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-grey-500">Recent Performance</span>
              <span className="text-sm font-semibold text-blue-600">Exceeds Expectations</span>
            </div>
            <div className="flex items-end gap-2 h-24">
              {perf.map((h, i) => (
                <div key={i} className={cn("flex-1 rounded-t-md", i === perf.length - 1 ? "bg-blue-600" : "bg-blue-200")} style={{ height: `${h}%` }} />
              ))}
            </div>
            <p className="text-xs text-grey-600 mt-3 italic">
              "Marcus successfully led the Q3 Infrastructure Migration, reducing latency by 42% across core services while maintaining 99.99% uptime."
            </p>
          </div>

          {/* History + competencies */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-grey-500 mb-3">Employment History</h3>
              <ul className="space-y-4">
                {history.map((h) => (
                  <li key={h.role} className="flex gap-3">
                    <span className={cn("mt-1.5 w-2 h-2 rounded-full shrink-0", h.active ? "bg-blue-600" : "bg-grey-300")} />
                    <div>
                      <div className="text-sm font-medium text-grey-900">{h.role}</div>
                      <div className="text-xs text-grey-500">{h.period}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider text-grey-500 mb-3">Core Competencies</h3>
              <div className="flex flex-wrap gap-2">
                {["Cloud Architecture", "React & Node.js", "DevOps", "Security Governance", "Graphé L", "Team Leadership"].map((c) => (
                  <span key={c} className="px-2.5 py-1 rounded-md border border-grey-200 text-xs text-grey-700">{c}</span>
                ))}
              </div>

              <h3 className="text-xs uppercase tracking-wider text-grey-500 mt-6 mb-3">Direct Contact</h3>
              <div className="space-y-2 text-sm text-grey-700">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-grey-400" /> m.chen@360hr.com</div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-grey-400" /> +1 (415) 555-0192</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-grey-50 border border-grey-100 rounded-xl grid grid-cols-3 divide-x divide-grey-200">
            {[
              { label: "Reports", value: "12" },
              { label: "Projects", value: "48" },
              { label: "Impact Score", value: "9.8" },
            ].map((s) => (
              <div key={s.label} className="p-5 text-center">
                <div className="text-xs uppercase tracking-wider text-grey-500">{s.label}</div>
                <div className="text-2xl font-semibold text-blue-600 mt-1">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

// ---------- Edit Employee Modal ----------
function EditEmployeeModal({ onClose }: { onClose: () => void }) {
  const tabs = [
    { label: "Basic Info", icon: User, active: true },
    { label: "Job Details", icon: Briefcase },
    { label: "Compensation", icon: DollarSign },
    { label: "Emergency Contacts", icon: UsersIcon },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <header className="p-6 border-b border-grey-100 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-grey-900">Edit Employee Record</h2>
            <p className="text-sm text-grey-500 mt-1">Update details for Marcus Sterling • EMP-9021</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-grey-400 hover:text-grey-700">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto flex">
          {/* Tabs */}
          <nav className="w-56 bg-grey-50 p-4 space-y-1 border-r border-grey-100">
            {tabs.map((t) => (
              <button
                key={t.label}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm",
                  t.active ? "bg-white text-blue-600 font-medium shadow-sm" : "text-grey-700 hover:bg-white/60",
                )}
              >
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </nav>

          {/* Body */}
          <div className="flex-1 p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-grey-200" />
              <div>
                <h3 className="font-semibold text-grey-900">Personal Identity</h3>
                <p className="text-sm text-grey-500">Upload a high-resolution photo for the corporate directory.</p>
                <button className="text-sm font-medium text-blue-600 mt-1">Replace profile image</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" defaultValue="Marcus" />
              <Field label="Last Name" defaultValue="Sterling" />
              <Field label="Work Email" defaultValue="m.sterling@360hr.com" />
              <Field label="Personal Mobile" defaultValue="+234 012-9984" />
            </div>

            <Field label="Primary Office Location" defaultValue="Lagos HQ - Architectural Row" select />

            <div>
              <label className="block text-xs uppercase tracking-wider text-grey-500 mb-2">Bio & Specializations</label>
              <textarea
                rows={3}
                defaultValue="Senior Structural Architect with over 12 years of experience in sustainable urban curation. Lead designer for the Sky Garden Initiative."
                className="w-full px-3 py-2 border border-grey-200 rounded-lg text-sm text-grey-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">i</div>
              <p className="text-sm text-blue-700">
                <strong>Identity Verification:</strong> Updating the official legal name will trigger a secondary verification request from the compliance department.
              </p>
            </div>
          </div>
        </div>

        <footer className="p-6 border-t border-grey-100 flex items-center justify-between bg-grey-50">
          <span className="text-xs text-grey-500 inline-flex items-center gap-1.5">
            <Clock className="w-3 h-3" /> Last edited 2 days ago by Sarah Femi
          </span>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-grey-700 hover:text-grey-900">Cancel</button>
            <button onClick={onClose} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Save Changes</button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Field({ label, defaultValue, select }: { label: string; defaultValue: string; select?: boolean }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-grey-500 mb-2">{label}</label>
      <div className="relative">
        <input
          defaultValue={defaultValue}
          className="w-full px-3 py-2 border border-grey-200 rounded-lg text-sm text-grey-800 focus:outline-none focus:border-blue-500"
        />
        {select && <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-grey-400 pointer-events-none" />}
      </div>
    </div>
  );
}

// ---------- Delete Confirm Modal ----------
function DeleteConfirmModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
        <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-grey-900">Delete Employee Record</h3>
        <p className="text-sm text-grey-500 mt-2">
          Are you sure you want to delete <strong>Marcus Chen's</strong> record? This action will archive all historical data and cannot be undone.
        </p>
        <div className="mt-6 space-y-2">
          <button onClick={onClose} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold">
            Confirm Delete
          </button>
          <button onClick={onClose} className="w-full py-2.5 text-sm font-medium text-grey-700 hover:bg-grey-50 rounded-lg">
            Cancel
          </button>
        </div>
        <div className="mt-4 pt-4 border-t border-grey-100 text-[11px] uppercase tracking-wider text-grey-400 inline-flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3" /> Administrative Action
        </div>
      </div>
    </div>
  );
}
