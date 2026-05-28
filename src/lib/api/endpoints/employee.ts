import { z } from "zod";
import { apiPaths } from "@/config/api-paths";
import { get, post, put, del } from "@/lib/api/client";
import { getAuthHeader } from "@/lib/auth/session";
import { employeeListSchema, singleEmployeeSchema } from "@/lib/validations/employee";

export const employeeApi = {
    getAll: (page = 1, limit = 10, name?: string) => {
        const query = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(name && { name }),
        }).toString();

        return get(`${apiPaths.dashboard.hris.employee_directory}?${query}`, employeeListSchema, {
            headers: getAuthHeader(),
        });
    },

    getById: (id: string) =>
        get(apiPaths.dashboard.hris.employee(id), singleEmployeeSchema, {
            headers: getAuthHeader()
        }),

    // FIXED: Ensure headers are passed as the 4th argument (options)
    create: (data: unknown) =>
        post(apiPaths.dashboard.hris.employee_directory, singleEmployeeSchema, data, {
            headers: getAuthHeader()
        }),

    update: (id: string, data: unknown) =>
        put(apiPaths.dashboard.hris.employee(id), singleEmployeeSchema, data, {
            headers: getAuthHeader()
        }),

    delete: (id: string) =>
        del(apiPaths.dashboard.hris.employee(id), z.object({ success: z.boolean() }), {
            headers: getAuthHeader()
        }),
};