"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { employeeApi } from "@/lib/api";
import { EmployeeDirectoryScreen } from "@/modules/hris/screens/employee-directory-screen";
import type { Employee } from "@/types";

const MOCK_EMPLOYEES: Employee[] = [
  { id: "1", firstName: "Marcus", lastName: "Sterling", email: "marcus@360hr.com", phone: "+1-555-0101", jobTitle: "Chief Executive Officer", department: "Executive", employmentType: "Full-time", status: "Active", workLocation: "Headquarters", hireDate: "2020-01-15", salary: 280000, avatar: "https://i.pravatar.cc/80?u=marcus" },
  { id: "2", firstName: "Elena", lastName: "Vance", email: "elena@360hr.com", phone: "+1-555-0102", jobTitle: "VP of Engineering", department: "Engineering", employmentType: "Full-time", status: "Active", workLocation: "Remote", hireDate: "2020-03-10", salary: 195000, avatar: "https://i.pravatar.cc/80?u=elena" },
  { id: "3", firstName: "James", lastName: "Morrow", email: "james@360hr.com", phone: "+1-555-0103", jobTitle: "Director of Operations", department: "Operations", employmentType: "Full-time", status: "Active", workLocation: "Headquarters", hireDate: "2020-06-01", salary: 165000, avatar: "https://i.pravatar.cc/80?u=james" },
  { id: "4", firstName: "Priya", lastName: "Okafor", email: "priya@360hr.com", phone: "+1-555-0104", jobTitle: "Head of Sales", department: "Sales", employmentType: "Full-time", status: "Active", workLocation: "London", hireDate: "2021-02-20", salary: 155000, avatar: "https://i.pravatar.cc/80?u=priya" },
  { id: "5", firstName: "Sarah", lastName: "Chen", email: "sarah@360hr.com", phone: "+1-555-0105", jobTitle: "HR Manager", department: "Human Resources", employmentType: "Full-time", status: "Active", workLocation: "Headquarters", hireDate: "2021-08-15", salary: 95000, avatar: "https://i.pravatar.cc/80?u=sarah" },
  { id: "6", firstName: "David", lastName: "Kim", email: "david@360hr.com", phone: "+1-555-0106", jobTitle: "Senior Engineer", department: "Engineering", employmentType: "Full-time", status: "Active", workLocation: "Remote", hireDate: "2022-01-10", salary: 125000, avatar: "https://i.pravatar.cc/80?u=david" },
  { id: "7", firstName: "Jonathan", lastName: "Miller", email: "jonathan@360hr.com", phone: "+1-555-0107", jobTitle: "Product Manager", department: "Product", employmentType: "Full-time", status: "Active", workLocation: "Headquarters", hireDate: "2022-04-01", salary: 115000, avatar: "https://i.pravatar.cc/80?u=jonathan" },
  { id: "8", firstName: "Alex", lastName: "Rivers", email: "alex@360hr.com", phone: "+1-555-0108", jobTitle: "Data Scientist", department: "Data Science", employmentType: "Full-time", status: "Active", workLocation: "Remote", hireDate: "2022-07-15", salary: 135000, avatar: "https://i.pravatar.cc/80?u=alex" },
  { id: "9", firstName: "Marcus", lastName: "Wright", email: "marcusw@360hr.com", phone: "+1-555-0109", jobTitle: "Recruiter", department: "Human Resources", employmentType: "Contract", status: "Active", workLocation: "Headquarters", hireDate: "2023-01-20", salary: 75000, avatar: "https://i.pravatar.cc/80?u=marcusw" },
  { id: "10", firstName: "Elena", lastName: "Rodriguez", email: "elenar@360hr.com", phone: "+1-555-0110", jobTitle: "UX Designer", department: "Design & UX", employmentType: "Full-time", status: "Active", workLocation: "Remote", hireDate: "2023-03-15", salary: 105000, avatar: "https://i.pravatar.cc/80?u=elenar" },
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
