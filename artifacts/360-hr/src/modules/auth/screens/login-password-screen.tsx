"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, HelpCircle, KeyRound, Loader2, Shield } from "lucide-react";
import { useState } from "react";

import { AuthSplitLayout } from "@/shared/auth/auth-split-layout";
import { AuthField, authInputClassName } from "@/shared/auth/auth-field";
import { LoginBuildingHero } from "@/shared/auth/login-building-hero";
import { BrandGoogleIcon } from "@/shared/icons/brand-google";
import { routes } from "@/config/routes";
import { toUserMessage, authApi } from "@/lib/api";
import type { LoginInput } from "@/types";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

export function LoginPasswordScreen() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [form, setForm] = useState<LoginInput>({ userEmail: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorBanner(null);

    const errors: Partial<Record<keyof LoginInput, string>> = {};
    if (!form.userEmail || !/\S+@\S+\.\S+/.test(form.userEmail)) {
      errors.userEmail = "Please provide a valid account email.";
    }
    if (!form.password) {
      errors.password = "Password is required.";
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
      router.push(routes.auth.signingIn);
    } catch (err) {
      const msg = toUserMessage(err);
      setErrorBanner(msg);
    } finally {
      setIsLoading(false);
    }
  }

  const emailHasError = !!fieldErrors.userEmail;

  return (
    <AuthSplitLayout
      variant="login-building"
      hero={
        <LoginBuildingHero
          title="Excellence in Human Capital."
          description="The architectural curator of workforce intelligence. Managing your global talent with precision, clarity, and institutional trust."
        />
      }
    >
      <div className="space-y-7">
        <div>
          <h2 className="text-[32px] font-semibold tracking-tight text-grey-900">Welcome back.</h2>
          <p className="mt-2 text-[15px] text-grey-600">Access your architectural HR dashboard.</p>
        </div>

        {errorBanner && (
          <div className="flex items-start gap-3 rounded-lg bg-error-50 border border-error-200 px-4 py-3">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-error-500" />
            <p className="text-[14px] text-error-700">{errorBanner}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <AuthField label="Email address" htmlFor="userEmail" error={fieldErrors.userEmail}>
            <div className="relative">
              <input
                id="userEmail"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={form.userEmail}
                onChange={(e) => {
                  setForm((f) => ({ ...f, userEmail: e.target.value }));
                  setFieldErrors((fe) => ({ ...fe, userEmail: undefined }));
                }}
                className={cn(
                  authInputClassName("pr-11"),
                  emailHasError && "border-error-400 focus:border-error-400 focus:ring-error-400/25",
                )}
              />
              {emailHasError && (
                <AlertCircle className="pointer-events-none absolute top-1/2 right-3.5 size-5 -translate-y-1/2 text-error-500" />
              )}
            </div>
          </AuthField>

          <AuthField
            label="Password"
            htmlFor="password"
            error={fieldErrors.password}
            labelAction={
              <Link
                href={routes.auth.forgotPassword}
                className="text-[13px] font-medium text-primary-500 normal-case hover:underline"
              >
                Forgot?
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
                onChange={(e) => {
                  setForm((f) => ({ ...f, password: e.target.value }));
                  setFieldErrors((fe) => ({ ...fe, password: undefined }));
                }}
                className={authInputClassName("pr-11")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 right-3.5 -translate-y-1/2 text-grey-400 hover:text-grey-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </AuthField>

          <label className="flex cursor-pointer items-center gap-2.5 text-[14px] text-grey-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 rounded border-grey-300"
            />
            Stay signed in for 30 days
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="flex h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-primary-500 text-[15px] font-medium text-white transition-colors hover:bg-primary-600 disabled:opacity-80"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-grey-200" />
            <span className="text-[11px] font-semibold tracking-[0.1em] text-grey-500 uppercase">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-grey-200" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex h-[44px] items-center justify-center gap-2 rounded-lg border border-grey-300 bg-white text-[14px] font-medium text-grey-900 transition hover:bg-grey-50"
            >
              <BrandGoogleIcon size={18} />
              Google
            </button>
            <button
              type="button"
              onClick={() => router.push(routes.auth.login)}
              className="flex h-[44px] items-center justify-center gap-2 rounded-lg border border-grey-300 bg-white text-[14px] font-medium text-grey-900 transition hover:bg-grey-50"
            >
              <Shield className="size-4 text-grey-600" />
              SSO
            </button>
          </div>
        </div>

        <p className="text-center text-[14px] text-grey-600">
          Don&apos;t have an account?{" "}
          <Link href="#" className="font-medium text-primary-500 hover:underline">
            Contact Administrator
          </Link>
        </p>
      </div>

      <button
        type="button"
        className="fixed right-5 bottom-20 flex size-10 items-center justify-center rounded-full border border-grey-200 bg-white shadow-md text-grey-500 hover:text-grey-900 lg:bottom-5"
        aria-label="Help"
      >
        <HelpCircle className="size-5" />
      </button>
    </AuthSplitLayout>
  );
}
