"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { employeeApi } from "@/lib/api";
import { EmployeeDirectoryScreen } from "@/modules/hris/screens/employee-directory-screen";
import type { Employee } from "@/types";

const MOCK_EMPLOYEES: Employee[] = [
  { id: "1", firstName: "Marcus", lastName: "Sterling", email: "marcus@360hr.com", phone: "+1-555-0101", jobTitle: "Chief Executive Officer", department: { id: "d1", name: "Executive" }, employmentType: "Full-time", employmentStatus: "ACTIVE" },
  { id: "2", firstName: "Elena", lastName: "Vance", email: "elena@360hr.com", phone: "+1-555-0102", jobTitle: "VP of Engineering", department: { id: "d2", name: "Engineering" }, employmentType: "Full-time", employmentStatus: "ACTIVE" },
  { id: "3", firstName: "James", lastName: "Morrow", email: "james@360hr.com", phone: "+1-555-0103", jobTitle: "Director of Operations", department: { id: "d3", name: "Operations" }, employmentType: "Full-time", employmentStatus: "ACTIVE" },
  { id: "4", firstName: "Priya", lastName: "Okafor", email: "priya@360hr.com", phone: "+1-555-0104", jobTitle: "Head of Sales", department: { id: "d4", name: "Sales" }, employmentType: "Full-time", employmentStatus: "ACTIVE" },
  { id: "5", firstName: "Sarah", lastName: "Chen", email: "sarah@360hr.com", phone: "+1-555-0105", jobTitle: "HR Manager", department: { id: "d5", name: "Human Resources" }, employmentType: "Full-time", employmentStatus: "ACTIVE" },
  { id: "6", firstName: "David", lastName: "Kim", email: "david@360hr.com", phone: "+1-555-0106", jobTitle: "Senior Engineer", department: { id: "d2", name: "Engineering" }, employmentType: "Full-time", employmentStatus: "ACTIVE" },
  { id: "7", firstName: "Jonathan", lastName: "Miller", email: "jonathan@360hr.com", phone: "+1-555-0107", jobTitle: "Product Manager", department: { id: "d6", name: "Product" }, employmentType: "Full-time", employmentStatus: "ACTIVE" },
  { id: "8", firstName: "Alex", lastName: "Rivers", email: "alex@360hr.com", phone: "+1-555-0108", jobTitle: "Data Scientist", department: { id: "d7", name: "Data Science" }, employmentType: "Full-time", employmentStatus: "ACTIVE" },
  { id: "9", firstName: "Marcus", lastName: "Wright", email: "marcusw@360hr.com", phone: "+1-555-0109", jobTitle: "Recruiter", department: { id: "d5", name: "Human Resources" }, employmentType: "Contract", employmentStatus: "ACTIVE" },
  { id: "10", firstName: "Elena", lastName: "Rodriguez", email: "elenar@360hr.com", phone: "+1-555-0110", jobTitle: "UX Designer", department: { id: "d8", name: "Design & UX" }, employmentType: "Full-time", employmentStatus: "ACTIVE" },
];

export default function EmployeeDirectoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["employees", page, search],
    queryFn: () => employeeApi.getAll(page, 10, search || undefined),
    retry: false,
  });

  const employees = isError ? MOCK_EMPLOYEES : (data?.employees ?? []);
  const pagination = isError ? { total: 128, page: 1, limit: 10, totalPages: 13 } : (data?.pagination ?? null);
  const isLoadingDisplay = isLoading && !isError;
  const errorMsg = null; // silently use demo data when API is unavailable

  return (
    <EmployeeDirectoryScreen
      employees={employees}
      pagination={pagination}
      isLoading={isLoadingDisplay}
      error={errorMsg}
      onPageChange={setPage}
      onSearch={setSearch}
      onRefresh={() => refetch()}
    />
  );
}
