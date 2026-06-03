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

// Departments
export type DepartmentEmployee = {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle?: Nullable<string>;
};

export type DepartmentHead = {
  id: string;
  firstName: string;
  lastName: string;
};

export type DepartmentStatus = "ACTIVE" | "INACTIVE";

export type Department = {
  id: string;
  name: string;
  description?: Nullable<string>;
  status: DepartmentStatus;
  parentDepartment?: Nullable<{ id: string; name: string }>;
  headEmployee?: Nullable<DepartmentHead>;
  employeeCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type DepartmentTree = {
  id: string;
  name: string;
  description?: Nullable<string>;
  status: DepartmentStatus;
  parentDepartmentId?: Nullable<string>;
  employees: DepartmentEmployee[];
  children: DepartmentTree[];
};

// Disciplinary records
export type DisciplinaryType =
  | "WARNING"
  | "MISCONDUCT"
  | "ABSENTEEISM"
  | "INSUBORDINATION"
  | "HARASSMENT"
  | "POLICY_VIOLATION";

export type DisciplinarySeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type DisciplinaryStatus = "PENDING" | "RESOLVED";

export type DisciplinaryRecord = {
  id: string;
  companyId: string;
  employeeId: string;
  type: DisciplinaryType;
  severity: DisciplinarySeverity;
  status: DisciplinaryStatus;
  title: string;
  description: string;
  resolutionNotes?: Nullable<string>;
  resolvedAt?: Nullable<string>;
  createdAt: string;
  employee?: { id: string; firstName: string; lastName: string; employeeCode?: string };
  createdBy?: { id: string; name?: string; email?: string };
  resolvedBy?: Nullable<{ id: string; name?: string; email?: string }>;
};

export type CreateDisciplinaryInput = {
  type: DisciplinaryType;
  severity: DisciplinarySeverity;
  title: string;
  description: string;
};

// Employment history
export type EmploymentHistory = {
  id: string;
  employeeId: string;
  companyId: string;
  departmentId?: Nullable<string>;
  jobTitle: string;
  startDate: string;
  endDate?: Nullable<string>;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateEmploymentHistoryInput = {
  departmentId?: string;
  jobTitle: string;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean;
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
