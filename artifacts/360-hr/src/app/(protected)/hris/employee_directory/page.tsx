"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { employeeApi } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import { EmployeeDirectoryScreen } from "@/modules/hris/screens/employee-directory-screen";

export default function EmployeeDirectoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getAccessToken());
  }, []);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["employees", page, search, token],
    enabled: !!token,
    queryFn: () => employeeApi.getAllEmployees(token!),
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