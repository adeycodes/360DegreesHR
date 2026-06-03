"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Calendar, MapPin, ChevronRight } from "lucide-react";

import { BrandLogo } from "@/shared/components/brand-logo";
import { AuthFooter } from "@/shared/auth/auth-footer";
import { routes } from "@/config/routes";
import { useAuthStore } from "@/stores/auth-store";

const REDIRECT_SECONDS = 3;

const AGENDA = [
  { title: "Design System Sync", time: "10:30 AM", location: "Zoom", icon: "📹" },
  { title: "Payroll Module Feedback", time: "01:00 PM", location: "Conf Room A", icon: "👥" },
  { title: "Candidate Interview: Senior UX", time: "03:45 PM", location: "Sarah Jenkins", icon: "👤" },
];

export function WelcomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const fullName = user?.name ?? "Segun Thorne";
  const role = "Senior Product Designer";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const location = "Lagos HQ";
  const reviewPct = 82;

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          router.push(routes.app.dashboard);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [router]);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <header className="px-6 pt-6 sm:px-10">
        <BrandLogo />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-[680px] space-y-10">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-[56px] items-center justify-center rounded-[14px] bg-primary-50">
              <Check className="size-7 text-primary-400" strokeWidth={2.5} />
            </div>
            <h1 className="mt-6 text-[40px] font-bold tracking-tight text-grey-900 sm:text-[48px]">
              Welcome back, {firstName}.
            </h1>
            <p className="mt-2 text-[16px] text-grey-500">Your workspace is ready.</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-grey-200 shadow-sm">
            <div className="grid grid-cols-1 divide-y divide-grey-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="size-[52px] shrink-0 overflow-hidden rounded-full bg-grey-200">
                    <div className="flex size-full items-center justify-center bg-grey-300 text-[20px] font-bold text-grey-600">
                      {fullName.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-grey-900">{fullName}</p>
                    <p className="text-[13px] font-semibold tracking-wide text-primary-500 uppercase">
                      {role}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <div className="flex items-center gap-2 text-[13px] text-grey-600">
                    <Calendar className="size-4 text-grey-400" />
                    {today}
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-grey-600">
                    <MapPin className="size-4 text-grey-400" />
                    {location}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-[0.1em] text-grey-500 uppercase">
                      Quarterly Review
                    </span>
                    <span className="text-[13px] font-bold text-primary-500">{reviewPct}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-grey-100">
                    <div
                      className="h-full rounded-full bg-primary-500"
                      style={{ width: `${reviewPct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-[0.1em] text-grey-500 uppercase">
                    Today&apos;s Agenda
                  </span>
                  <span className="rounded-full bg-primary-50 px-3 py-1 text-[12px] font-semibold text-primary-600">
                    3 Active tasks
                  </span>
                </div>
                <div className="space-y-1">
                  {AGENDA.map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      className="flex w-full items-center justify-between rounded-lg px-2 py-3 text-left transition hover:bg-grey-50"
                    >
                      <div>
                        <p className="text-[14px] font-semibold text-grey-900">{item.title}</p>
                        <p className="mt-0.5 text-[12px] text-grey-500">
                          🕐 {item.time} &nbsp; {item.location}
                        </p>
                      </div>
                      <ChevronRight className="size-4 shrink-0 text-grey-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => router.push(routes.app.dashboard)}
              className="flex h-[52px] w-[220px] items-center justify-center gap-2 rounded-xl bg-primary-500 text-[15px] font-semibold text-white transition-colors hover:bg-primary-600"
            >
              Go to Dashboard
              <span>→</span>
            </button>
            <p className="text-[11px] font-semibold tracking-[0.12em] text-grey-400 uppercase">
              Redirecting in{" "}
              <span className="text-primary-500">{countdown}</span>{" "}
              seconds...
            </p>
          </div>
        </div>
      </main>

      <AuthFooter />
    </div>
  );
}
