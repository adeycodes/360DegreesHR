import { apiPaths } from "@/config/api-paths";
import { get } from "@/lib/api/client";
import { getAuthHeader } from "@/lib/auth/session";
import { dashboardOverviewSchema } from "@/lib/validations/dashboard";

export const dashboardApi = {
  /** Fetch the admin dashboard overview */
  getOverview: () =>
    get(apiPaths.dashboard.overview, dashboardOverviewSchema, {
      headers: getAuthHeader(),
    }),
};
