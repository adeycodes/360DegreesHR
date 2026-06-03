import { z } from "zod";

const userSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    role: z.string(),
    isActive: z.boolean(),
});

// This schema describes the structure of a single employee object
// inside the 'employees' array.
export const singleEmployeeSchema = z.object({
    id: z.string(),
    employeeCode: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    gender: z.string().optional(),
    jobTitle: z.string().optional(),
    employmentStatus: z.string(),
    department: z.object({ id: z.string(), name: z.string() }).optional(),
    manager: z.object({ id: z.string(), firstName: z.string(), lastName: z.string() }).optional(),
    user: userSchema.optional(),
});

// This schema describes the 'data' object ONLY.
// The 'success' and 'message' envelope is stripped by parseApiResponse.
export const employeeListSchema = z.object({
    employees: z.array(singleEmployeeSchema),
    pagination: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number()
    }),
});