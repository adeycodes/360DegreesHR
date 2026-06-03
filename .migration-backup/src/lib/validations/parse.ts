import type { ZodType } from "zod";

import { ApiError, ValidationError } from "@/lib/api/errors";

/**
 * Parse JSON from a fetch Response, validate with a Zod schema.
 *
 * Automatically unwraps the backend envelope
 * `{ success, message, data }` so schemas only describe the inner `data`.
 */
export async function parseApiResponse<T>(
  response: Response,
  schema: ZodType<T>,
): Promise<T> {
  // Handle empty responses (like 204 No Content or 202 Accepted with no body)
  const text = await response.text();
  if (!text || text.trim() === "") {
    // If the schema allows an empty object, use it
    const result = schema.safeParse({});
    if (result.success) {
      return result.data;
    }
    // Otherwise return a standard success/fallback payload that fits the expected schema
    const fallback: Record<string, unknown> = {
      success: true,
      message: response.statusText || "Success",
    };
    const fallbackResult = schema.safeParse(fallback);
    if (fallbackResult.success) {
      return fallbackResult.data;
    }
    return fallback as unknown as T;
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new ApiError({
      message: "Response body is not valid JSON",
      status: 502,
      userMessage: "We received unexpected data. Please try again.",
    });
  }

  // Unwrap API envelope { success, message, data } if present
  if (
    json !== null &&
    typeof json === "object" &&
    "success" in (json as object) &&
    "data" in (json as object)
  ) {
    json = (json as { data: unknown }).data;
  }

  return parseData(schema, json);
}

/** Parse in-memory data (forms, env extensions, mocked fixtures) */
export function parseData<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    // Log validation errors in development
    if (typeof window !== "undefined") {
      console.error("Validation Error - Data received:", data);
      console.error("Validation Error - Issues:", result.error.issues);
    }
    throw new ValidationError(result.error);
  }
  return result.data;
}
