"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Lock } from "lucide-react";

import { BrandLogo } from "@/shared/components/brand-logo";
import { AuthFooter } from "@/shared/auth/auth-footer";
import { routes } from "@/config/routes";

export function SigningInScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const id = setInterval(() => {
      current += 2;
      setProgress(current);
      if (current >= 100) {
        clearInterval(id);
        setTimeout(() => router.push(routes.auth.welcome), 300);
      }
    }, 40);
    return () => clearInterval(id);
  }, [router]);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[480px]">
          <div className="rounded-2xl border border-grey-100 bg-white px-10 py-12 shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-[56px] items-center justify-center rounded-[14px] border-2 border-primary-400 bg-primary-50">
                <Check className="size-7 text-primary-500" strokeWidth={2.5} />
              </div>

              <h1 className="mt-6 text-[24px] font-bold tracking-tight text-grey-900">
                Signing you in...
              </h1>
              <p className="mt-2 text-[14px] leading-relaxed text-grey-500">
                Authentication successful. Redirecting to your dashboard at{" "}
                <strong className="font-semibold text-grey-800">360DegreesHR</strong>.
              </p>

              <div className="mt-8 w-full space-y-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-grey-100">
                  <div
                    className="h-full rounded-full bg-primary-500 transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold tracking-[0.1em] text-grey-400 uppercase">
                    Verifying security protocol
                  </span>
                  <span className="text-[10px] font-semibold text-grey-500">{progress}%</span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-2 text-[13px] text-grey-400">
                <Lock className="size-3.5" />
                <span>Secure session encrypted with AES-256</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AuthFooter />
    </div>
  );
}
