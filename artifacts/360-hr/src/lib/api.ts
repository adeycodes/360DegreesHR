import { getAccessToken } from "@/lib/session";
import type {
  AuthSession,
  AuthUser,
  LoginInput,
  RegisterCompanyInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  Employee,
  EmployeeList,
  Department,
  DepartmentTree,
  DisciplinaryRecord,
  CreateDisciplinaryInput,
  EmploymentHistory,
  CreateEmploymentHistoryInput,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const TIMEOUT_MS = 30_000;

// ─── Error class ──────────────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  userMessage: string;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.userMessage = friendlyMessage(status, message);
  }
}

function friendlyMessage(status: number, fallback: string): string {
  if (status === 401) return "Invalid credentials. Please try again.";
  if (status === 403) return "You don't have permission to do that.";
  if (status === 404) return "Not found.";
  if (status >= 500) return "Server error. Please try again later.";
  return fallback || "Something went wrong. Please try again.";
}

export function toUserMessage(err: unknown): string {
  if (err instanceof ApiError) return err.userMessage;
  return "Something went wrong. Please try again.";
}

// ─── Core fetch helper ────────────────────────────────────────────────────────

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  extraHeaders?: HeadersInit,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...extraHeaders,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      cache: "no-store",
    });

    if (!res.ok) {
      let message = res.statusText;
      try {
        const json = await res.json();
        if (json?.message) message = json.message;
      } catch { /* ignore parse errors */ }
      throw new ApiError(message, res.status);
    }

    const text = await res.text();
    if (!text) return {} as T;

    const json = JSON.parse(text);

    // Unwrap { success, data } envelope when present
    if (json && typeof json === "object" && "data" in json) {
      return json.data as T;
    }
    return json as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      err instanceof Error ? err.message : "Network error",
      0,
    );
  } finally {
    clearTimeout(timer);
  }
}

function authHeaders(): HeadersInit {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const get = <T>(path: string, headers?: HeadersInit) =>
  request<T>("GET", path, undefined, headers);
const post = <T>(path: string, body: unknown, headers?: HeadersInit) =>
  request<T>("POST", path, body, headers);
const put = <T>(path: string, body: unknown, headers?: HeadersInit) =>
  request<T>("PUT", path, body, headers);
const del = <T>(path: string, headers?: HeadersInit) =>
  request<T>("DELETE", path, undefined, headers);

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  login: async (input: LoginInput): Promise<AuthSession> => {
    const raw = await post<{
      token: string;
      user: { userId: string; role: string; companyId?: string };
      company?: { id: string; name: string };
    }>("/auth/login", {
      userEmail: input.userEmail,
      password: input.password,
    });
    return {
      token: raw.token,
      user: {
        userid: raw.user.userId,
        role: raw.user.role.toLowerCase() as "hr_admin" | "manager" | "employee",
        companyId: raw.user.companyId,
      },
      company: raw.company,
    };
  },

  registerCompany: (input: RegisterCompanyInput) =>
    post<{
      token: string;
      // The API returns `id` (not `userid`) — register-company-screen maps it to AuthUser.userid
      user: { id: string; name?: string; email?: string; role: string };
      company?: { id: string; name: string };
    }>("/auth/register", input),

  me: async (): Promise<AuthUser> => {
    const raw = await get<{
      userId: string;
      name?: string;
      email?: string;
      role: string;
      companyId?: string;
    }>("/auth/me", authHeaders());
    return {
      userid: raw.userId,
      name: raw.name,
      email: raw.email,
      role: raw.role.toLowerCase() as "hr_admin" | "manager" | "employee",
      companyId: raw.companyId,
    };
  },

  forgotPassword: (input: ForgotPasswordInput) =>
    post<{ success: boolean; message: string }>("/auth/forgot-password", input),

  // Token is sent in the request body, not the URL, to avoid leaking it in
  // server logs or browser history.
  resetPassword: (input: ResetPasswordInput) =>
    post<{ success: boolean; message: string }>("/auth/reset-password", input, authHeaders()),
};

// ─── Employee API ─────────────────────────────────────────────────────────────

export const employeeApi = {
  getAll: (page = 1, limit = 10, name?: string) => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(name && { name }),
    }).toString();
    return get<EmployeeList>(`/employees?${query}`, authHeaders());
  },

  getById: (id: string) =>
    get<Employee>(`/employees/${id}`, authHeaders()),

  create: (data: Record<string, unknown>) =>
    post<Employee>("/employees", data, authHeaders()),

  update: (id: string, data: Record<string, unknown>) =>
    put<Employee>(`/employees/${id}`, data, authHeaders()),

  delete: (id: string) =>
    del<{ success: boolean }>(`/employees/${id}`, authHeaders()),
};

// ─── Dashboard API ────────────────────────────────────────────────────────────
//
// The backend exposes no `/dashboard` endpoint — dashboard figures are derived
// client-side from the employees and department-tree endpoints.

export const dashboardApi = {
  getEmployees: (page = 1, limit = 100) => {
    const query = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();
    return get<EmployeeList>(`/employees?${query}`, authHeaders());
  },

  getDepartmentTree: () =>
    get<DepartmentTree[]>("/departments/company/tree", authHeaders()),
};

// ─── Department API ───────────────────────────────────────────────────────────

export type DepartmentInput = {
  name: string;
  description: string;
  parentDepartmentId?: string;
  headEmployeeId?: string;
};

export const departmentApi = {
  getAll: () =>
    get<Department[]>("/departments", authHeaders()),

  create: (data: DepartmentInput) =>
    post<Department>("/departments", data, authHeaders()),

  getTree: () =>
    get<DepartmentTree[]>("/departments/company/tree", authHeaders()),

  update: (id: string, data: Partial<DepartmentInput>) =>
    put<Department>(`/departments/${id}`, data, authHeaders()),

  delete: (id: string) =>
    del<{ success: boolean }>(`/departments/${id}`, authHeaders()),

  getById: (id: string) =>
    get<Department>(`/departments/${id}`, authHeaders()),
};

// ─── Disciplinary Records API ───────────────────────────────────────────────────

export const disciplinaryApi = {
  getByEmployee: (employeeId: string) =>
    get<DisciplinaryRecord[]>(`/disciplinary/employees/${employeeId}`, authHeaders()),

  create: (employeeId: string, data: CreateDisciplinaryInput) =>
    post<DisciplinaryRecord>(`/disciplinary/employees/${employeeId}`, data, authHeaders()),

  resolve: (disciplinaryId: string, resolutionNotes: string) =>
    request<DisciplinaryRecord>(
      "PATCH",
      `/disciplinary/employees/${disciplinaryId}`,
      { resolutionNotes },
      authHeaders(),
    ),
};

// ─── Employment History API ─────────────────────────────────────────────────────

export const employmentHistoryApi = {
  getByEmployee: (employeeId: string) =>
    get<EmploymentHistory[]>(`/employment-history/employees/${employeeId}`, authHeaders()),

  create: (employeeId: string, data: CreateEmploymentHistoryInput) =>
    post<EmploymentHistory>(`/employment-history/employees/${employeeId}`, data, authHeaders()),
};
