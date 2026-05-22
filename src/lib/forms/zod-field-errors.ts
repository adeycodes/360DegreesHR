import type { ZodError, ZodIssue } from "zod";

/** Map first Zod issue per field key — shared by auth forms */
export function fieldErrorsFromZod<T extends string>(
  issues: ZodIssue[] | ZodError["issues"],
): Partial<Record<T, string>> {
  const errors: Partial<Record<T, string>> = {};
  for (const issue of issues) {
    const key = issue.path[0] as T;
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}
