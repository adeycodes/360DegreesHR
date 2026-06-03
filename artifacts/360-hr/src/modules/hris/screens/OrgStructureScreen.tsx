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
    Grid3X3,
    List,
    Download,
    Award,
    ChevronUp,
    Search,
    MoreVertical,
    Briefcase,
    Building2,
    ShieldCheck,
    ArrowRight,
    ArrowLeft,
    Filter,
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
        id: "mock-1", name: "Engineering", type: "Business Unit", iconKey: "eng",
        child: { name: "Product Dev", members: "12 Members" },
        headOfUnit: "Elena Vance", headAvatar: "https://i.pravatar.cc/80?u=elena",
        jobGrade: "L8 - Executive", budgetCap: "$480k/yr", memberCount: 42, openRoles: 5,
    },
    {
        id: "mock-2", name: "Operations", type: "Business Unit", iconKey: "ops",
        child: { name: "HR & People", members: "8 Members" },
        headOfUnit: "James Morrow", headAvatar: "https://i.pravatar.cc/80?u=james",
        jobGrade: "L7 - Director", budgetCap: "$310k/yr", memberCount: 28, openRoles: 3,
    },
    {
        id: "mock-3", name: "Sales & Growth", type: "Business Unit", iconKey: "sales",
        child: { name: "Enterprise Sales", members: "22 Members" },
        headOfUnit: "Priya Okafor", headAvatar: "https://i.pravatar.cc/80?u=priya",
        jobGrade: "L7 - Director", budgetCap: "$220k/yr", memberCount: 19, openRoles: 2,
    },
];

const TABS = ["Tree View", "List View (Hierarchy)", "Business Units Overview"] as const;

// ─── Helpers ───────────────────────────────────────────────────────────────────
const ICONS: Record<string, React.ReactNode> = {
    eng: <SlidersHorizontal className="h-4 w-4 text-[#1C4ED8]" />,
    ops: <Landmark className="h-4 w-4 text-[#1C4ED8]" />,
    sales: <Wallet className="h-4 w-4 text-[#1C4ED8]" />,
};

// ─── Main Component ────────────────────────────────────────────────────────────────────────
export default function OrgStructureScreen() {
    const [activeTab, setActiveTab] = useState<typeof TABS[number]>("Tree View");
    const [selectedId, setSelectedId] = useState<string>("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null);

    const queryClient = useQueryClient();

    const { data: apiData, isLoading } = useQuery({
        queryKey: ["department-tree"],
        queryFn: () => departmentApi.getTree(),
        retry: false,
    });

    const isMockData = !apiData || !Array.isArray(apiData) || apiData.length === 0;
    const units: Department[] = isMockData ? MOCK_DEPARTMENTS : (apiData as Department[]);
    const selected = units.find((u) => u.id === selectedId) ?? units[0];

    // Pan handlers
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

    // Mutations
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

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#1C4ED8]/20 border-t-[#1C4ED8]" />
                    <p className="text-sm text-slate-500">Loading organisational structure...</p>
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
                        <span>Could not reach the API - showing <strong>demo data</strong>.</span>
                    </div>
                )}

                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-[28px] font-bold tracking-tight text-slate-900">Org Structure</h1>
                            <div className="flex items-center gap-1 px-2 py-1 bg-[#1C4ED8]/10 text-[#1C4ED8] text-[11px] font-bold rounded-full">
                                <Award className="w-3 h-3" /> +12 Active BU Leadership
                            </div>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">Manage corporate global entities and high-level organizational structure.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                            {TABS.map((t) => (
                                <button key={t} onClick={() => setActiveTab(t)}
                                    className={cn("rounded-md px-3 py-2 text-[13px] font-medium transition-colors whitespace-nowrap",
                                        activeTab === t ? "bg-[#1C4ED8] text-white" : "text-slate-500 hover:text-slate-700"
                                    )}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Metrics - Varies by tab */}
                {activeTab === "Tree View" && (
                    <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">TOTAL HEADCOUNT</p>
                            <p className="mt-3 text-[32px] font-bold text-slate-900">1,284</p>
                            <p className="mt-2 text-xs font-medium text-[#1C4ED8]">↑ +12% this month</p>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">BUSINESS UNITS</p>
                            <p className="mt-3 text-[32px] font-bold text-slate-900">6</p>
                            <p className="mt-2 text-xs text-slate-500">Global regions active</p>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">DEPARTMENTS</p>
                            <p className="mt-3 text-[32px] font-bold text-slate-900">24</p>
                            <p className="mt-2 text-xs text-slate-500">Cross-functional teams</p>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">ACTIVE VACANCIES</p>
                            <p className="mt-3 text-[32px] font-bold text-slate-900">42</p>
                            <span className="mt-2 inline-block rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">Priority hiring on</span>
                        </div>
                    </div>
                )}

                {activeTab === "List View (Hierarchy)" && (
                    <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">GLOBAL UNITS</p>
                            <p className="mt-3 text-[32px] font-bold text-slate-900">12</p>
                            <span className="mt-2 inline-block rounded-full bg-[#1C4ED8]/10 px-2.5 py-0.5 text-xs font-bold text-[#1C4ED8]">+2 this year</span>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">TOTAL HEADCOUNT</p>
                            <p className="mt-3 text-[32px] font-bold text-slate-900">4,820</p>
                            <span className="mt-2 inline-block rounded-full bg-[#1C4ED8]/10 px-2.5 py-0.5 text-xs font-bold text-[#1C4ED8]">↑ +4.2% Growth</span>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">DEPT. COVERAGE</p>
                            <p className="mt-3 text-[32px] font-bold text-slate-900">84</p>
                            <p className="mt-2 text-xs text-slate-500">Across all active units</p>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">COMPLIANCE SCORE</p>
                            <p className="mt-3 text-[32px] font-bold text-slate-900">98.4%</p>
                            <span className="mt-2 inline-block rounded-full bg-[#1C4ED8]/10 px-2.5 py-0.5 text-xs font-bold text-[#1C4ED8]">Elite & Landing</span>
                        </div>
                    </div>
                )}

                {activeTab === "Business Units Overview" && (
                    <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">GLOBAL UNITS</p>
                            <p className="mt-3 text-[32px] font-bold text-slate-900">12</p>
                            <span className="mt-2 inline-block rounded-full bg-[#1C4ED8]/10 px-2.5 py-0.5 text-xs font-bold text-[#1C4ED8]">+2 this year</span>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">TOTAL HEADCOUNT</p>
                            <p className="mt-3 text-[32px] font-bold text-slate-900">4,820</p>
                            <span className="mt-2 inline-block rounded-full bg-[#1C4ED8]/10 px-2.5 py-0.5 text-xs font-bold text-[#1C4ED8]">↑ +4.2% Growth</span>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">DEPT. COVERAGE</p>
                            <p className="mt-3 text-[32px] font-bold text-slate-900">84</p>
                            <p className="mt-2 text-xs text-slate-500">Across all active units</p>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">COMPLIANCE SCORE</p>
                            <p className="mt-3 text-[32px] font-bold text-slate-900">98.4%</p>
                            <span className="mt-2 inline-block rounded-full bg-[#1C4ED8]/10 px-2.5 py-0.5 text-xs font-bold text-[#1C4ED8]">Elite & Landing</span>
                        </div>
                    </div>
                )}

                {/* TREE VIEW */}
                {activeTab === "Tree View" && (
                    <div className={cn("grid gap-6", sidebarOpen ? "grid-cols-[1fr_360px]" : "grid-cols-1")}>
                        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-[#F8FAFC]">
                            <div
                                onMouseDown={onMouseDown}
                                className="relative h-[580px] cursor-grab select-none active:cursor-grabbing"
                            >
                                <div className="origin-top" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "50% 0" }}>
                                    <div className="flex flex-col items-center pt-12">
                                        {/* CEO Node */}
                                        <div className="flex items-center gap-3 rounded-xl border-2 border-[#1C4ED8] bg-white p-3.5 shadow-md w-72">
                                            <img src="https://i.pravatar.cc/80?u=marcus-sterling" alt="" className="h-10 w-10 rounded-lg object-cover" />
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Marcus Sterling</p>
                                                <p className="text-xs text-slate-500">Chief Executive Officer</p>
                                            </div>
                                        </div>

                                        <div className="h-8 w-px bg-slate-300" />
                                        <div className="relative flex w-full max-w-[600px] justify-center">
                                            <div className="h-px w-full bg-slate-300" />
                                        </div>

                                        {/* BU Nodes */}
                                        <div className="grid w-full max-w-[720px] grid-cols-3 gap-6 px-6">
                                            {units.map((u, idx) => {
                                                const isActive = selectedId === u.id;
                                                return (
                                                    <div key={u.id} className="flex flex-col items-center">
                                                        <div className="h-8 w-px bg-slate-300" />
                                                        <button
                                                            onClick={() => { setSelectedId(u.id); setSidebarOpen(true); }}
                                                            className={cn(
                                                                "flex w-full items-center gap-3 rounded-xl border bg-white p-3.5 text-left shadow-sm transition-all",
                                                                isActive ? "border-2 border-[#1C4ED8] shadow-blue-100 shadow-md" : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                                                            )}
                                                        >
                                                            <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg bg-[#F8FAFC]", idx === 1 && "bg-[#1C4ED8]/10")}>
                                                                {ICONS[u.iconKey ?? "eng"]}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-900">{u.name}</p>
                                                                <p className="text-xs text-slate-500">{u.type}</p>
                                                            </div>
                                                        </button>
                                                        {u.child && (
                                                            <>
                                                                <div className="h-6 w-px bg-slate-300" />
                                                                <div className="w-full rounded-xl border border-slate-200 bg-white p-3 shadow-sm text-center">
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
                                    <button onClick={zoomIn} className="rounded-md p-2 text-slate-600 hover:bg-slate-50"><ZoomIn className="h-4 w-4" /></button>
                                    <button onClick={zoomOut} className="rounded-md p-2 text-slate-600 hover:bg-slate-50"><ZoomOut className="h-4 w-4" /></button>
                                    <span className="px-2 text-xs font-medium text-slate-500">{Math.round(zoom * 100)}%</span>
                                    <div className="h-5 w-px bg-slate-200" />
                                    <button onClick={resetView} className="rounded-md p-2 text-slate-600 hover:bg-slate-50"><Maximize2 className="h-4 w-4" /></button>
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
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1C4ED8]">BUSINESS UNIT</span>
                                    <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-600 p-1"><X className="h-4 w-4" /></button>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">{selected.name}</h2>
                                <p className="text-sm text-slate-500">Head of Unit: {selected.headOfUnit ?? "N/A"}</p>

                                <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-slate-500">POSITION DETAILS</p>
                                <div className="mt-2 grid grid-cols-2 gap-3">
                                    <div className="rounded-lg border border-slate-100 bg-[#F8FAFC] p-3">
                                        <p className="text-[10px] font-semibold uppercase text-slate-400">Job Grade</p>
                                        <p className="mt-1 text-sm font-bold text-slate-900">{selected.jobGrade ?? "L8 - Executive"}</p>
                                    </div>
                                    <div className="rounded-lg border border-slate-100 bg-[#F8FAFC] p-3">
                                        <p className="text-[10px] font-semibold uppercase text-slate-400">Budget Cap</p>
                                        <p className="mt-1 text-sm font-bold text-slate-900">{selected.budgetCap ?? "$480k/yr"}</p>
                                    </div>
                                </div>

                                <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-slate-500">REPORTING LINE</p>
                                <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-100 p-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8FAFC]">
                                        <ArrowUp className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Marcus Sterling</p>
                                        <p className="text-xs text-slate-500">Chief Executive Officer</p>
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center justify-between">
                                    <button onClick={() => setEditOpen(true)} className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50">
                                        <Pencil className="h-4 w-4" /> Edit
                                    </button>
                                    <button onClick={() => setDeleteOpen(true)} className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" /> Remove
                                    </button>
                                </div>

                                <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-slate-500">UNIT LEAD</p>
                                <div className="mt-2 flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-[#F8FAFC]">
                                    <div className="flex items-center gap-3">
                                        <img src={selected.headAvatar ?? "https://i.pravatar.cc/80?u=default"} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{selected.headOfUnit ?? "Elena Vance"}</p>
                                            <p className="text-xs text-slate-500">Joined Jan 2021</p>
                                        </div>
                                    </div>
                                    <button className="rounded-md border border-slate-200 p-2 text-slate-500 hover:bg-slate-50">
                                        <Mail className="h-4 w-4" />
                                    </button>
                                </div>

                                <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-slate-500">OPEN ROLES IN UNIT ({selected.openRoles ?? 0})</p>
                                <div className="mt-2 space-y-2">
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">Operations Manager</p>
                                            <p className="text-xs text-slate-500">Department: Supply Chain</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">Facilities Lead</p>
                                            <p className="text-xs text-slate-500">Department: Infrastructure</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-400" />
                                    </div>
                                </div>

                                <div className="mt-auto pt-5">
                                    <button className="w-full py-2.5 bg-[#1C4ED8] hover:bg-[#1a3eb8] text-white rounded-lg text-sm font-semibold transition-colors">
                                        View Unit Strategy &rarr;
                                    </button>
                                </div>
                            </aside>
                        )}
                    </div>
                )}

                {/* LIST VIEW */}
                {activeTab === "List View (Hierarchy)" && (
                    <div className="space-y-5">
                        {/* Filter bar */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-50">
                                    <Filter className="w-4 h-4" /> ALL LEVELS
                                </button>
                                <button className="px-3 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-[13px] font-medium text-slate-500 hover:bg-slate-50">
                                    DIRECTORATE
                                </button>
                                <button className="px-3 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-[13px] font-medium text-slate-500 hover:bg-slate-50">
                                    MANAGEMENT
                                </button>
                            </div>
                            <button className="flex items-center gap-2 text-[12px] font-bold text-slate-500 hover:text-slate-700">
                                <Download className="w-4 h-4" /> EXPORT CSV
                            </button>
                        </div>

                        {/* Table */}
                        <div className="rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead className="bg-[#F8FAFC]">
                                        <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                            <th className="px-5 py-3">Name</th>
                                            <th className="px-5 py-3">Role</th>
                                            <th className="px-5 py-3">Department</th>
                                            <th className="px-5 py-3">Reporting Manager</th>
                                            <th className="px-5 py-3">Location</th>
                                            <th className="px-5 py-3 w-10" />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 bg-white">
                                        {[
                                            { name: "Eleanor Vance", role: "Chief Executive Officer", dept: "EXECUTIVE OFFICE", level: "L1+ Executive", manager: "—", location: "London, UK", avatar: "EV", color: "bg-amber-600" },
                                            { name: "Sarah Drummand", role: "VP of Operations", dept: "OPERATIONS", level: "L2+ Leadership", manager: "Eleanor Vance", location: "London, UK", avatar: "SD", color: "bg-rose-600" },
                                            { name: "Julian Rivers", role: "Strategic Planning Lead", dept: "STRATEGY", level: "L3+ Management", manager: "Sarah Drummand", location: "New York, US", avatar: "JR", color: "bg-blue-600" },
                                            { name: "Marcus Chen", role: "Chief Technology Officer", dept: "ENGINEERING", level: "L2+ Leadership", manager: "Eleanor Vance", location: "Singapore", avatar: "MC", color: "bg-violet-600" },
                                            { name: "Amara Okafor", role: "Head of Architecture", dept: "ENGINEERING", level: "L3+ Management", manager: "Marcus Chen", location: "Remote, Global", avatar: "AO", color: "bg-emerald-600" },
                                        ].map((row, i) => (
                                            <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0", row.color)}>
                                                            {row.avatar}
                                                        </div>
                                                        <div>
                                                            <p className="text-[13px] font-semibold text-slate-900">{row.name}</p>
                                                            <p className="text-[10px] text-slate-400">{row.level}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-[13px] text-slate-600">{row.role}</td>
                                                <td className="px-5 py-4">
                                                    <span className="text-[10px] font-bold uppercase text-[#1C4ED8] bg-blue-50 px-2 py-0.5 rounded">{row.dept}</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600">
                                                            {row.manager?.[0] ?? "—"}
                                                        </div>
                                                        <span className="text-[13px] text-slate-600">{row.manager}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-[13px] text-slate-600 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3 text-slate-400" />{row.location}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <button className="p-1 text-slate-400 hover:text-slate-600">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[13px] text-slate-500">
                                Showing 124 of 1,284 records
                            </span>
                            <div className="flex items-center gap-1">
                                <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600">
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                                <button className="w-8 h-8 flex items-center justify-center bg-[#1C4ED8] text-white rounded-md text-[13px] font-medium">1</button>
                                <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-md text-[13px] text-slate-600">2</button>
                                <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-md text-[13px] text-slate-600">3</button>
                                <span className="px-1 text-slate-400 text-[13px]">...</span>
                                <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-md text-[13px] text-slate-600">11</button>
                                <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600">
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Organizational Health Score */}
                        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">ORGANIZATIONAL HEALTH SCORE</p>
                                    <p className="text-[13px] text-slate-500 mb-3">
                                        Our architectural curation engine suggests a 14% optimization potential in the Engineering department by flattening reporting structures in L4 segments. This could improve communication velocity by approximately 22%.
                                    </p>
                                    <button className="text-[12px] font-bold text-[#1C4ED8] hover:underline flex items-center gap-1">
                                        REVIEW DEEP INSIGHTS <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-center">
                                    <div className="w-28 h-28 rounded-full border-4 border-[#1C4ED8] flex items-center justify-center">
                                        <span className="text-[28px] font-bold text-[#1C4ED8]">88%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* BUSINESS UNITS OVERVIEW */}
                {activeTab === "Business Units Overview" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            { name: "North America", hq: "San Francisco, CA", head: "Elena Vance", headRole: "President", headAvatar: "https://i.pravatar.cc/80?u=elena", headCount: "2,400", growth: "+12%", revenue: "$48M", deptCount: 18, color: "bg-blue-600" },
                            { name: "Europe & Middle East", hq: "London, UK", head: "Marcus Chen", headRole: "VP EMEA", headAvatar: "https://i.pravatar.cc/80?u=marcus", headCount: "1,200", growth: "+8%", revenue: "$22M", deptCount: 12, color: "bg-violet-600" },
                            { name: "Asia Pacific", hq: "Singapore", head: "Amara Okafor", headRole: "VP APAC", headAvatar: "https://i.pravatar.cc/80?u=amara", headCount: "980", growth: "+22%", revenue: "$18M", deptCount: 10, color: "bg-emerald-600" },
                            { name: "Latin America", hq: "Mexico City", head: "James Morrow", headRole: "VP LATAM", headAvatar: "https://i.pravatar.cc/80?u=james", headCount: "640", growth: "+6%", revenue: "$9M", deptCount: 8, color: "bg-amber-600" },
                            { name: "Africa", hq: "Lagos, Nigeria", head: "Sarah Drummand", headRole: "VP Africa", headAvatar: "https://i.pravatar.cc/80?u=sarah", headCount: "420", growth: "+15%", revenue: "$5M", deptCount: 6, color: "bg-rose-600" },
                            { name: "Remote / Global", hq: "Distributed", head: "Julian Rivers", headRole: "Head of Remote", headAvatar: "https://i.pravatar.cc/80?u=julian", headCount: "180", growth: "+30%", revenue: "$2M", deptCount: 4, color: "bg-cyan-600" },
                        ].map((bu, i) => (
                            <div key={i} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold", bu.color)}>
                                            {bu.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{bu.name}</p>
                                            <p className="text-[11px] text-slate-500">{bu.hq}</p>
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-bold text-[#1C4ED8] bg-blue-50 px-2 py-0.5 rounded-full">{bu.growth}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <div className="text-center">
                                        <p className="text-[11px] text-slate-400 font-bold uppercase">Headcount</p>
                                        <p className="text-sm font-bold text-slate-900">{bu.headCount}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[11px] text-slate-400 font-bold uppercase">Revenue</p>
                                        <p className="text-sm font-bold text-slate-900">{bu.revenue}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[11px] text-slate-400 font-bold uppercase">Depts</p>
                                        <p className="text-sm font-bold text-slate-900">{bu.deptCount}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg">
                                    <img src={bu.headAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                                    <div>
                                        <p className="text-[13px] font-semibold text-slate-900">{bu.head}</p>
                                        <p className="text-[11px] text-slate-500">{bu.headRole}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Modal */}
                {addOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-900">Add Business Unit</h3>
                                <button onClick={() => setAddOpen(false)} className="p-1 text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[12px] font-bold uppercase tracking-wider text-slate-500 mb-1">Unit Name</label>
                                    <input className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-[#1C4ED8]" placeholder="e.g. Engineering" />
                                </div>
                                <div>
                                    <label className="block text-[12px] font-bold uppercase tracking-wider text-slate-500 mb-1">Type</label>
                                    <input className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-[#1C4ED8]" placeholder="e.g. Business Unit" />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button onClick={() => setAddOpen(false)} className="px-4 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
                                    <button onClick={() => handleAdd("New Unit", "Business Unit")} className="px-4 py-2 bg-[#1C4ED8] text-white text-[13px] font-bold rounded-lg hover:bg-[#1a3eb8]">Add Unit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {editOpen && selected && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-900">Edit {selected.name}</h3>
                                <button onClick={() => setEditOpen(false)} className="p-1 text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[12px] font-bold uppercase tracking-wider text-slate-500 mb-1">Unit Name</label>
                                    <input defaultValue={selected.name} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-[#1C4ED8]" />
                                </div>
                                <div>
                                    <label className="block text-[12px] font-bold uppercase tracking-wider text-slate-500 mb-1">Type</label>
                                    <input defaultValue={selected.type} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-[#1C4ED8]" />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button onClick={() => setEditOpen(false)} className="px-4 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
                                    <button onClick={() => handleEdit(selected.name, selected.type)} className="px-4 py-2 bg-[#1C4ED8] text-white text-[13px] font-bold rounded-lg hover:bg-[#1a3eb8]">Save Changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Modal */}
                {deleteOpen && selected && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Delete {selected.name}?</h3>
                                    <p className="text-sm text-slate-500">This action cannot be undone.</p>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button onClick={() => setDeleteOpen(false)} className="px-4 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
                                <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white text-[13px] font-bold rounded-lg hover:bg-red-700">Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
