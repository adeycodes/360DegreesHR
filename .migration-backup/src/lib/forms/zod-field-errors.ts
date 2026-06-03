import type { ZodIssue } from "zod";

/**
 * Maps the first Zod validation issue per field key.
 * Useful for extracting field-specific error messages in forms.
 *
 * @param issues - Array of Zod issues from a validation error
 * @returns An object with field keys mapped to their first error message
 */
export function fieldErrorsFromZod<T extends string>(
  issues: ZodIssue[]
): Partial<Record<T, string>> {
  const errors: Partial<Record<T, string>> = {};

  for (const issue of issues) {
    // Get the first path segment (field name)
    const pathSegment = issue.path[0];
    // Ensure the path segment is a valid string key
    const key = typeof pathSegment === "string" ? (pathSegment as T) : null;

    // Only store the first error encountered for each field
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  }

  return errors;
}