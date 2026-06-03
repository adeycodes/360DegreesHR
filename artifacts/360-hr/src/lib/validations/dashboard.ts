import { z } from "zod";

/** HRIS Module 1 — dashboard overview (shape will match backend contract) */
export const dashboardStatSchema = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number()]),
  change: z.string().optional(),
});

export const dashboardOverviewSchema = z.object({
  stats: z.array(dashboardStatSchema),
  pendingApprovals: z.number().optional(),
  recentActivity: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        timestamp: z.string(),
      }),
    )
    .optional(),
});



export type DashboardOverview = z.infer<typeof dashboardOverviewSchema>;
