"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Eye, UserRound } from "lucide-react";
import { useState } from "react";

import { AuthSplitLayout } from "@/components/shared/auth/auth-split-layout";
import { AuthField, authInputClassName } from "@/components/shared/auth/auth-field";
import { LoginBuildingHero } from "@/components/shared/auth/login-building-hero";
import { routes } from "@/config/routes";
import { toUserMessage } from "@/lib/api/errors";
import { authApi } from "@/lib/api/endpoints/auth";
import { fieldErrorsFromZod } from "@/lib/forms/zod-field-errors";
import {
  registerCompanySchema,
  type RegisterCompanyInput,
} from "@/lib/validations/auth";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "@/stores/toast-store";

const initial: RegisterCompanyInput = {
  companyName: "",
  companyEmail: "",
  companyAddress: "",
  companyPhone: "",
  adminName: "",
  adminEmail: "",
  password: "",
};

export function RegisterCompanyScreen() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [form, setForm] = useState<RegisterCompanyInput>(initial);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof RegisterCompanyInput, string>>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function update<K extends keyof RegisterCompanyInput>(
    key: K,
    value: RegisterCompanyInput[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = registerCompanySchema.safeParse(form);
    if (!parsed.success) {
      setFieldErrors(
        fieldErrorsFromZod<keyof RegisterCompanyInput>(parsed.error.issues),
      );
      return;
    }
    setFieldErrors({});
    setIsLoading(true);
    try {
      const session = await authApi.registerCompany(parsed.data);
      setSession(session);
      toast.success("Registration successful! Welcome to your dashboard.");
      router.push(routes.app.dashboard);
    } catch (err) {
      const msg = toUserMessage(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthSplitLayout
      
      variant="login-building"
      hero={
        <LoginBuildingHero
          title="Excellence in Human Capital."
          description="Register your organization and onboard your first HR administrator in minutes."
        />
      }
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-[32px] font-semibold tracking-tight text-[#111827]">
            Create your account
          </h2>
          <p className="mt-2 text-[15px] text-grey-600">
            Set up your company workspace and administrator credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[13px] font-semibold tracking-wide text-grey-700 uppercase">
              <Building2 className="size-4 text-grey-500" />
              Company details
            </div>

            <AuthField
              label="Company name"
              htmlFor="companyName"
              error={fieldErrors.companyName}
            >
              <input
                id="companyName"
                type="text"
                autoComplete="organization"
                placeholder="360Degrees HR"
                value={form.companyName}
                onChange={(e) => update("companyName", e.target.value)}
                className={authInputClassName()}
              />
            </AuthField>

            <AuthField
              label="Company email"
              htmlFor="companyEmail"
              error={fieldErrors.companyEmail}
            >
              <input
                id="companyEmail"
                type="email"
                autoComplete="email"
                placeholder="info@360degrees.com"
                value={form.companyEmail}
                onChange={(e) => update("companyEmail", e.target.value)}
                className={authInputClassName()}
              />
            </AuthField>

            <AuthField
              label="Company address"
              htmlFor="companyAddress"
              error={fieldErrors.companyAddress}
            >
              <input
                id="companyAddress"
                type="text"
                autoComplete="street-address"
                placeholder="Abuja, Nigeria"
                value={form.companyAddress}
                onChange={(e) => update("companyAddress", e.target.value)}
                className={authInputClassName()}
              />
            </AuthField>

            <AuthField
              label="Company phone"
              htmlFor="companyPhone"
              error={fieldErrors.companyPhone}
            >
              <input
                id="companyPhone"
                type="tel"
                autoComplete="tel"
                placeholder="+2348012345678"
                value={form.companyPhone}
                onChange={(e) => update("companyPhone", e.target.value)}
                className={authInputClassName()}
              />
            </AuthField>
          </section>

          <section className="space-y-4 border-t border-grey-200 pt-6">
            

            <AuthField
              label="Administrator name"
              htmlFor="adminName"
              error={fieldErrors.adminName}
            >
              <input
                id="adminName"
                type="text"
                autoComplete="name"
                placeholder="Arthur"
                value={form.adminName}
                onChange={(e) => update("adminName", e.target.value)}
                className={authInputClassName()}
              />
            </AuthField>

            <AuthField
              label="Administrator email"
              htmlFor="adminEmail"
              error={fieldErrors.adminEmail}
            >
              <input
                id="adminEmail"
                type="email"
                autoComplete="email"
                placeholder="arthur@360degrees.com"
                value={form.adminEmail}
                onChange={(e) => update("adminEmail", e.target.value)}
                className={authInputClassName()}
              />
            </AuthField>

            <AuthField label="Password" htmlFor="password" error={fieldErrors.password}>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className={authInputClassName("pr-11")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-grey-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Eye className="size-5" />
                </button>
              </div>
            </AuthField>
          </section>

          {error ? <p className="text-body-3 text-error-500">{error}</p> : null}

          <button
            type="submit"
            disabled={isLoading}
            className="h-[48px] w-full rounded-lg bg-[#274376] text-[15px] font-medium text-white transition-colors hover:bg-[#1e3559] disabled:opacity-70"
          >
            {isLoading ? "Creating account…" : "Create company account"}
          </button>
        </form>

        <p className="text-center text-[14px] text-grey-600">
          Already have an account?{" "}
          <Link
            href={routes.auth.loginPassword}
            className="font-medium text-[#3B82F6] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
}
