/**
 * Mock data for dashboard - FOR TESTING ONLY
 * Will be replaced with real API data in production
 */

export const mockDashboardStats = {
  totalEmployees: 1234,
  activeToday: 856,
  pendingReviews: 42,
  openPositions: 8,
} as const;

export const mockEmployeeData = [
  {
    id: "emp-001",
    name: "John Doe",
    department: "Engineering",
    status: "active",
    startDate: "2022-03-15",
  },
  {
    id: "emp-002",
    name: "Jane Smith",
    department: "HR",
    status: "active",
    startDate: "2021-07-20",
  },
  {
    id: "emp-003",
    name: "Mike Johnson",
    department: "Sales",
    status: "on-leave",
    startDate: "2023-01-10",
  },
  {
    id: "emp-004",
    name: "Sarah Williams",
    department: "Marketing",
    status: "active",
    startDate: "2022-09-05",
  },
] as const;

export const mockDepartments = [
  { id: "dept-001", name: "Engineering", headCount: 45, manager: "John Doe" },
  { id: "dept-002", name: "HR", headCount: 12, manager: "Jane Smith" },
  { id: "dept-003", name: "Sales", headCount: 30, manager: "Mike Johnson" },
  {
    id: "dept-004",
    name: "Marketing",
    headCount: 15,
    manager: "Sarah Williams",
  },
] as const;

export const mockChartData = [
  { month: "Jan", employees: 450 },
  { month: "Feb", employees: 520 },
  { month: "Mar", employees: 640 },
  { month: "Apr", employees: 780 },
  { month: "May", employees: 890 },
  { month: "Jun", employees: 1050 },
  { month: "Jul", employees: 1150 },
  { month: "Aug", employees: 1200 },
  { month: "Sep", employees: 1234 },
  { month: "Oct", employees: 1234 },
  { month: "Nov", employees: 1234 },
  { month: "Dec", employees: 1234 },
] as const;
