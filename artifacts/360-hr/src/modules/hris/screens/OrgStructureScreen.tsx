"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    X,
    ArrowUp,
    Mail,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    Maximize2,
    SlidersHorizontal,
    Landmark,
    Wallet,
    Plus,
    Pencil,
    Trash2,
    AlertTriangle,
    Move,
    MapPin,
    Users,
    TrendingUp,
    Activity,
    Globe,
    BarChart3,
    ChevronDown,
} from "lucide-react";

import { departmentApi } from "@/lib/api";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────
type Department = {
    id: string;
    name: string;
    type: string;
    iconKey?: "eng" | "ops" | "sales";
    child?: { name: string; members: string };
    headOfUnit?: string;
    headAvatar?: string;
    jobGrade?: string;
    budgetCap?: string;
    memberCount?: number;
    openRoles?: number;
};

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_DEPARTMENTS: Department[] = [
    {
        id: "mock-1", name: "Engineering Division", type: "Business Unit", iconKey: "eng",
        child: { name: "Product Development", members: "18 Members" },
        headOfUnit: "Elena Rodriguez", headAvatar: "https://i.pravatar.cc/80?u=elena",
        jobGrade: "L8 - VP Engineering", budgetCap: "$620k/yr", memberCount: 54, openRoles: 7,
    },
    {
        id: "mock-2", name: "Human Resources", type: "Business Unit", iconKey: "ops",
        child: { name: "HR Operations", members: "6 Members" },
        headOfUnit: "James Mitchell", headAvatar: "https://i.pravatar.cc/80?u=james",
        jobGrade: "L7 - Director", budgetCap: "$240k/yr", memberCount: 18, openRoles: 2,
    },
    {
        id: "mock-3", name: "Sales & Growth", type: "Business Unit", iconKey: "sales",
        child: { name: "Enterprise Sales", members: "12 Members" },
        headOfUnit: "Priya Okafor", headAvatar: "https://i.pravatar.cc/80?u=priya",
        jobGrade: "L7 - VP Sales", budgetCap: "$380k/yr", memberCount: 31, openRoles: 4,
    },
    {
        id: "mock-4", name: "Finance & Legal", type: "Department", iconKey: "ops",
        child: { name: "Treasury", members: "4 Members" },
        headOfUnit: "David Chen", headAvatar: "https://i.pravatar.cc/80?u=david",
        jobGrade: "L7 - CFO", budgetCap: "$180k/yr", memberCount: 12, openRoles: 1,
    },
    {
        id: "mock-5", name: "Marketing", type: "Business Unit", iconKey: "sales",
        child: { name: "Brand & Content", members: "9 Members" },
        headOfUnit: "Sofia Adebayo", headAvatar: "https://i.pravatar.cc/80?u=sofia",
        jobGrade: "L7 - Director", budgetCap: "$310k/yr", memberCount: 22, openRoles: 3,
    },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
const getIconKey = (name: string): "eng" | "ops" | "sales" => {
    if (name.toLowerCase().includes("eng") || name.toLowerCase().includes("product")) return "eng";
    if (name.toLowerCase().includes("hr") || name.toLowerCase().includes("ops") || name.toLowerCase().includes("fin")) return "ops";
    return "sales";
};

const ICONS: Record<"eng" | "ops" | "sales", React.ReactNode> = {
    eng: <SlidersHorizontal className="h-4 w-4 text-blue-600" />,
    ops: <Landmark className="h-4 w-4 text-indigo-600" />,
    sales: <Wallet className="h-4 w-4 text-violet-600" />,
};

const TABS = ["Tree View", "List View (Hierarchy)", "Business Units Overview"] as const;

// Hierarchy list data (static, design-driven)
const HIERARCHY_ROWS = [
    { level: 0, name: "Marcus Sterling", role: "Chief Executive Officer", dept: "Executive Office", manager: "—", location: "New York", avatar: "MS" },
    { level: 1, name: "Elena Rodriguez", role: "VP Engineering", dept: "Engineering Division", manager: "Marcus Sterling", location: "San Francisco", avatar: "ER" },
    { level: 2, name: "James O'Brien", role: "Lead Engineer", dept: "Engineering", manager: "Elena Rodriguez", location: "San Francisco", avatar: "JO" },
    { level: 2, name: "Clara Nwosu", role: "Product Director", dept: "Product & Design", manager: "Elena Rodriguez", location: "Lagos", avatar: "CN" },
    { level: 1, name: "James Mitchell", role: "HR Director", dept: "Human Resources", manager: "Marcus Sterling", location: "London", avatar: "JM" },
    { level: 2, name: "Sofia Adebayo", role: "HR Analyst", dept: "Talent Acquisition", manager: "James Mitchell", location: "Lagos", avatar: "SA" },
    { level: 1, name: "Priya Okafor", role: "VP Sales", dept: "Sales & Growth", manager: "Marcus Sterling", location: "Dubai", avatar: "PO" },
    { level: 2, name: "David Chen", role: "Enterprise Account Exec", dept: "Enterprise Sales", manager: "Priya Okafor", location: "Singapore", avatar: "DC" },
];

const AVATAR_COLORS = [
    "bg-blue-600", "bg-violet-600", "bg-emerald-600",
    "bg-amber-600", "bg-rose-600", "bg-indigo-600",
];

// Business units (regional)
const REGIONAL_BUS = [
    {
        id: "na", name: "North America", code: "NA", headcount: 89, departments: 5,
        utilization: 94, head: "Marcus Sterling", openRoles: 7,
        color: "from-blue-500 to-blue-700", bgLight: "bg-blue-50", textColor: "text-blue-700",
    },
    {
        id: "emea", name: "EMEA Region", code: "EU", headcount: 47, departments: 3,
        utilization: 88, head: "Elena Rodriguez", openRoles: 4,
        color: "from-violet-500 to-violet-700", bgLight: "bg-violet-50", textColor: "text-violet-700",
    },
    {
        id: "apac", name: "APAC Division", code: "AP", headcount: 31, departments: 2,
        utilization: 78, head: "Priya Okafor", openRoles: 2,
        color: "from-emerald-500 to-emerald-700", bgLight: "bg-emerald-50", textColor: "text-emerald-700",
    },
];

// ─── Main Component ────────────────────────────────────────────────────────────
export default function OrgStructureScreen() {
    const [activeTab, setActiveTab] = useState<typeof TABS[number]>("Tree View");
    const [selectedId, setSelectedId] = useState<string>("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set([0, 1, 4, 6]));
    const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null);

    const queryClient = useQueryClient();

    // ── Data ───────────────────────────────────────────────────────────────────
    const { data: apiData, isLoading } = useQuery({
        queryKey: ["department-tree"],
        queryFn: () => departmentApi.getTree(),
        retry: 1,
    });

    const isMockData = !apiData || !Array.isArray(apiData) || apiData.length === 0;
    const units: Department[] = isMockData ? MOCK_DEPARTMENTS : (apiData as Department[]);
    const selected = units.find((u) => u.id === selectedId) ?? units[0];

    // ── Pan ─────────────────────────────────────────────────────────────────────
    const onMouseDown = (e: React.MouseEvent) => {
        dragRef.current = { startX: e.clientX, startY: e.clientY, baseX: pan.x, baseY: pan.y };
    };
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!dragRef.current) return;
            setPan({ x: dragRef.current.baseX + (e.clientX - dragRef.current.startX), y: dragRef.current.baseY + (e.clientY - dragRef.current.startY) });
        };
        const onUp = () => { dragRef.current = null; };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    }, []);
    const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };
    const zoomIn = () => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(2)));
    const zoomOut = () => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)));

    // ── Mutations ───────────────────────────────────────────────────────────────
    const addMutation = useMutation({
        mutationFn: (d: { name: string; type: string }) => departmentApi.create({ name: d.name, description: d.type }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["department-tree"] }),
    });
    const editMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: { name: string; type: string } }) => departmentApi.update(id, { name: data.name, description: data.type }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["department-tree"] }),
    });
    const deleteMutation = useMutation({
        mutationFn: (id: string) => departmentApi.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["department-tree"] }),
    });

    const handleAdd = (name: string, type: string) => { addMutation.mutate({ name, type }); setAddOpen(false); };
    const handleEdit = (name: string, type: string) => { if (!selected) return; editMutation.mutate({ id: selected.id, data: { name, type } }); setEditOpen(false); };
    const handleDelete = () => { if (!selected) return; deleteMutation.mutate(selected.id); setDeleteOpen(false); setSidebarOpen(false); };

    // ── Metrics ─────────────────────────────────────────────────────────────────
    const totalHeadcount = units.reduce((s, u) => s + (u.memberCount ?? 0), 0);
    const totalBusinessUnits = units.filter((u) => u.type === "Business Unit").length;
    const totalDepartments = units.length;
    const totalVacancies = units.reduce((s, u) => s + (u.openRoles ?? 0), 0);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
                    <p className="text-sm text-slate-500">Loading organisational structure…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-6 md:p-8 font-sans text-slate-900">
            <div className="mx-auto max-w-[1300px]">

                {isMockData && (
                    <div className="mb-5 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-500" />
                        <span>Could not reach the API — showing <strong>demo data</strong>.</span>
                    </div>
                )}

                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Org Structure</h1>
                        <p className="mt-1 text-sm text-slate-500">Institutional hierarchy and operational layout</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
                            <Plus className="h-4 w-4" /> Add Department
                        </button>
                        <div className="flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                            {TABS.map((t) => (
                                <button key={t} onClick={() => setActiveTab(t)}
                                    className={cn("rounded-md px-3 py-2 text-[13px] font-medium transition-colors whitespace-nowrap",
                                        activeTab === t ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:text-slate-700"
                                    )}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Metrics */}
                <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { l: "TOTAL HEADCOUNT", v: totalHeadcount.toLocaleString(), s: "+12% this month", trend: true },
                        { l: "BUSINESS UNITS", v: totalBusinessUnits.toString(), s: "Global regions active" },
                        { l: "DEPARTMENTS", v: totalDepartments.toString(), s: "Cross-functional teams" },
                        { l: "ACTIVE VACANCIES", v: totalVacancies.toString(), s: "Priority hiring on", pill: true },
                    ].map((m) => (
                        <div key={m.l} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-[11px] font-semibold tracking-wider text-slate-500">{m.l}</p>
                            <p className="mt-3 text-4xl font-bold text-slate-900">{m.v}</p>
                            {m.trend ? (
                                <p className="mt-2 text-xs font-medium text-indigo-600">↗ {m.s}</p>
                            ) : m.pill ? (
                                <span className="mt-2 inline-block rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-700">{m.s}</span>
                            ) : (
                                <p className="mt-2 text-xs text-slate-500">{m.s}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* ── TREE VIEW ──────────────────────────────────────────────────── */}
                {activeTab === "Tree View" && (
                    <div className={cn("grid gap-6", sidebarOpen ? "grid-cols-[1fr_360px]" : "grid-cols-1")}>
                        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60">
                            <div
                                onMouseDown={onMouseDown}
                                className="relative h-[580px] cursor-grab select-none active:cursor-grabbing"
                                style={{ backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)", backgroundSize: "20px 20px" }}
                            >
                                <div className="origin-top" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "50% 0" }}>
                                    <div className="flex flex-col items-center pt-12">
                                        {/* CEO Node */}
                                        <div className="flex w-72 items-center gap-3 rounded-xl border-2 border-indigo-500 bg-white p-3.5 shadow-md">
                                            <img src="https://i.pravatar.cc/80?u=marcus-sterling" alt="" className="h-11 w-11 rounded-full object-cover" />
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Marcus Sterling</p>
                                                <p className="text-xs text-slate-500">Chief Executive Officer</p>
                                                <span className="mt-0.5 inline-block text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Executive Office</span>
                                            </div>
                                        </div>

                                        {/* Connector */}
                                        <div className="h-8 w-px bg-slate-300" />
                                        <div className="relative flex w-full max-w-[860px] justify-center">
                                            <div className="h-px w-[66%] bg-slate-300" />
                                        </div>

                                        {/* BU Nodes */}
                                        <div className="grid w-full max-w-[900px] grid-cols-3 gap-6 px-6">
                                            {units.slice(0, 3).map((u, idx) => {
                                                const isActive = selectedId === u.id;
                                                const bgColors = ["bg-blue-50", "bg-violet-50", "bg-emerald-50"];
                                                const textColors = ["text-blue-700", "text-violet-700", "text-emerald-700"];
                                                return (
                                                    <div key={u.id} className="flex flex-col items-center">
                                                        <div className="h-8 w-px bg-slate-300" />
                                                        <button
                                                            onClick={() => { setSelectedId(u.id); setSidebarOpen(true); }}
                                                            className={cn(
                                                                "flex w-full items-center gap-3 rounded-xl border bg-white p-3.5 text-left shadow-sm transition-all",
                                                                isActive ? "border-2 border-indigo-500 shadow-indigo-100 shadow-md" : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                                                            )}
                                                        >
                                                            <div className={cn("flex h-9 w-9 items-center justify-center rounded-full", bgColors[idx])}>
                                                                {ICONS[u.iconKey ?? getIconKey(u.name)]}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-900">{u.name}</p>
                                                                <p className="text-xs text-slate-500">{u.memberCount} members</p>
                                                            </div>
                                                        </button>
                                                        {u.child && (
                                                            <>
                                                                <div className="h-6 w-px bg-slate-300" />
                                                                <div className="w-full rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                                                                    <p className="text-sm font-semibold text-slate-800">{u.child.name}</p>
                                                                    <p className="text-xs text-slate-500 mt-0.5">{u.child.members}</p>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                                    <button onClick={zoomIn} title="Zoom in" className="rounded-md p-2 text-slate-600 hover:bg-slate-50"><ZoomIn className="h-4 w-4" /></button>
                                    <button onClick={zoomOut} title="Zoom out" className="rounded-md p-2 text-slate-600 hover:bg-slate-50"><ZoomOut className="h-4 w-4" /></button>
                                    <span className="px-2 text-xs font-medium text-slate-500">{Math.round(zoom * 100)}%</span>
                                    <div className="h-5 w-px bg-slate-200" />
                                    <button onClick={resetView} title="Reset" className="rounded-md p-2 text-slate-600 hover:bg-slate-50"><Maximize2 className="h-4 w-4" /></button>
                                </div>
                                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-md bg-white/90 px-2.5 py-1.5 text-[11px] font-medium text-slate-500 shadow-sm">
                                    <Move className="h-3.5 w-3.5" /> Drag to pan
                                </div>
                            </div>
                        </div>

                        {/* Detail Sidebar */}
                        {sidebarOpen && selected && (
                            <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700">{selected.type}</span>
                                    <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-600 p-1"><X className="h-4 w-4" /></button>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">{selected.name}</h2>
                                <p className="mt-0.5 text-sm text-slate-500">Head: {selected.headOfUnit ?? "N/A"}</p>

                                <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-slate-500">POSITION DETAILS</p>
                                <div className="mt-2 grid grid-cols-2 gap-3">
                                    <div className="rounded-lg border border-slate-200 p-3">
                                        <p className="text-[10px] font-semibold uppercase text-slate-500">Job Grade</p>
                                        <p className="mt-1 text-sm font-bold text-slate-900">{selected.jobGrade ?? "L8 - Executive"}</p>
                                    </div>
                                    <div className="rounded-lg border border-slate-200 p-3">
                                        <p className="text-[10px] font-semibold uppercase text-slate-500">Budget Cap</p>
                                        <p className="mt-1 text-sm font-bold text-slate-900">{selected.budgetCap ?? "$480k/yr"}</p>
                                    </div>
                                    <div className="rounded-lg border border-slate-200 p-3">
                                        <p className="text-[10px] font-semibold uppercase text-slate-500">Members</p>
                                        <p className="mt-1 text-sm font-bold text-slate-900">{selected.memberCount ?? 0}</p>
                                    </div>
                                    <div className="rounded-lg border border-slate-200 p-3">
                                        <p className="text-[10px] font-semibold uppercase text-slate-500">Open Roles</p>
                                        <p className="mt-1 text-sm font-bold text-rose-600">{selected.openRoles ?? 0}</p>
                                    </div>
                                </div>

                                <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-slate-500">REPORTING LINE</p>
                                <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                                        <ArrowUp className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Marcus Sterling</p>
                                        <p className="text-xs text-slate-500">Chief Executive Officer</p>
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center justify-between">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">CURRENT OCCUPANT</p>
                                    <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-medium text-sky-700">Active</span>
                                </div>
                                <div className="mt-2 flex items-center justify-between rounded-lg border border-slate-200 p-3">
                                    <div className="flex items-center gap-3">
                                        <img src={selected.headAvatar ?? "https://i.pravatar.cc/80?u=default"} alt="" className="h-10 w-10 rounded-full object-cover" />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{selected.headOfUnit ?? "N/A"}</p>
                                            <p className="text-xs text-slate-500">Joined Jan 2021</p>
                                        </div>
                                    </div>
                                    <button className="rounded-md border border-slate-200 p-2 text-slate-500 hover:bg-slate-50">
                                        <Mail className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="mt-auto pt-5 flex gap-2">
                                    <button onClick={() => setEditOpen(true)} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                        <Pencil className="h-4 w-4" /> Edit
                                    </button>
                                    <button onClick={() => setDeleteOpen(true)} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-rose-200 px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50">
                                        <Trash2 className="h-4 w-4" /> Delete
                                    </button>
                                </div>
                                <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
                                    View Unit Strategy →
                                </button>
                            </aside>
                        )}
                    </div>
                )}

                {/* ── LIST VIEW ──────────────────────────────────────────────────── */}
                {activeTab === "List View (Hierarchy)" && (
                    <div className="space-y-5">
                        {/* Filter bar */}
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1 max-w-xs">
                                <Activity className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input placeholder="Search hierarchy..." className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 bg-slate-50" />
                            </div>
                            <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white focus:outline-none">
                                <option>All Levels</option>
                                <option>Level 0 (Executive)</option>
                                <option>Level 1 (VP)</option>
                                <option>Level 2 (Manager)</option>
                            </select>
                        </div>

                        {/* Table */}
                        <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                <div>Name</div><div>Role / Position</div><div>Department</div><div>Reporting Manager</div><div>Location</div>
                            </div>
                            <div className="divide-y divide-slate-100 bg-white">
                                {HIERARCHY_ROWS.map((row, i) => (
                                    <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors"
                                        style={{ paddingLeft: `${20 + row.level * 32}px` }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0", AVATAR_COLORS[i % AVATAR_COLORS.length])}>
                                                {row.avatar}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{row.name}</p>
                                                {row.level > 0 && (
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        {Array.from({ length: row.level }).map((_, j) => (
                                                            <div key={j} className="w-1 h-1 rounded-full bg-slate-300" />
                                                        ))}
                                                        <span className="text-[10px] text-slate-400 font-medium">L{row.level}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-[13px] text-slate-600">{row.role}</p>
                                        <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded w-fit">{row.dept}</span>
                                        <p className="text-[13px] text-slate-600">{row.manager}</p>
                                        <div className="flex items-center gap-1.5 text-[13px] text-slate-600">
                                            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />{row.location}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Organizational Health Score */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">ORGANIZATIONAL HEALTH SCORE</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Based on span of control, hierarchy depth, and bottleneck analysis</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-slate-900">87<span className="text-base text-slate-400 font-normal">/100</span></p>
                                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">Healthy</span>
                                </div>
                            </div>
                            <div className="mb-4 h-3 rounded-full bg-slate-100">
                                <div className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all" style={{ width: "87%" }} />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: "Span of Control", value: "5.2 avg", icon: Users, tone: "text-blue-600 bg-blue-50" },
                                    { label: "Hierarchy Depth", value: "5 levels", icon: BarChart3, tone: "text-violet-600 bg-violet-50" },
                                    { label: "Bottlenecks", value: "2 identified", icon: AlertTriangle, tone: "text-amber-600 bg-amber-50" },
                                ].map((s) => (
                                    <div key={s.label} className="rounded-xl border border-slate-100 bg-slate-50 p-4 flex items-start gap-3">
                                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", s.tone)}>
                                            <s.icon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase text-slate-400">{s.label}</p>
                                            <p className="text-sm font-bold text-slate-900 mt-0.5">{s.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── BUSINESS UNITS OVERVIEW ────────────────────────────────────── */}
                {activeTab === "Business Units Overview" && (
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            {REGIONAL_BUS.map((bu) => (
                                <div key={bu.id} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                    {/* Card header */}
                                    <div className={cn("h-2 w-full bg-gradient-to-r", bu.color)} />
                                    <div className="p-5">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br", bu.color)}>
                                                {bu.code}
                                            </div>
                                            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">Active</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900">{bu.name}</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">Head: {bu.head}</p>

                                        {/* Stats grid */}
                                        <div className="mt-4 grid grid-cols-3 gap-2">
                                            <div className="rounded-lg bg-slate-50 p-2.5 text-center">
                                                <p className="text-[10px] font-bold uppercase text-slate-400">Headcount</p>
                                                <p className="text-lg font-bold text-slate-900 mt-0.5">{bu.headcount}</p>
                                            </div>
                                            <div className="rounded-lg bg-slate-50 p-2.5 text-center">
                                                <p className="text-[10px] font-bold uppercase text-slate-400">Depts</p>
                                                <p className="text-lg font-bold text-slate-900 mt-0.5">{bu.departments}</p>
                                            </div>
                                            <div className="rounded-lg bg-slate-50 p-2.5 text-center">
                                                <p className="text-[10px] font-bold uppercase text-slate-400">Vacancies</p>
                                                <p className="text-lg font-bold text-rose-600 mt-0.5">{bu.openRoles}</p>
                                            </div>
                                        </div>

                                        {/* Utilization */}
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                                                <span className="font-medium">Utilization</span>
                                                <span className={cn("font-bold", bu.textColor)}>{bu.utilization}%</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-slate-100">
                                                <div className={cn("h-2 rounded-full bg-gradient-to-r transition-all", bu.color)} style={{ width: `${bu.utilization}%` }} />
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setActiveTab("Tree View");
                                            }}
                                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            View unit <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Regional Spread + Additional panels */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {/* Regional Spread */}
                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm font-bold text-slate-900">Regional Spread</p>
                                    <Globe className="h-4 w-4 text-slate-400" />
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { region: "North America", pct: 52, color: "bg-blue-500" },
                                        { region: "Europe & Middle East", pct: 28, color: "bg-violet-500" },
                                        { region: "Asia Pacific", pct: 18, color: "bg-emerald-500" },
                                        { region: "Other", pct: 2, color: "bg-slate-300" },
                                    ].map((r) => (
                                        <div key={r.region}>
                                            <div className="flex items-center justify-between text-[13px] mb-1.5">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("w-2.5 h-2.5 rounded-full", r.color)} />
                                                    <span className="text-slate-700">{r.region}</span>
                                                </div>
                                                <span className="font-semibold text-slate-900">{r.pct}%</span>
                                            </div>
                                            <div className="h-1.5 rounded-full bg-slate-100">
                                                <div className={cn("h-1.5 rounded-full", r.color)} style={{ width: `${r.pct}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 text-center">
                                    <div><p className="text-xl font-bold text-slate-900">167</p><p className="text-[11px] text-slate-500">Total</p></div>
                                    <div><p className="text-xl font-bold text-slate-900">3</p><p className="text-[11px] text-slate-500">Regions</p></div>
                                    <div><p className="text-xl font-bold text-slate-900">14</p><p className="text-[11px] text-slate-500">Countries</p></div>
                                </div>
                            </div>

                            {/* Recent Changes + Expand Structure */}
                            <div className="space-y-4">
                                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-bold text-slate-900">Recent Changes</p>
                                        <TrendingUp className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { event: "APAC Division expanded", time: "2 days ago", type: "add" },
                                            { event: "Finance & Legal merged", time: "1 week ago", type: "merge" },
                                            { event: "New Engineering head assigned", time: "2 weeks ago", type: "update" },
                                        ].map((c, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", c.type === "add" ? "bg-emerald-500" : c.type === "merge" ? "bg-amber-500" : "bg-blue-500")} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[13px] font-medium text-slate-800">{c.event}</p>
                                                    <p className="text-[11px] text-slate-400">{c.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                                            <Plus className="h-4 w-4 text-indigo-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-indigo-900">Expand Structure</p>
                                            <p className="text-xs text-indigo-600 mt-0.5">Add a new business unit or regional division to extend your org chart.</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setAddOpen(true)} className="mt-4 w-full py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors">
                                        Add New Unit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Modals ─────────────────────────────────────────────────────── */}
                {addOpen && <DepartmentModal title="Add Department" subtitle="Create a new business unit or department." submitLabel="Create Department" onClose={() => setAddOpen(false)} onSubmit={handleAdd} />}
                {editOpen && selected && <DepartmentModal title="Edit Department" subtitle={`Update details for ${selected.name}.`} submitLabel="Save Changes" initialName={selected.name} initialType={selected.type} onClose={() => setEditOpen(false)} onSubmit={handleEdit} />}
                {deleteOpen && selected && <ConfirmDeleteModal name={selected.name} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} />}
            </div>
        </div>
    );
}

// ─── DepartmentModal ───────────────────────────────────────────────────────────
function DepartmentModal(props: { title: string; subtitle: string; submitLabel: string; initialName?: string; initialType?: string; onClose: () => void; onSubmit: (name: string, type: string) => void }) {
    const [name, setName] = useState(props.initialName ?? "");
    const [type, setType] = useState(props.initialType ?? "Business Unit");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={props.onClose}>
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
                <div className="flex items-start justify-between mb-5">
                    <div><h3 className="text-xl font-bold text-slate-900">{props.title}</h3><p className="mt-1 text-sm text-slate-500">{props.subtitle}</p></div>
                    <button onClick={props.onClose} className="p-1 text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Marketing" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Type</label>
                        <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                            <option>Business Unit</option><option>Department</option><option>Team</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                    <button onClick={props.onClose} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button disabled={!name.trim()} onClick={() => props.onSubmit(name.trim(), type)} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-indigo-300">
                        {props.submitLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── ConfirmDeleteModal ────────────────────────────────────────────────────────
function ConfirmDeleteModal(props: { name: string; onClose: () => void; onConfirm: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={props.onClose}>
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
                <div className="flex items-start gap-4 mb-6">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-rose-100"><AlertTriangle className="h-5 w-5 text-rose-600" /></div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900">Delete {props.name}?</h3>
                        <p className="mt-1 text-sm text-slate-500">This will permanently remove the department and unassign its members. This action cannot be undone.</p>
                    </div>
                    <button onClick={props.onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                </div>
                <div className="flex justify-end gap-2">
                    <button onClick={props.onClose} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button onClick={props.onConfirm} className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">Delete Department</button>
                </div>
            </div>
        </div>
    );
}
