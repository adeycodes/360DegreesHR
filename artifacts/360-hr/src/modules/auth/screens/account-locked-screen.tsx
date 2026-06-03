"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";

import { AuthSplitLayout } from "@/shared/auth/auth-split-layout";
import { BrandLogo } from "@/shared/components/brand-logo";
import { routes } from "@/config/routes";

const LOCKOUT_SECONDS = 15 * 60;
const EVENT_ID = "SHIELD-HR-7729-AX";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function AccountLockedScreen() {
  const [remaining, setRemaining] = useState(LOCKOUT_SECONDS - 62);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [remaining]);

  return (
    <AuthSplitLayout
      variant="lockout-blue"
      hero={
        <div className="flex h-full flex-col">
          <BrandLogo className="[&_tspan]:fill-white [&_text]:fill-white" />
          <div className="mt-auto max-w-sm pb-6">
            <div className="mb-5 h-px w-10 bg-white/40" />
            <h2 className="text-[36px] leading-tight font-semibold text-white">
              Securing your enterprise data with surgical precision.
            </h2>
            <p className="mt-5 text-[14px] leading-relaxed text-white/75">
              Our advanced security protocols monitor every interaction to ensure
              the integrity of your human resource ecosystem remains
              uncompromised.
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        <div className="flex flex-col items-start">
          <BrandLogo className="mb-10 hidden lg:flex" />

          <div className="flex size-[72px] items-center justify-center rounded-2xl bg-error-50">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 3.33337L5 10V21.6667C5 29.5834 11.6667 37.0167 20 38.3334C28.3333 37.0167 35 29.5834 35 21.6667V10L20 3.33337Z" fill="#DC2626" fillOpacity="0.15" stroke="#DC2626" strokeWidth="2" strokeLinejoin="round" />
              <rect x="17.5" y="23.3334" width="5" height="2.5" rx="1.25" fill="#DC2626" />
              <path d="M23.75 16.25C23.75 13.8338 21.8162 12.5 20 12.5C18.1838 12.5 16.25 13.8338 16.25 16.25V20H23.75V16.25Z" stroke="#DC2626" strokeWidth="1.5" strokeLinejoin="round" />
              <rect x="14.1667" y="19.1667" width="11.6667" height="8.33333" rx="1.5" stroke="#DC2626" strokeWidth="1.5" />
              <circle cx="20" cy="23.3334" r="1.25" fill="#DC2626" />
            </svg>
          </div>

          <h2 className="mt-5 text-[26px] font-semibold text-grey-900">Account Locked</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-grey-600">
            For your security, your account has been temporarily locked due to
            multiple failed sign-in attempts. Please wait 15 minutes or contact
            your system administrator to reset your credentials.
          </p>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            className="flex h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-primary-500 text-[15px] font-medium text-white transition-colors hover:bg-primary-600"
          >
            Contact Support
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1C4.13 1 1 4.13 1 8s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm.75 10.5h-1.5v-5h1.5v5zm0-6.5h-1.5V3.5h1.5V5z" fill="white" />
            </svg>
          </button>

          <Link
            href={routes.auth.loginPassword}
            className="flex items-center justify-center gap-1.5 text-[15px] font-medium text-primary-500 hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to Sign In
          </Link>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-grey-200 bg-grey-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <Info className="size-4 shrink-0 text-grey-500" />
            <div>
              <p className="text-[10px] font-bold tracking-[0.1em] text-grey-500 uppercase">
                Security Event ID
              </p>
              <p className="mt-0.5 text-[13px] font-medium text-grey-900">{EVENT_ID}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold tracking-[0.1em] text-grey-500 uppercase">
              Time Remaining
            </p>
            <p className="mt-0.5 text-[13px] font-semibold text-error-500">
              {formatTime(remaining)}
            </p>
          </div>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
