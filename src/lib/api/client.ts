import type { ZodType } from "zod";

import { env } from "@/lib/env";
import { parseApiResponse } from "@/lib/validations/parse";

import { ApiError } from "./errors";

// ─── Options ────────────────────────────────────────────────────────

export type RequestOptions = {
  headers?: HeadersInit;
  timeoutMs?: number;
  cache?: RequestCache;
};

const TIMEOUT = 30_000;

// ─── Core fetch wrapper (private) ───────────────────────────────────

async function send<T>(
  method: string,
  path: string,
  schema: ZodType<T>,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const base = env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new ApiError({
      message: "NEXT_PUBLIC_API_URL is not configured",
      status: 0,
      userMessage: "Application is not configured to reach the server.",
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? TIMEOUT);

  try {
    const response = await fetch(`${base}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      cache: options.cache ?? "no-store",
    });

    // Let the backend tell us what went wrong
    if (!response.ok) {
      let serverMessage: string | undefined;
      try {
        const json = (await response.json()) as { message?: string };
        serverMessage = json.message;
      } catch { /* non-JSON body */ }

      throw new ApiError({
        message: serverMessage ?? response.statusText,
        status: response.status,
      });
    }

    // Parse JSON → unwrap envelope → validate with Zod
    return parseApiResponse(response, schema);
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError({
        message: "Request timeout",
        status: 408,
        userMessage: "The request took too long. Please try again.",
      });
    }

    throw new ApiError({
      message: error instanceof Error ? error.message : "Network error",
      status: 0,
      userMessage: "Unable to reach the server. Check your connection.",
    });
  } finally {
    clearTimeout(timer);
  }
}

// ─── Public helpers — use these in endpoint files ───────────────────

/** GET request — validates the response with a Zod schema */
export function get<T>(path: string, schema: ZodType<T>, options?: RequestOptions) {
  return send("GET", path, schema, undefined, options);
}

/** POST request — validates the response with a Zod schema */
export function post<T>(path: string, schema: ZodType<T>, body: unknown, options?: RequestOptions) {
  return send("POST", path, schema, body, options);
}

/** PUT request — validates the response with a Zod schema */
export function put<T>(path: string, schema: ZodType<T>, body: unknown, options?: RequestOptions) {
  return send("PUT", path, schema, body, options);
}

/** PATCH request — validates the response with a Zod schema */
export function patch<T>(path: string, schema: ZodType<T>, body: unknown, options?: RequestOptions) {
  return send("PATCH", path, schema, body, options);
}

/** DELETE request — validates the response with a Zod schema */
export function del<T>(path: string, schema: ZodType<T>, options?: RequestOptions) {
  return send("DELETE", path, schema, undefined, options);
}
