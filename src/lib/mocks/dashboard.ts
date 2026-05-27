import type { DashboardOverview } from "@/lib/validations/dashboard";

export const mockDashboardData: DashboardOverview = {
  stats: [
    { label: "Total Employees", value: "1,234", change: "+12%" },
    { label: "Pending Approvals", value: 23, change: "-5%" },
    { label: "Open Positions", value: 18, change: "+3%" },
    { label: "Attendance Rate", value: "94.5%", change: "+1.2%" },
  ],
  pendingApprovals: 23,
  recentActivity: [
    { id: "1", title: "New employee onboarded", timestamp: "2 hours ago" },
    { id: "2", title: "Performance review completed", timestamp: "5 hours ago" },
    { id: "3", title: "Leave request approved", timestamp: "1 day ago" },
  ],
};
