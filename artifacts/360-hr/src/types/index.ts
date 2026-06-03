export type Nullable<T> = T | null;
export type AsyncStatus = "idle" | "loading" | "success" | "error";

// User roles
export type UserRole = "hr_admin" | "manager" | "employee";

// Auth
export type AuthUser = {
  userid: string;
  name?: string;
  email?: string;
  role: UserRole;
  companyId?: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
  company?: { id: string; name: string };
};

export type LoginInput = {
  userEmail: string;
  password: string;
};

export type RegisterCompanyInput = {
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  companyPhone: string;
  adminName: string;
  adminEmail: string;
  password: string;
};

export type ForgotPasswordInput = {
  email: string;
};

export type ResetPasswordInput = {
  token: string;
  password: string;
  confirmPassword?: string;
};

// Employee
export type Employee = {
  id: string;
  employeeCode?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  gender?: string;
  jobTitle?: string;
  employmentStatus: string;
  employmentType?: string;
  department?: { id: string; name: string };
  manager?: { id: string; firstName: string; lastName: string };
  user?: { id: string; email: string; role: string; isActive: boolean };
};

export type EmployeeList = {
  employees: Employee[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

// Dashboard
export type DashboardStat = {
  label: string;
  value: string | number;
  change?: string;
};

export type DashboardOverview = {
  stats?: DashboardStat[];
  pendingApprovals?: number;
  recentActivity?: { id: string; title: string; timestamp: string }[];
};
