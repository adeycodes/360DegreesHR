import type { ZodError } from "zod";

export function fieldErrorsFromZod<T extends Record<string, string>>(error: ZodError): Partial<T> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    if (issue.path.length > 0) {
      const key = issue.path[0] as string;
      errors[key] = issue.message;
    }
  }
  return errors as Partial<T>;
}
