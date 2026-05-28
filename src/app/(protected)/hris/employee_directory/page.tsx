"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { employeeApi } from "@/lib/api/endpoints/employee"; // Adjust path if necessary
import { EmployeeDirectoryScreen } from "@/components/features/hris/employee-directory-screen";

export default function EmployeeDirectoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Fetch data using the API client
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["employees", page, search],
    queryFn: () => employeeApi.getAll(page, 10, search || undefined),
  });

  return (
    <EmployeeDirectoryScreen
      // Safely access the data based on your Zod schema { success, data: { employees, pagination } }
      employees={data?.data?.employees || []}
      pagination={data?.data?.pagination}
      isLoading={isLoading}
      error={isError ? "Failed to load directory data. Please try again." : null}
      onPageChange={setPage}
      onSearch={setSearch}
      onRefresh={refetch} // Passed down to refresh the list after Create/Delete
    />
  );
}
