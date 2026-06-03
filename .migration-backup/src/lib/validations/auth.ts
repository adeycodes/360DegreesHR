import { z } from "zod";

import { userRoles } from "@/config/mvp";

// ─── Reusable rules ─────────────────────────────────────────────────

export const userRoleSchema = z.preprocess(
  (val) => (typeof val === "string" ? val.toLowerCase() : val),
  z.enum(userRoles),
);

/** Strong password — reused in register + reset-password */
const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
    "Must include uppercase, lowercase, number, and special character",
  );

// ─── Response schemas (what the backend sends back) ─────────────────

export const authUserSchema = z.preprocess(
  (input) => {
    if (input && typeof input === "object") {
      const obj = input as Record<string, unknown>;
      if (!("userid" in obj) && "userId" in obj) {
        return { ...obj, userid: obj.userId };
      }
    }
    return input;
  },
  z.object({
    userid: z.string(),
    name: z.string().optional(),
    email: z.string().email().optional(),
    role: userRoleSchema,
    companyId: z.string().optional(),
  }),
);

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

// ─── Input schemas (what the frontend sends) ────────────────────────

export const registerCompanySchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  companyEmail: z.string().email("Enter a valid company email"),
  companyAddress: z.string().min(2, "Company address is required"),
  companyPhone: z.string().min(8, "Enter a valid phone number").max(20, "Phone number is too long"),
  adminName: z.string().min(2, "Administrator name is required"),
  adminEmail: z.string().email("Enter a valid admin email"),
  password: strongPassword,
});

export const registerResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string().optional(),
    email: z.string().email().optional(),
    role: userRoleSchema,
  }),
  company: z.object({
    id: z.string(),
    name: z.string(),
  }).optional(),
});

export type RegisterCompanyInput = z.infer<typeof registerCompanySchema>;

// LoginInput is defined at the bottom of this file since it's used in the login screen which imports this file
export const loginSchema = z.object({
  userEmail: z.string().email("Enter a valid email"),
  password: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Fixed: loginResponseSchema now properly wraps `data` with `z.object()`
export const loginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    token: z.string(),
    user: z.object({
      userid: z.string(),
      role: z.string(),
      companyId: z.string(),
    }),
  }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: strongPassword,
  })


export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;