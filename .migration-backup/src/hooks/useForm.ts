/**
 * Custom hook for form state management
 * Handles form input changes and validation
 */

import { useState, useCallback } from "react";

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

      // Clear error when user starts typing
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

      // Validate form
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
