"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";

import { AuthSplitLayout } from "@/components/shared/auth/auth-split-layout";
import { AuthField, authInputClassName } from "@/components/shared/auth/auth-field";
import { routes } from "@/config/routes";
import { toUserMessage } from "@/lib/api/errors";
import { authApi } from "@/lib/api/endpoints/auth";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations/auth";
import { toast } from "@/stores/toast-store";

export function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = forgotPasswordSchema.safeParse({ email } satisfies ForgotPasswordInput);
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message);
      return;
    }
    setFieldError(undefined);
    setIsLoading(true);
    try {
      const res = await authApi.forgotPassword(parsed.data);
      toast.success(res.message || "Password reset link sent successfully!");
      router.push(
        `${routes.auth.forgotPasswordSent}?email=${encodeURIComponent(parsed.data.email)}`,
      );
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
      variant="forgot-building"
      hero={
        <div className="flex h-full items-center justify-center">
          <div className="rounded-2xl border border-white/30 bg-white/15 px-10 py-8 text-center backdrop-blur-md">
            <p className="text-2xl font-semibold text-white">360DegreesHR</p>
            <p className="mt-2 text-white/90">Excellence in Human Capital</p>
            <div className="mx-auto mt-6 h-px w-12 bg-white/50" />
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-[32px] font-semibold tracking-tight text-[#111827]">
            Forgot Password
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-grey-600">
            Enter your email address and we&apos;ll send you a link to reset your
            password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthField label="Corporate email" htmlFor="email" error={fieldError}>
            <div className="relative">
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={authInputClassName("pr-11")}
              />
              <Mail className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-grey-500" />
            </div>
          </AuthField>

          {error ? <p className="text-body-3 text-error-500">{error}</p> : null}

          <button
            type="submit"
            disabled={isLoading}
            className="h-[48px] w-full rounded-lg bg-[#3B82F6] text-[13px] font-semibold tracking-[0.08em] text-white uppercase transition-colors hover:bg-[#2563EB] disabled:opacity-70"
          >
            {isLoading ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <Link
          href={routes.auth.loginPassword}
          className="flex items-center justify-center gap-2 text-[15px] font-medium text-[#3B82F6] hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Sign In
        </Link>
      </div>
    </AuthSplitLayout>
  );
}
