"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Lock, Menu } from "lucide-react";

import { AuthSplitLayout } from "@/components/shared/auth/auth-split-layout";
import { AuthField, authInputClassName } from "@/components/shared/auth/auth-field";
import { BrandLogo } from "@/components/shared/brand-logo";
import { routes } from "@/config/routes";

export function LoginSsoScreen() {
  const [orgEmail, setOrgEmail] = useState("");

  const handleSsoLogin = (provider: string) => {
    console.log(`Initiating SSO login with ${provider} for: ${orgEmail}`);
    // Add your actual SSO logic here
  };

  return (
    <AuthSplitLayout
      hideFooter
      variant="sso-office"
      hero={
        <>
          <BrandLogo className="lg:[&_tspan]:fill-white w-2 lg:[&_text]:fill-white" />
          <div className="mt-auto max-w-xl pb-4">
            <h1 className="text-[2.75rem] leading-[1.15] font-light tracking-tight text-grey-900 lg:text-white">
              Architecting the future of{" "}
              <span className="font-normal text-blue-500 lg:text-blue-200">
                human potential.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-grey-600 lg:text-white/85">
              Experience a refined approach to organizational intelligence. Our
              platform harmonizes workforce data with editorial precision,
              allowing you to curate talent with institutional trust.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="min-w-[140px] rounded-xl border border-grey-200/80 bg-white px-5 py-4 shadow-sm">
                <p className="text-[10px] font-semibold tracking-wider text-grey-500 uppercase">
                  System Status
                </p>
                <p className="mt-1.5 flex items-center gap-2 text-sm font-medium text-grey-900">
                  <span className="size-2 rounded-full bg-success-500" />
                  Operational
                </p>
              </div>
              <div className="min-w-[140px] rounded-xl border border-grey-200/80 bg-white px-5 py-4 shadow-sm">
                <p className="text-[10px] font-semibold tracking-wider text-grey-500 uppercase">
                  Global Latency
                </p>
                <p className="mt-1.5 text-sm font-medium text-grey-900">12ms</p>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap gap-8 text-[13px] text-grey-600 lg:text-white/75">
              <span>4.9/5 Enterprise Grade Trust</span>
              <span>ISO 27001 Certified</span>
            </div>
          </div>
        </>
      }
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-[26px] font-semibold tracking-tight text-grey-900">
            Sign In with SSO
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-grey-600">
            Your organization uses Single Sign-On for a more secure and seamless
            login experience.
          </p>
        </div>

        <AuthField
          label="Organization account"
          htmlFor="org-email"
          labelAction={<Lock className="size-4 text-grey-400" aria-hidden />}
        >
          <div className="relative">
            <input
              id="org-email"
              type="email"
              className={authInputClassName("pr-10")}
              placeholder="name@organization.com"
              value={orgEmail}
              onChange={(e) => setOrgEmail(e.target.value)}
            />
            <Check
              className="absolute top-1/2 right-3 size-5 -translate-y-1/2 text-blue-500"
              strokeWidth={2.5}
            />
          </div>
        </AuthField>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleSsoLogin("Okta")}
            className="flex h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-blue-500 text-[15px] font-medium text-white transition-colors hover:bg-blue-600"
          >
            <Menu className="size-4" />
            Sign In with Okta
          </button>
          <button
            type="button"
            onClick={() => handleSsoLogin("Google")}
            className="flex h-[48px] w-full items-center justify-center rounded-lg border border-grey-300 bg-white text-[15px] font-medium text-grey-900 transition-colors hover:bg-grey-50"
          >
            Continue with Google Workspace
          </button>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-grey-200" />
            <span className="text-[10px] font-semibold tracking-[0.12em] text-grey-500 uppercase">
              Administrative access
            </span>
            <div className="h-px flex-1 bg-grey-200" />
          </div>
          <Link
            href={routes.auth.loginPassword}
            className="block text-center text-[15px] font-medium text-blue-500 hover:underline"
          >
            Sign in with password →
          </Link>
        </div>
      </div>
    </AuthSplitLayout>
  );
}