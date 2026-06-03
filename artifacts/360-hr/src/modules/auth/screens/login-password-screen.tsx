"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/stores/toast-store";
import { Eye, KeyRound, Shield } from "lucide-react";
import { useState } from "react";

import { AuthSplitLayout } from "@/shared/auth/auth-split-layout";
import { AuthField, authInputClassName } from "@/shared/auth/auth-field";
import { LoginBuildingHero } from "@/shared/auth/login-building-hero";
import { routes } from "@/config/routes";
import { toUserMessage, authApi } from "@/lib/api";
import type { LoginInput } from "@/types";
import { useAuthStore } from "@/stores/auth-store";

export function LoginPasswordScreen() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [form, setForm] = useState<LoginInput>({ userEmail: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const errors: Partial<Record<keyof LoginInput, string>> = {};
    if (!form.userEmail || !/\S+@\S+\.\S+/.test(form.userEmail)) {
      errors.userEmail = "Enter a valid email address";
    }
    if (!form.password) {
      errors.password = "Password is required";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setIsLoading(true);
    try {
      const session = await authApi.login(form);
      setSession(session);
      toast.success("Login successful! Welcome back.");
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
        <div>
          <div style={{ position: "absolute", top: 50, bottom: 50, zIndex: 1, height: "100%" }}>
            <LoginBuildingHero
              title="Excellence in Human Capital."
              description="The architectural curator of workforce intelligence. Managing your global talent with precision, clarity, and institutional trust."
            />
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-[32px] font-semibold tracking-tight text-grey-900">
            Welcome back
          </h2>
          <p className="mt-2 text-[15px] text-grey-600">
            Please enter your credentials to access your dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthField label="Email address" htmlFor="userEmail" error={fieldErrors.userEmail}>
            <input
              id="userEmail"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              value={form.userEmail}
              onChange={(e) => setForm((f) => ({ ...f, userEmail: e.target.value }))}
              className={authInputClassName()}
            />
          </AuthField>
          <AuthField
            label="Password"
            htmlFor="password"
            error={fieldErrors.password}
            labelAction={
              <Link
                href={routes.auth.forgotPassword}
                className="text-[13px] font-medium text-blue-500 normal-case hover:underline"
              >
                Forgot password?
              </Link>
            }
          >
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
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

          <label className="flex cursor-pointer items-center gap-2.5 text-[14px] text-grey-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 rounded border-grey-300 text-primary-500"
            />
            Remember this device for 30 days
          </label>

          {error ? <p className="text-body-3 text-error-500">{error}</p> : null}

          <button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-lg bg-primary-500 text-[15px] font-medium text-white transition-colors hover:bg-primary-600 disabled:opacity-70"
          >
            {isLoading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-[14px] text-grey-600">
          New to 360DegreesHR?{" "}
          <Link
            href={routes.auth.register}
            className="font-medium text-blue-500 hover:underline"
          >
            Create a company account
          </Link>
        </p>

        <div className="space-y-5 border-t border-grey-200 pt-6">
          <div className="flex gap-3">
            <Shield className="mt-0.5 size-4.5 shrink-0 text-grey-500" />
            <div>
              <p className="text-[14px] font-semibold text-grey-900">Admin or Manager?</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-grey-600">
                Access the Enterprise Portal to manage departments and compliance.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <KeyRound className="mt-0.5 size-4.5 shrink-0 text-grey-500" />
            <div>
              <p className="text-[14px] font-semibold text-grey-900">Employee?</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-grey-600">
                <Link href={routes.auth.login} className="text-blue-500 hover:underline">
                  Use your SSO credentials
                </Link>{" "}
                for a seamless, secure login experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
