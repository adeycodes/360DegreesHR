"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";

import { AuthSplitLayout } from "@/components/shared/auth/auth-split-layout";
import { AuthField, authInputClassName } from "@/components/shared/auth/auth-field";
import { routes } from "@/config/routes";
import { toUserMessage } from "@/lib/api/errors";
import { authApi } from "@/lib/api/endpoints/auth";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";
import { toast } from "@/stores/toast-store";

interface FormState {
  email: string;
  fieldError: string | undefined;
  error: string | null;
  isLoading: boolean;
}

const INITIAL_FORM_STATE: FormState = {
  email: "",
  fieldError: undefined,
  error: null,
  isLoading: false,
};

export function ForgotPasswordScreen() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);
  const { email, fieldError, error, isLoading } = formState;

  const updateFormState = useCallback((updates: Partial<FormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormState({ email: e.target.value, error: null, fieldError: undefined });
  }, [updateFormState]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset errors
    updateFormState({ error: null, fieldError: undefined });
    
    // Validate email
    const validationResult = forgotPasswordSchema.safeParse({ email } satisfies ForgotPasswordInput);
    
    if (!validationResult.success) {
      const firstErrorMessage = validationResult.error.issues[0]?.message;
      updateFormState({ fieldError: firstErrorMessage });
      return;
    }
    
    // Start loading
    updateFormState({ isLoading: true });
    
    try {
      const response = await authApi.forgotPassword(validationResult.data);
      
      toast.success(response.message || "Password reset link sent successfully!");
      
      router.push(
        `${routes.auth.forgotPasswordSent}?email=${encodeURIComponent(validationResult.data.email)}`
      );
    } catch (error) {
      const userMessage = toUserMessage(error);
      updateFormState({ error: userMessage });
      toast.error(userMessage);
    } finally {
      updateFormState({ isLoading: false });
    }
  }, [email, router, updateFormState]);

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
        {/* Header Section */}
        <div>
          <h2 className="text-[32px] font-semibold tracking-tight text-[#111827]">
            Forgot Password
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-grey-600">
            Enter your email address and we&apos;ll send you a link to reset your
            password.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <AuthField 
            label="Corporate email" 
            htmlFor="email" 
            error={fieldError}
          >
            <div className="relative">
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading}
                className={authInputClassName("pr-11")}
                aria-invalid={!!fieldError}
                aria-describedby={fieldError ? "email-error" : undefined}
              />
              <Mail 
                className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-grey-500" 
                aria-hidden="true"
              />
            </div>
          </AuthField>

          {/* Error Message */}
          {error && (
            <p 
              className="text-body-3 text-error-500" 
              role="alert"
            >
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="h-[48px] w-full rounded-lg bg-[#3B82F6] text-[13px] font-semibold tracking-[0.08em] text-white uppercase transition-colors hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            aria-busy={isLoading}
          >
            {isLoading ? "Sending…" : "Send reset link"}
          </button>
        </form>

        {/* Back Link */}
        <Link
          href={routes.auth.loginPassword}
          className="flex items-center justify-center gap-2 text-[15px] font-medium text-[#3B82F6] transition-colors hover:text-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 rounded-md"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </AuthSplitLayout>
  );
}