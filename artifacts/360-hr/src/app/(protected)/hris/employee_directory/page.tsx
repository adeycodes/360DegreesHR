"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { employeeApi } from "@/lib/api";
import { EmployeeDirectoryScreen } from "@/modules/hris/screens/employee-directory-screen";

export default function EmployeeDirectoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["employees", page, search],
    queryFn: () => employeeApi.getAll(page, 10, search || undefined),
  });

  return (
    <EmployeeDirectoryScreen
      employees={data?.employees ?? []}
      pagination={data?.pagination ?? null}
      isLoading={isLoading}
      error={isError ? "Failed to load directory data. Please try again." : null}
      onPageChange={setPage}
      onSearch={setSearch}
      onRefresh={() => refetch()}
    />
  );
}
