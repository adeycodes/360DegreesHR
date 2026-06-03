"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AuthSplitLayout } from "@/shared/auth/auth-split-layout";
import { BrandLogo } from "@/shared/components/brand-logo";
import { routes } from "@/config/routes";

const OTP_LENGTH = 6;

export function VerifyOtpScreen() {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const maskedEmail = "m***@company.com";

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const char = value.slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setError(null);

    if (char && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!text) return;
    const next = [...digits];
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setDigits(next);
    inputRefs.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
    } finally {
      setIsLoading(false);
    }
  }

  function handleResend() {
    setDigits(Array(OTP_LENGTH).fill(""));
    setError(null);
    inputRefs.current[0]?.focus();
  }

  return (
    <AuthSplitLayout
      variant="otp-dark"
      hero={
        <div className="flex h-full flex-col">
          <BrandLogo className="[&_tspan]:fill-white [&_text]:fill-white" />
          <div className="mt-auto max-w-sm pb-6">
            <div className="mb-5 h-px w-10 bg-white/40" />
            <h2 className="text-[28px] leading-snug font-semibold text-white">
              Securing the future of workforce management.
            </h2>
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-[28px] font-semibold tracking-tight text-grey-900">
            Verify your identity
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-grey-600">
            We&apos;ve sent a 6-digit code to your registered email (
            <span className="font-medium text-grey-800">{maskedEmail}</span>).
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex gap-2.5">
            {Array.from({ length: OTP_LENGTH }).map((_, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digits[i]}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className="h-[52px] w-full rounded-lg border border-grey-200 bg-grey-100 text-center text-[20px] font-semibold text-grey-900 outline-none transition focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-400/25"
                aria-label={`Digit ${i + 1}`}
              />
            ))}
          </div>

          {error && (
            <p className="text-[13px] text-error-500" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="h-[48px] w-full rounded-lg bg-primary-500 text-[15px] font-medium text-white transition-colors hover:bg-primary-600 disabled:opacity-70"
          >
            {isLoading ? "Verifying…" : "Verify"}
          </button>
        </form>

        <div className="space-y-3 text-center">
          <p className="text-[14px] text-grey-600">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="font-medium text-primary-500 hover:underline"
            >
              Resend Code
            </button>
          </p>
          <Link
            href={routes.auth.loginPassword}
            className="flex items-center justify-center gap-1.5 text-[14px] text-grey-600 hover:text-grey-900"
          >
            <ArrowLeft className="size-4" />
            Back to login
          </Link>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
