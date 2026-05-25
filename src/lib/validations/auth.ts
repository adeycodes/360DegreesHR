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

export const authUserSchema = z.preprocess((input) => {
  if (input && typeof input === "object") {
    const obj = input as Record<string, unknown>;
    if (!("id" in obj) && "userId" in obj) {
      return { ...obj, id: obj.userId };
    }
  }
  return input;
},
  z.object({
    id: z.string(),
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
})

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
    userId: z.string(),
    role: userRoleSchema,
    companyId: z.string().optional(),
  }),
});

export type RegisterCompanyInput = z.infer<typeof registerCompanySchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const meResponseSchema = authUserSchema;

export type LoginInput = z.infer<typeof loginSchema>;


export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});
  
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: strongPassword,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
