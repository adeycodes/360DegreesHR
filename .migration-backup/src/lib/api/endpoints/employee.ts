import { z } from "zod";
import { apiPaths } from "@/config/api-paths";
import { get, post, put, del } from "@/lib/api/client";
import { getAuthHeader } from "@/lib/auth/session";
import { employeeListSchema, singleEmployeeSchema } from "@/lib/validations/employee";

export const employeeApi = {
    getAll: async (page = 1, limit = 10, name?: string) => {
        const query = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(name && { name }),
        }).toString();

        // Append the query string to the path
        const url = `${apiPaths.dashboard.hris.employee_directory}?${query}`;

        return get(url, employeeListSchema, {
            headers: getAuthHeader(),
        });
    },

    getById: (id: string) =>
        get(apiPaths.dashboard.hris.employee(id), singleEmployeeSchema, {
            headers: getAuthHeader()
        }),

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


    getAllEmployees: async (token: string) => {
        try {
            const data = await fetch("https://three60degreeshr-iewp.onrender.com/api/v1/employees", {
                method: "Get",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            const resultData = await data.json();

            return resultData.data
        }
        catch (error) {
        }

    }

};