"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Briefcase,
  ChevronDown,
  Clock,
  History,
  LogOut,
  Menu, // <-- Added Menu icon for mobile toggle
  RefreshCw,
  Search,
  Settings,
  Sun,
  UserPlus,
  Users,
  Wallet,
  X, // <-- Added X icon for closing the sidebar
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// 1. Import your custom icons from the specific file path
import {
  DashboardOverviewIcon,
  HRISIcon,
  RecruitmentIcon,
  OnboardingIcon,
  PayrollIcon,
  LeaveManagementIcon,
  TimeAndAttendanceIcon,
} from "@/components/design-system/icons/dashboard-sidebar_icons";

import { BrandLogo } from "@/components/shared/brand-logo";
import { getSidebarNav } from "@/config/navigation";
import { routes } from "@/config/routes";
import type { UserRole } from "@/config/mvp";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  "layout-dashboard": DashboardOverviewIcon,
  "hris": HRISIcon,
  "recruitment": RecruitmentIcon,
  "onboarding": OnboardingIcon,
  "payroll": PayrollIcon,
  "leave-management": LeaveManagementIcon,
  "time-attendance": TimeAndAttendanceIcon,
  users: Users,
  user: Users,
  briefcase: Briefcase,
  "user-plus": UserPlus,
  wallet: Wallet,
  calendar: Clock,
  clock: Clock,
};

type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const role: UserRole = user?.role ?? "hr_admin";
  const navItems = getSidebarNav(role);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ HRIS: true });
  const [profileOpen, setProfileOpen] = useState(false);

  // State to manage mobile sidebar visibility
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State to toggle between icon-only mode and full mode on desktop
  const [isCollapsed, setIsCollapsed] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const displayName = user?.name;

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace(routes.auth.login);
    }
  }, [isHydrated, isAuthenticated, router]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    clearSession();
    window.location.href = routes.auth.loginPassword;
  };

  const navLinks = (
    <nav className={cn("space-y-0.5 py-2", isCollapsed ? "px-2" : "px-3")}>
      {navItems.map((item) => {
        const Icon = iconMap[item.icon];
        const hasChildren = Boolean(item.children?.length);
        const isOpen = openGroups[item.title];
        const isActive =
          item.href &&
          (pathname === item.href || pathname.startsWith(`${item.href}/`));

        // 1. GROUP BUTTON (e.g., HRIS dropdown toggle)
        if (hasChildren) {
          return (
            <div key={item.title}>
              <button
                type="button"
                onClick={() => {
                  if (isCollapsed) setIsCollapsed(false);
                  setOpenGroups((g) => ({ ...g, [item.title]: !g[item.title] }));
                }}
                className={cn(
                  "flex w-full items-center rounded-lg py-2.5 text-[14px] font-medium text-grey-700 transition-colors",
                  "hover:bg-grey-100",
                  // Added Focus State here:
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grey-300 focus-visible:bg-grey-100",
                  isCollapsed ? "justify-center px-0" : "gap-3 px-3"
                )}
                title={isCollapsed ? item.title : undefined}
              >
                {Icon ? <Icon className="size-[18px] text-grey-500 shrink-0" strokeWidth={1.75} /> : null}

                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.title}</span>
                    <ChevronDown
                      className={cn("size-4 text-grey-400 transition-transform", isOpen && "rotate-180")}
                    />
                  </>
                )}
              </button>

              {isOpen && !isCollapsed && (
                <div className="ml-2 space-y-0.5 border-l border-grey-200 pl-2 mt-1">
                  {/* 2. CHILD LINKS (e.g., Employees Directory) */}
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "block rounded-lg py-2 pr-3 pl-6 text-[13px] text-grey-600 transition-colors",
                        "hover:bg-grey-50 hover:text-grey-900",
                        // Added Focus State here:
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grey-300 focus-visible:bg-grey-100",
                        pathname === child.href && "bg-grey-100 font-medium text-grey-900"
                      )}
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        }

        // 3. STANDARD LINKS (e.g., Dashboard, Recruitment)
        return (
          <Link
            key={item.title}
            href={item.comingSoon ? "#" : (item.href ?? "#")}
            title={isCollapsed ? item.title : undefined}
            className={cn(
              "relative flex items-center rounded-lg py-2.5 text-[14px] font-medium transition-colors",
              isCollapsed ? "justify-center px-0" : "gap-3 px-3",
              isActive
                ? "bg-grey-100 text-grey-900"
                : "text-grey-700 hover:bg-grey-50",
              // Added Focus State here:
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grey-300 focus-visible:bg-grey-100",
              item.comingSoon && "pointer-events-none opacity-50"
            )}
          >
            {isActive && !isCollapsed && (
              <span className="absolute top-1/2 left-0 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-grey-800" />
            )}
            {Icon && <Icon className="size-[18px] text-grey-500 shrink-0" strokeWidth={1.75} />}

            {!isCollapsed && <span>{item.title}</span>}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-grey-50">

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-grey-200 bg-white transition-all duration-300 ease-in-out lg:static lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full", // Mobile slide-in
          isCollapsed ? "w-[80px]" : "w-[248px]" // Desktop collapse toggle
        )}
      >
        <div className={cn("flex h-16 items-center", isCollapsed ? "justify-center px-0" : "justify-between px-5")}>
          {/* Only show logo if not collapsed, or show a small icon version if collapsed */}
          {!isCollapsed ? (
            <BrandLogo href={routes.app.dashboard} />
          ) : (
            <div className="size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              {/* Fallback small logo when collapsed */}
              360
            </div>
          )}

          {/* Close button for Mobile only */}
          <button
            type="button"
            className="lg:hidden p-2 text-grey-500 hover:bg-grey-100 rounded-md"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {navLinks}
        </div>

        {/* Desktop Collapse Toggle Button (Optional, usually placed at bottom) */}
        <div className="hidden lg:flex border-t border-grey-200 p-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center py-2 text-grey-500 hover:bg-grey-100 rounded-lg"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="relative z-30 flex h-16 shrink-0 items-center gap-4 border-b border-grey-200 bg-white px-4 lg:px-6">

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="flex items-center justify-center rounded-lg p-2 text-grey-600 hover:bg-grey-100 lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="size-6" />
          </button>

          <p className="hidden shrink-0 text-[14px] text-grey-600 sm:block">
            <span className="text-grey-500">Dashboard</span>
            <span className="mx-2 text-grey-400">/</span>
            <span className="font-medium text-grey-900">Overview</span>
          </p>

          <div className="mx-auto hidden max-w-xl flex-1 px-4 lg:flex">
            <div className="relative w-full">
              <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-grey-400" />
              <input
                type="search"
                placeholder="Search employees, documents, or tasks..."
                className="h-10 w-full n border-1 bg-grey-50 pr-14 pl-10 text-[14px] outline-none focus:border-blue-200 focus:ring-2 focus:ring-blue-500/20"
              />
              <kbd className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded border border-grey-200 bg-white px-1.5 py-0.5 font-sans text-[11px] text-grey-500">
                ⌘ /
              </kbd>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              className="hidden sm:flex size-9 items-center justify-center rounded-lg text-grey-600 hover:bg-grey-100"
              aria-label="Theme"
            >
              <Sun className="size-[18px]" />
            </button>
            <button
              type="button"
              className="hidden sm:flex size-9 items-center justify-center rounded-lg text-grey-600 hover:bg-grey-100"
              aria-label="History"
            >
              <History className="size-[18px]" />
            </button>
            <button
              type="button"
              className="relative flex size-9 items-center justify-center rounded-lg text-grey-600 hover:bg-grey-100"
              aria-label="Notifications"
            >
              <Bell className="size-[18px]" />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-error-500" />
            </button>

            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 rounded-lg py-1 pr-1 pl-1 hover:bg-grey-100"
              >
                <span className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-indigo-50 text-[13px] font-semibold text-indigo-600">
                  {user?.name?.[0] ?? "AB"}
                </span>
                <span className="hidden max-w-[120px] truncate text-[14px] font-medium text-grey-900 sm:inline">
                  {displayName}
                </span>
                <ChevronDown className="size-4 text-grey-500" />
              </button>

              {profileOpen && (
                <div className="absolute top-full right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-grey-200 bg-white py-2 shadow-lg">
                  <div className="border-b border-grey-100 px-4 py-3">
                    <p className="text-[14px] font-semibold text-grey-900">{displayName}</p>
                    <p className="text-[13px] text-grey-500">HR Director</p>
                  </div>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-grey-700 hover:bg-grey-50"
                  >
                    <Settings className="size-4 text-grey-500" />
                    My Settings
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-grey-700 hover:bg-grey-50"
                  >
                    <RefreshCw className="size-4 text-grey-500" />
                    Switch Account
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-error-500 hover:bg-red-50"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}