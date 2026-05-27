/**
 * Custom hooks - reusable logic for common patterns
 * Consolidated into a single file to reduce redundancy
 */

import { useState, useCallback, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { getAccessToken } from "@/lib/utilities";

// ============================================================================
// USE ASYNC HOOK
// ============================================================================

interface UseAsyncOptions {
  onError?: (error: Error) => void;
  onSuccess?: (data: unknown) => void;
}

export function useAsync(options?: UseAsyncOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const execute = useCallback(
    async <T,>(promise: Promise<T>): Promise<T | null> => {
      try {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

        const result = await promise;

        setIsSuccess(true);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options?.onError?.(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [options],
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setIsSuccess(false);
  }, []);

  return { isLoading, error, isSuccess, execute, reset };
}

// ============================================================================
// USE AUTH HOOK
// ============================================================================

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isHydrated,
    setSession,
    clearSession,
    setHydrated,
  } = useAuthStore();

  const [isSessionValid, setIsSessionValid] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (token && !isAuthenticated) {
      setIsSessionValid(true);
    } else if (!token && isAuthenticated) {
      clearSession();
    } else {
      setIsSessionValid(isAuthenticated);
    }
  }, [isAuthenticated, clearSession]);

  return {
    user,
    isAuthenticated: isAuthenticated && isSessionValid,
    isHydrated,
    setSession,
    clearSession,
    setHydrated,
  };
}

// ============================================================================
// USE FORM HOOK
// ============================================================================

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit?: (values: T) => void | Promise<void>;
  onValidate?: (values: T) => Record<string, string>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  onValidate,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const finalValue =
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

      setValues((prev) => ({
        ...prev,
        [name]: finalValue,
      }));

      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (onValidate) {
        const newErrors = onValidate(values);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
          return;
        }
      }

      setIsSubmitting(true);
      try {
        await onSubmit?.(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, onSubmit, onValidate],
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
  };
}
