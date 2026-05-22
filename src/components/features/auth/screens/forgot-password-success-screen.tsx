"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { useState } from "react";

import { AuthSplitLayout } from "@/components/shared/auth/auth-split-layout";
import { routes } from "@/config/routes";
import { toUserMessage } from "@/lib/api/errors";
import { authApi } from "@/lib/api/endpoints/auth";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { toast } from "@/stores/toast-store";

export function ForgotPasswordSuccessScreen() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "your email";
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleResend() {
    setError(null);
    setMessage(null);
    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) return;
    setIsLoading(true);
    try {
      const res = await authApi.forgotPassword(parsed.data);
      const msg = res.message || "Password reset link resent successfully!";
      setMessage(msg);
      toast.success(msg);
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
      variant="forgot-success-blue"
      rightClassName="bg-[#F9FAFB]"
      hero={
        <div className="flex h-full flex-col">
          <span className="font-brand text-lg font-semibold text-white">
            <span>360</span>
            <span className="text-[#7DD3FC]">Degrees</span>
            <span>HR</span>
          </span>
          <div className="mt-auto max-w-md pb-6">
            <div className="mb-6 h-px w-10 bg-white/40" />
            <h2 className="text-[26px] leading-snug font-semibold text-white">
              Securing the future of workforce management.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/80">
              Precision-built tools designed for the modern architectural HR
              leader. Authenticated, secure, and intuitive.
            </p>
          </div>
        </div>
      }
    >
      <div className="rounded-2xl border border-grey-200 bg-white px-8 py-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:px-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#0CAF60]/15">
          <Check className="size-7 text-[#0CAF60]" strokeWidth={2.5} />
        </div>
        <h2 className="mt-6 text-center text-[24px] font-semibold text-[#111827]">
          Check your email
        </h2>
        <p className="mt-3 text-center text-[15px] leading-relaxed text-grey-600">
          We&apos;ve sent a password reset link to{" "}
          <strong className="font-semibold text-grey-900">{email}</strong>.
          Please check your inbox and follow the instructions.
        </p>

        {message ? (
          <p className="mt-4 text-center text-body-3 text-success-500">{message}</p>
        ) : null}
        {error ? (
          <p className="mt-4 text-center text-body-3 text-error-500">{error}</p>
        ) : null}

        <button
          type="button"
          onClick={handleResend}
          disabled={isLoading}
          className="mt-8 h-[48px] w-full rounded-lg bg-[#3B82F6] text-[15px] font-medium text-white hover:bg-[#2563EB] disabled:opacity-70"
        >
          {isLoading ? "Sending…" : "Resend link"}
        </button>

        <Link
          href={routes.auth.loginPassword}
          className="mt-6 flex items-center justify-center gap-2 text-[15px] font-medium text-[#3B82F6] hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Sign in
        </Link>

        <p className="mt-8 text-center text-[13px] text-grey-500">
          Didn&apos;t receive an email? Check your spam folder or{" "}
          <Link href="#" className="text-[#3B82F6] hover:underline">
            contact support
          </Link>
          .
        </p>
      </div>
    </AuthSplitLayout>
  );
}
