import { get, post, put, del } from "@/lib/api/client";
import { getAuthHeader } from "@/lib/auth/session";
import { z } from "zod";

export const departmentApi = {
    create: (data: { name: string; description: string; parentDepartmentId?: string; headEmployeeId?: string }) =>
        post("/departments", z.any(), data, { headers: getAuthHeader() }),

    getTree: () => get("/departments/company/tree", z.any(), {
        headers: getAuthHeader()
    }),

    update: (id: string, data: any) =>
        put(`/departments/${id}`, z.any(), data, { headers: getAuthHeader() }),

    delete: (id: string) =>
        del(`/departments/${id}`, z.any(), { headers: getAuthHeader() }),

    getById: (id: string) =>
        get(`/departments/${id}`, z.any(), { headers: getAuthHeader() }),
};