import { z } from "zod";
import type { ZodType } from "zod";

import { ApiError, ValidationError } from "@/lib/api/errors";
import { userRoles } from "@/config/mvp";

// ============================================================================
// REUSABLE PRIMITIVES & UTILS
// ============================================================================

export const idSchema = z.string().min(1, "ID is required");

export const emailSchema = z.email("Enter a valid email address");

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const paginatedMetaSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export function createPaginatedSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    data: z.array(itemSchema),
    meta: paginatedMetaSchema,
  });
}

export const apiErrorBodySchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export const userRoleSchema = z.preprocess(
  (val) => (typeof val === "string" ? val.toLowerCase() : val),
  z.enum(userRoles),
);

const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
    "Must include uppercase, lowercase, number, and special character",
  );

// ============================================================================
// PARSER UTILITIES
// ============================================================================

export async function parseApiResponse<T>(
  response: Response,
  schema: ZodType<T>,
): Promise<T> {
  const text = await response.text();
  if (!text || text.trim() === "") {
    const result = schema.safeParse({});
    if (result.success) return result.data;
    const fallback: Record<string, unknown> = {
      success: true,
      message: response.statusText || "Success",
    };
    const fallbackResult = schema.safeParse(fallback);
    if (fallbackResult.success) return fallbackResult.data;
    return fallback as unknown as T;
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new ApiError({
      message: "Response body is not valid JSON",
      status: 502,
      userMessage: "We received unexpected data. Please try again.",
    });
  }

  if (
    json !== null &&
    typeof json === "object" &&
    "success" in (json as object) &&
    "data" in (json as object)
  ) {
    json = (json as { data: unknown }).data;
  }

  return parseData(schema, json);
}

export function parseData<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    if (typeof window !== "undefined") {
      console.error("Validation Error - Data received:", data);
      console.error("Validation Error - Issues:", result.error.issues);
    }
    throw new ValidationError(result.error);
  }
  return result.data;
}

// ============================================================================
// AUTH SCHEMAS
// ============================================================================

export const authUserSchema = z.preprocess((input) => {
  if (input && typeof input === "object") {
    const obj = input as Record<string, unknown>;
    if (!("id" in obj) && "userId" in obj) {
      return { ...obj, id: obj.userId };
    }
  }
  return input;
}, z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  role: userRoleSchema,
  companyId: z.string().optional(),
}));

export type AuthUser = z.infer<typeof authUserSchema>;

export const authSessionSchema = z.object({
  token: z.string(),
  user: authUserSchema,
  company: z.object({ id: z.string(), name: z.string() }).optional(),
});

export type AuthSession = z.infer<typeof authSessionSchema>;

export const messageResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// ============================================================================
// INPUT TYPES FOR API CALLS
// ============================================================================

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterCompanyInput = {
  companyName: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export type ForgotPasswordInput = {
  email: string;
};

export type ResetPasswordInput = {
  token: string;
  newPassword: string;
};

// ============================================================================
// SCHEMAS (continued)
// ============================================================================

export const registerCompanySchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    token: z.string(),
    user: authUserSchema,
    company: z.object({ id: z.string(), name: z.string() }),
  }).optional(),
});

export type RegisterCompanyResponse = z.infer<typeof registerCompanySchema>;

export const meResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: authUserSchema.optional(),
});

export type MeResponse = z.infer<typeof meResponseSchema>;

export const dashboardOverviewSchema = z.object({
  stats: z.array(z.object({
    label: z.string(),
    value: z.union([z.string(), z.number()]),
    change: z.string().optional(),
  })),
  pendingApprovals: z.number().optional(),
  recentActivity: z.array(z.object({
    id: z.string(),
    title: z.string(),
    timestamp: z.string(),
  })).optional(),
});

export type DashboardOverview = z.infer<typeof dashboardOverviewSchema>;
