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
  DashboardOverview,
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
  login: (input: LoginInput) =>
    post<AuthSession>("/auth/login", {
      userEmail: input.userEmail,
      password: input.password,
    }),

  registerCompany: (input: RegisterCompanyInput) =>
    post<{
      token: string;
      // The API returns `id` (not `userid`) — register-company-screen maps it to AuthUser.userid
      user: { id: string; name?: string; email?: string; role: string };
      company?: { id: string; name: string };
    }>("/auth/register", input),

  me: () =>
    get<AuthUser>("/auth/me", authHeaders()),

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

export const dashboardApi = {
  getOverview: () =>
    get<DashboardOverview>("/dashboard", authHeaders()),

  getHrisEmployees: () =>
    get<EmployeeList>("/employees", authHeaders()),
};

// ─── Department API ───────────────────────────────────────────────────────────

export type DepartmentInput = {
  name: string;
  description: string;
  parentDepartmentId?: string;
  headEmployeeId?: string;
};

export const departmentApi = {
  create: (data: DepartmentInput) =>
    post<unknown>("/departments", data, authHeaders()),

  getTree: () =>
    get<unknown>("/departments/company/tree", authHeaders()),

  update: (id: string, data: Partial<DepartmentInput>) =>
    put<unknown>(`/departments/${id}`, data, authHeaders()),

  delete: (id: string) =>
    del<unknown>(`/departments/${id}`, authHeaders()),

  getById: (id: string) =>
    get<unknown>(`/departments/${id}`, authHeaders()),
};
