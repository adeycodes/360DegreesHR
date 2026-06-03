"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import { useState } from "react";

import { AuthSplitLayout } from "@/shared/auth/auth-split-layout";
import { AuthField, authInputClassName } from "@/shared/auth/auth-field";
import { GlassBrandCard } from "@/shared/auth/glass-brand-card";
import { routes } from "@/config/routes";
import { toUserMessage, authApi } from "@/lib/api";
import { toast } from "@/stores/toast-store";

export function ResetPasswordScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const errors: Partial<Record<string, string>> = {};
    if (!password || password.length < 8) errors.password = "Password must be at least 8 characters";
    if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setIsLoading(true);
    try {
      const res = await authApi.resetPassword({ token: tokenFromUrl, password });
      toast.success(res.message || "Password reset successfully! Please sign in with your new password.");
      router.push(routes.auth.loginPassword);
    } catch (err) {
      const msg = toUserMessage(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  const heroCard = (
    <div className="flex h-full items-center justify-center">
      <GlassBrandCard title="360DegreesHR" description="Excellence in Human Capital" footerLabel="" />
    </div>
  );

  if (!tokenFromUrl) {
    return (
      <AuthSplitLayout variant="forgot-building" hero={heroCard}>
        <p className="text-body-2 text-error-500">
          Invalid reset link.{" "}
          <Link href={routes.auth.forgotPassword} className="text-blue-500 underline">
            Request a new one
          </Link>
        </p>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout variant="forgot-building" hero={heroCard}>
      <div className="space-y-8">
        <div>
          <h2 className="text-[32px] font-semibold text-grey-900">Reset password</h2>
          <p className="mt-2 text-[15px] text-grey-600">Choose a new password for your account.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthField label="New password" htmlFor="password" error={fieldErrors.password}>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={authInputClassName("pr-11")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-grey-500"
              >
                <Eye className="size-5" />
              </button>
            </div>
          </AuthField>
          <AuthField label="Confirm password" htmlFor="confirm" error={fieldErrors.confirmPassword}>
            <input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={authInputClassName()}
            />
          </AuthField>
          {error ? <p className="text-body-3 text-error-500">{error}</p> : null}
          <button
            type="submit"
            disabled={isLoading}
            className="h-[48px] w-full rounded-lg bg-primary-500 text-[15px] font-medium text-white hover:bg-primary-600"
          >
            {isLoading ? "Updating…" : "Update password"}
          </button>
        </form>
        <Link
          href={routes.auth.loginPassword}
          className="flex items-center justify-center gap-2 text-[15px] font-medium text-blue-500"
        >
          <ArrowLeft className="size-4" />
          Back to Sign In
        </Link>
      </div>
    </AuthSplitLayout>
  );
}
