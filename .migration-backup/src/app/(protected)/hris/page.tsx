import { redirect } from "next/navigation";

import { routes } from "@/config/routes";

export default function HrisIndexPage() {
  redirect(routes.hris.employees);
}
