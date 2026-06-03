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
} from "lucide-react";

import { departmentApi } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────
type Department = {
    id: string;
    name: string;
    type: string;           // "Business Unit" | "Department" | "Team"
    iconKey?: "eng" | "ops" | "sales";
    child?: {
        name: string;
        members: string;    // e.g. "12 Members"
    };
    headOfUnit?: string;
    headAvatar?: string;
    jobGrade?: string;
    budgetCap?: string;
    memberCount?: number;
    openRoles?: number;
};

// ─── Mock fallback data ───────────────────────────────────────────────────────
const MOCK_DEPARTMENTS: Department[] = [
    {
        id: "mock-1",
        name: "Engineering",
        type: "Business Unit",
        iconKey: "eng",
        child: { name: "Platform Team", members: "14 Members" },
        headOfUnit: "Elena Vance",
        headAvatar: "https://i.pravatar.cc/80?u=elena",
        jobGrade: "L8 - Executive",
        budgetCap: "$480k/yr",
        memberCount: 42,
        openRoles: 5,
    },
    {
        id: "mock-2",
        name: "Operations",
        type: "Department",
        iconKey: "ops",
        child: { name: "Logistics", members: "8 Members" },
        headOfUnit: "James Morrow",
        headAvatar: "https://i.pravatar.cc/80?u=james",
        jobGrade: "L7 - Director",
        budgetCap: "$310k/yr",
        memberCount: 28,
        openRoles: 3,
    },
    {
        id: "mock-3",
        name: "Sales",
        type: "Business Unit",
        iconKey: "sales",
        child: { name: "Growth Squad", members: "10 Members" },
        headOfUnit: "Priya Okafor",
        headAvatar: "https://i.pravatar.cc/80?u=priya",
        jobGrade: "L7 - Director",
        budgetCap: "$220k/yr",
        memberCount: 19,
        openRoles: 2,
    },
    {
        id: "mock-4",
        name: "Product",
        type: "Department",
        iconKey: "eng",
        child: { name: "Design & UX", members: "6 Members" },
        headOfUnit: "Clara Nwosu",
        headAvatar: "https://i.pravatar.cc/80?u=clara",
        jobGrade: "L7 - Director",
        budgetCap: "$260k/yr",
        memberCount: 15,
        openRoles: 1,
    },
    {
        id: "mock-5",
        name: "Finance",
        type: "Department",
        iconKey: "ops",
        child: { name: "Treasury", members: "4 Members" },
        headOfUnit: "David Chen",
        headAvatar: "https://i.pravatar.cc/80?u=david",
        jobGrade: "L8 - Executive",
        budgetCap: "$180k/yr",
        memberCount: 11,
        openRoles: 0,
    },
    {
        id: "mock-6",
        name: "Marketing",
        type: "Business Unit",
        iconKey: "sales",
        child: { name: "Brand & Content", members: "9 Members" },
        headOfUnit: "Sofia Adebayo",
        headAvatar: "https://i.pravatar.cc/80?u=sofia",
        jobGrade: "L7 - Director",
        budgetCap: "$340k/yr",
        memberCount: 22,
        openRoles: 4,
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getIconKey = (name: string): "eng" | "ops" | "sales" => {
    if (name.toLowerCase().includes("eng")) return "eng";
    if (name.toLowerCase().includes("ops")) return "ops";
    return "sales";
};

const ICONS = {
    eng: <SlidersHorizontal className="h-4 w-4 text-slate-600" />,
    ops: <Landmark className="h-4 w-4 text-indigo-600" />,
    sales: <Wallet className="h-4 w-4 text-slate-600" />,
};

const TABS = ["Tree View", "List View (Hierarchy)", "Business Units Overview"];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OrgStructureScreen() {
    const queryClient = useQueryClient();

    const {
        data: apiData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["department-tree"],
        queryFn: () => departmentApi.getTree(),
        // Don't retry more than once so the mock kicks in quickly on failure
        retry: 1,
    });

    // ── Transform API → internal Department shape ──────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformDepartments = (depts: Record<string, any>[]): Department[] =>
        depts.map((dept) => ({
            id: dept.id,
            name: dept.name,
            // API stores type in "description"; fall back gracefully
            type: dept.type ?? dept.description ?? "Business Unit",
            iconKey: getIconKey(dept.name),
            child: dept.child
                ? {
                    name: dept.child.name,
                    members: `${dept.child.memberCount ?? 0} Members`,
                }
                : undefined,
            headOfUnit: dept.headOfUnit,
            headAvatar: dept.headAvatar,
            jobGrade: dept.jobGrade ?? "L8 - Executive",
            budgetCap: dept.budgetCap ?? "$480k/yr",
            memberCount: dept.memberCount,
            openRoles: dept.openRoles,
        }));

    // ── Resolve the list: real data → mock on error/empty ─────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const apiRows = Array.isArray(apiData) ? (apiData as Record<string, any>[]) : [];
    const units: Department[] = (() => {
        if (isLoading) return [];
        if (isError || apiRows.length === 0) return MOCK_DEPARTMENTS;
        return transformDepartments(apiRows);
    })();

    const isMockData = isError || apiRows.length === 0;

    // ── UI state ───────────────────────────────────────────────────────────
    const [selectedId, setSelectedId] = useState<string>("");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("Tree View");

    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    // Zoom + pan
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const dragRef = useRef<{
        startX: number;
        startY: number;
        baseX: number;
        baseY: number;
    } | null>(null);

    const selected = units.find((u) => u.id === selectedId) ?? units[0];

    // ── Pan handlers ───────────────────────────────────────────────────────
    const onMouseDown = (e: React.MouseEvent) => {
        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            baseX: pan.x,
            baseY: pan.y,
        };
    };

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!dragRef.current) return;
            setPan({
                x: dragRef.current.baseX + (e.clientX - dragRef.current.startX),
                y: dragRef.current.baseY + (e.clientY - dragRef.current.startY),
            });
        };
        const onUp = () => {
            dragRef.current = null;
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, []);

    const resetView = () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    };
    const zoomIn = () => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(2)));
    const zoomOut = () => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)));

    // ── Mutations ──────────────────────────────────────────────────────────
    // FIX: API expects { name, description, parentDepartmentId?, headEmployeeId? }
    // We map the UI's "type" field into "description" on the way out.
    const addMutation = useMutation({
        mutationFn: (newDept: { name: string; type: string }) =>
            departmentApi.create({
                name: newDept.name,
                description: newDept.type, // "type" → API "description"
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["department-tree"] });
        },
    });

    const editMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: { name: string; type: string };
        }) =>
            departmentApi.update(id, {
                name: data.name,
                description: data.type, // "type" → API "description"
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["department-tree"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => departmentApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["department-tree"] });
        },
    });

    const handleAdd = (name: string, type: string) => {
        addMutation.mutate({ name, type });
        setAddOpen(false);
    };
    const handleEdit = (name: string, type: string) => {
        if (!selected) return;
        editMutation.mutate({ id: selected.id, data: { name, type } });
        setEditOpen(false);
    };
    const handleDelete = () => {
        if (!selected) return;
        deleteMutation.mutate(selected.id);
        setDeleteOpen(false);
        setSidebarOpen(false);
    };

    // ── Derived metrics ────────────────────────────────────────────────────
    const totalHeadcount = units.reduce((sum, u) => sum + (u.memberCount ?? 0), 0);
    const totalBusinessUnits = units.length;
    const totalDepartments = units.filter((u) => u.type === "Department").length;
    const totalVacancies = units.reduce((sum, u) => sum + (u.openRoles ?? 0), 0);

    // ── Loading state ──────────────────────────────────────────────────────
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

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-white p-8 font-sans text-slate-900">
            <div className="mx-auto max-w-[1200px]">

                {/* Mock data banner */}
                {isMockData && (
                    <div className="mb-6 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-500" />
                        <span>
                            Could not reach the API — showing <strong>demo data</strong>. Live data will load automatically once the connection is restored.
                        </span>
                    </div>
                )}

                {/* Header */}
                <div className="mb-8 flex items-start justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Org Structure</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Institutional hierarchy and operational layout
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setAddOpen(true)}
                            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                        >
                            <Plus className="h-4 w-4" /> Add Department
                        </button>
                        <div className="flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                            {TABS.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setActiveTab(t)}
                                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === t
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="mb-8 grid grid-cols-4 gap-5">
                    {[
                        {
                            l: "TOTAL HEADCOUNT",
                            v: totalHeadcount.toLocaleString(),
                            s: "+12% this month",
                            trend: true,
                        },
                        {
                            l: "BUSINESS UNITS",
                            v: totalBusinessUnits.toString(),
                            s: "Global regions active",
                        },
                        {
                            l: "DEPARTMENTS",
                            v: totalDepartments.toString(),
                            s: "Cross-functional teams",
                        },
                        {
                            l: "ACTIVE VACANCIES",
                            v: totalVacancies.toString(),
                            s: "Priority hiring on",
                            pill: true,
                        },
                    ].map((m) => (
                        <div
                            key={m.l}
                            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <p className="text-[11px] font-semibold tracking-wider text-slate-500">
                                {m.l}
                            </p>
                            <p className="mt-3 text-4xl font-bold text-slate-900">{m.v}</p>
                            {m.trend ? (
                                <p className="mt-3 text-xs font-medium text-indigo-600">↗ {m.s}</p>
                            ) : m.pill ? (
                                <span className="mt-3 inline-block rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700">
                                    {m.s}
                                </span>
                            ) : (
                                <p className="mt-3 text-xs text-slate-500">{m.s}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* ── Tree View ─────────────────────────────────────────────── */}
                {activeTab === "Tree View" && (
                    <div
                        className={`grid gap-6 ${sidebarOpen ? "grid-cols-[1fr_380px]" : "grid-cols-1"
                            }`}
                    >
                        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60">
                            <div
                                onMouseDown={onMouseDown}
                                className="relative h-[560px] cursor-grab select-none active:cursor-grabbing"
                                style={{
                                    backgroundImage:
                                        "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
                                    backgroundSize: "20px 20px",
                                }}
                            >
                                <div
                                    className="origin-top"
                                    style={{
                                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                                        transformOrigin: "50% 0",
                                    }}
                                >
                                    <div className="flex flex-col items-center pt-16">
                                        {/* CEO node */}
                                        <div className="flex w-64 items-center gap-3 rounded-lg border-2 border-indigo-500 bg-white p-3 shadow-sm">
                                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-200">
                                                <img
                                                    src="https://i.pravatar.cc/80?u=marcus"
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">
                                                    Marcus Sterling
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Chief Executive Officer
                                                </p>
                                            </div>
                                        </div>
                                        <div className="h-8 w-px bg-slate-300" />
                                        <div className="h-px w-2/3 bg-slate-300" />
                                        <div className="grid w-full grid-cols-3 gap-8 px-8">
                                            {units.map((u) => {
                                                const isActive = selectedId === u.id;
                                                return (
                                                    <div
                                                        key={u.id}
                                                        className="flex flex-col items-center"
                                                    >
                                                        <div className="h-8 w-px bg-slate-300" />
                                                        <button
                                                            onClick={() => {
                                                                setSelectedId(u.id);
                                                                setSidebarOpen(true);
                                                            }}
                                                            className={`flex w-full items-center gap-3 rounded-lg border bg-white p-3 text-left shadow-sm transition-colors ${isActive
                                                                    ? "border-2 border-indigo-500"
                                                                    : "border-slate-200 hover:border-slate-300"
                                                                }`}
                                                        >
                                                            <div
                                                                className={`flex h-9 w-9 items-center justify-center rounded-full ${isActive
                                                                        ? "bg-indigo-50"
                                                                        : "bg-slate-100"
                                                                    }`}
                                                            >
                                                                {ICONS[u.iconKey ?? getIconKey(u.name)]}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold text-slate-900">
                                                                    {u.name}
                                                                </p>
                                                                <p className="text-xs text-slate-500">
                                                                    {u.type}
                                                                </p>
                                                            </div>
                                                        </button>
                                                        {u.child && (
                                                            <>
                                                                <div className="h-8 w-px bg-slate-300" />
                                                                <div className="w-full rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                                                                    <p className="text-sm font-semibold text-slate-900">
                                                                        {u.child.name}
                                                                    </p>
                                                                    <p className="text-xs text-slate-500">
                                                                        {u.child.members}
                                                                    </p>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Floating controls */}
                                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                                    <button
                                        onClick={zoomIn}
                                        title="Zoom in"
                                        className="rounded-md p-2 text-slate-600 hover:bg-slate-50"
                                    >
                                        <ZoomIn className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={zoomOut}
                                        title="Zoom out"
                                        className="rounded-md p-2 text-slate-600 hover:bg-slate-50"
                                    >
                                        <ZoomOut className="h-4 w-4" />
                                    </button>
                                    <span className="px-2 text-xs font-medium text-slate-500">
                                        {Math.round(zoom * 100)}%
                                    </span>
                                    <div className="h-5 w-px bg-slate-200" />
                                    <button
                                        onClick={resetView}
                                        title="Reset view"
                                        className="rounded-md p-2 text-slate-600 hover:bg-slate-50"
                                    >
                                        <Maximize2 className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-md bg-white/90 px-2.5 py-1.5 text-[11px] font-medium text-slate-500 shadow-sm">
                                    <Move className="h-3.5 w-3.5" /> Drag to pan
                                </div>
                            </div>
                        </div>

                        {sidebarOpen && selected && (
                            <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                                        {selected.type}
                                    </span>
                                    <button
                                        onClick={() => setSidebarOpen(false)}
                                        className="text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <h2 className="mt-4 text-2xl font-bold text-slate-900">
                                    {selected.name}
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Head of Unit: {selected.headOfUnit ?? "N/A"}
                                </p>

                                <p className="mt-6 text-[11px] font-semibold tracking-wider text-slate-500">
                                    POSITION DETAILS
                                </p>
                                <div className="mt-3 grid grid-cols-2 gap-3">
                                    <div className="rounded-lg border border-slate-200 p-3">
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                            Job Grade
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-slate-900">
                                            {selected.jobGrade ?? "L8 - Executive"}
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-slate-200 p-3">
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                            Budget Cap
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-slate-900">
                                            {selected.budgetCap ?? "$480k/yr"}
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-6 text-[11px] font-semibold tracking-wider text-slate-500">
                                    REPORTING LINE
                                </p>
                                <div className="mt-3 flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                                        <ArrowUp className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            Marcus Sterling
                                        </p>
                                        <p className="text-xs text-slate-500">Chief Executive Officer</p>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between">
                                    <p className="text-[11px] font-semibold tracking-wider text-slate-500">
                                        CURRENT OCCUPANT
                                    </p>
                                    <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-medium text-sky-700">
                                        Active
                                    </span>
                                </div>
                                <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-200 p-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={
                                                selected.headAvatar ??
                                                "https://i.pravatar.cc/80?u=elena"
                                            }
                                            alt=""
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {selected.headOfUnit ?? "Elena Vance"}
                                            </p>
                                            <p className="text-xs text-slate-500">Joined Jan 2021</p>
                                        </div>
                                    </div>
                                    <button className="rounded-md border border-slate-200 p-2 text-slate-500 hover:bg-slate-50">
                                        <Mail className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="mt-6 flex gap-2">
                                    <button
                                        onClick={() => setEditOpen(true)}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        <Pencil className="h-4 w-4" /> Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteOpen(true)}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-rose-200 px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                                    >
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

                {/* ── List View ─────────────────────────────────────────────── */}
                {activeTab === "List View (Hierarchy)" && (
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 border-b border-slate-200 px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            <div>Unit / Department</div>
                            <div>Head</div>
                            <div>Members</div>
                            <div>Status</div>
                            <div />
                        </div>
                        <div className="divide-y divide-slate-100">
                            {/* Executive root row */}
                            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] items-center gap-4 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="https://i.pravatar.cc/40?u=marcus"
                                        className="h-8 w-8 rounded-full object-cover"
                                        alt=""
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            Executive Office
                                        </p>
                                        <p className="text-xs text-slate-500">Top level</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-700">Marcus Sterling</p>
                                <p className="text-sm text-slate-700">{totalHeadcount}</p>
                                <span className="w-fit rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700">
                                    Active
                                </span>
                                <button className="justify-self-end text-slate-400 hover:text-slate-600">
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>

                            {units.map((u) => (
                                <div key={u.id}>
                                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] items-center gap-4 px-6 py-4 pl-10">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                                                {ICONS[u.iconKey ?? getIconKey(u.name)]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {u.name}
                                                </p>
                                                <p className="text-xs text-slate-500">{u.type}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-700">
                                            {u.headOfUnit ?? "—"}
                                        </p>
                                        <p className="text-sm text-slate-700">
                                            {u.memberCount ?? 0}
                                        </p>
                                        <span className="w-fit rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700">
                                            Active
                                        </span>
                                        <button
                                            onClick={() => {
                                                setSelectedId(u.id);
                                                setActiveTab("Tree View");
                                                setSidebarOpen(true);
                                            }}
                                            className="justify-self-end text-slate-400 hover:text-slate-600"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                    {u.child && (
                                        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] items-center gap-4 bg-slate-50/60 px-6 py-3 pl-16">
                                            <div>
                                                <p className="text-sm font-medium text-slate-800">
                                                    {u.child.name}
                                                </p>
                                                <p className="text-xs text-slate-500">Department</p>
                                            </div>
                                            <p className="text-sm text-slate-600">—</p>
                                            <p className="text-sm text-slate-600">
                                                {u.child.members}
                                            </p>
                                            <span className="w-fit rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-medium text-sky-700">
                                                Open roles
                                            </span>
                                            <button className="justify-self-end text-slate-400 hover:text-slate-600">
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Business Units Overview ───────────────────────────────── */}
                {activeTab === "Business Units Overview" && (
                    <div className="grid grid-cols-3 gap-5">
                        {units.map((u) => (
                            <div
                                key={u.id}
                                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                                        {ICONS[u.iconKey ?? getIconKey(u.name)]}
                                    </div>
                                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700">
                                        Active
                                    </span>
                                </div>
                                <h3 className="mt-4 text-lg font-bold text-slate-900">{u.name}</h3>
                                <p className="text-xs text-slate-500">
                                    Head: {u.headOfUnit ?? "N/A"}
                                </p>
                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <div className="rounded-lg border border-slate-200 p-3">
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                            Members
                                        </p>
                                        <p className="mt-1 text-lg font-bold text-slate-900">
                                            {u.memberCount ?? 0}
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-slate-200 p-3">
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                            Budget
                                        </p>
                                        <p className="mt-1 text-lg font-bold text-slate-900">
                                            {u.budgetCap ?? "$480k/yr"}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
                                    <p className="text-xs font-medium text-slate-600">Open roles</p>
                                    <span className="text-sm font-semibold text-indigo-600">
                                        {u.openRoles ?? 0}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedId(u.id);
                                        setActiveTab("Tree View");
                                        setSidebarOpen(true);
                                    }}
                                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    View unit <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Modals ──────────────────────────────────────────────────────── */}
            {addOpen && (
                <DepartmentModal
                    title="Add Department"
                    subtitle="Create a new business unit or department."
                    submitLabel="Create Department"
                    onClose={() => setAddOpen(false)}
                    onSubmit={handleAdd}
                />
            )}
            {editOpen && selected && (
                <DepartmentModal
                    title="Edit Department"
                    subtitle={`Update details for ${selected.name}.`}
                    submitLabel="Save Changes"
                    initialName={selected.name}
                    initialType={selected.type}
                    onClose={() => setEditOpen(false)}
                    onSubmit={handleEdit}
                />
            )}
            {deleteOpen && selected && (
                <ConfirmDeleteModal
                    name={selected.name}
                    onClose={() => setDeleteOpen(false)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
}

// ─── DepartmentModal ──────────────────────────────────────────────────────────
function DepartmentModal(props: {
    title: string;
    subtitle: string;
    submitLabel: string;
    initialName?: string;
    initialType?: string;
    onClose: () => void;
    onSubmit: (name: string, type: string) => void;
}) {
    const [name, setName] = useState(props.initialName ?? "");
    const [type, setType] = useState(props.initialType ?? "Business Unit");
    const [head, setHead] = useState("");

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
            onClick={props.onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
            >
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">{props.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">{props.subtitle}</p>
                    </div>
                    <button onClick={props.onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="mt-5 space-y-4">
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Name
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Marketing"
                            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Type
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        >
                            <option>Business Unit</option>
                            <option>Department</option>
                            <option>Team</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Head of Unit
                        </label>
                        <input
                            value={head}
                            onChange={(e) => setHead(e.target.value)}
                            placeholder="e.g. Elena Vance"
                            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={props.onClose}
                        className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={!name.trim()}
                        onClick={() => props.onSubmit(name.trim(), type)}
                        className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-indigo-300"
                    >
                        {props.submitLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── ConfirmDeleteModal ───────────────────────────────────────────────────────
function ConfirmDeleteModal(props: {
    name: string;
    onClose: () => void;
    onConfirm: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
            onClick={props.onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
            >
                <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-rose-100">
                        <AlertTriangle className="h-5 w-5 text-rose-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900">
                            Delete {props.name}?
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            This will permanently remove the department and unassign its members.
                            This action cannot be undone.
                        </p>
                    </div>
                    <button onClick={props.onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={props.onClose}
                        className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={props.onConfirm}
                        className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
                    >
                        Delete Department
                    </button>
                </div>
            </div>
        </div>
    );
}