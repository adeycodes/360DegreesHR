/**
 * Custom hook for API loading states
 * Handles loading, error, and success states for async operations
 */

import { useState, useCallback } from "react";

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
