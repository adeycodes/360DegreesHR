"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { employeeApi } from "@/lib/api/endpoints/employee";
import { EmployeeDirectoryScreen } from "@/components/features/hris/employee-directory-screen";

export default function EmployeeDirectoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const token = sessionStorage.getItem("auth_token");

  if (!token) {
    throw new Error("No auth token found. User might not be authenticated.");
  }


  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["employees", page, search],
    queryFn: () => employeeApi.getAllEmployees(token), // Call the API client function to fetch employees
  });





  return (
    <EmployeeDirectoryScreen
      employees={data?.employees || []}
      pagination={data?.pagination}
      isLoading={isLoading}
      error={isError ? "Failed to load directory data. Please try again." : null}
      onPageChange={setPage}
      onSearch={setSearch}
      onRefresh={() => { }}
    />
  );
}