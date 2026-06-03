import type { ZodType } from "zod";
import { env } from "@/lib/env";
import { parseApiResponse } from "@/lib/validations/parse";
import { ApiError } from "./errors";

export type RequestOptions = {
  headers?: HeadersInit;
  timeoutMs?: number;
  cache?: RequestCache;
};

const TIMEOUT = 30_000;

async function send<T>(
  method: string,
  path: string,
  schema: ZodType<T>,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const base = env.NEXT_PUBLIC_API_URL;
  if (!base) throw new ApiError({ message: "API URL not configured", status: 0 });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? TIMEOUT);

  try {
    // Correctly initialize Headers with passed options
    const headers = new Headers(options.headers || {});

    // Set defaults only if they aren't already set
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    if (!headers.has("Accept")) headers.set("Accept", "application/json");

    const response = await fetch(`${base}${path}`, {
      method,
      headers, // Use the Headers instance
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      cache: options.cache ?? "no-store",
    });

    if (!response.ok) {
      let serverMessage: string | undefined;
      try {
        const json = await response.json().catch(() => ({}));
        serverMessage = json.message;
      } catch { /* ignore */ }

      throw new ApiError({
        message: serverMessage ?? response.statusText,
        status: response.status,
      });
    }

    return parseApiResponse(response, schema);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      message: error instanceof Error ? error.message : "Network error",
      status: 0,
      userMessage: "Unable to reach the server.",
    });
  } finally {
    clearTimeout(timer);
  }
}

export const get = <T>(p: string, s: ZodType<T>, o?: RequestOptions) => send("GET", p, s, undefined, o);
export const post = <T>(p: string, s: ZodType<T>, b: unknown, o?: RequestOptions) => send("POST", p, s, b, o);
export const put = <T>(p: string, s: ZodType<T>, b: unknown, o?: RequestOptions) => send("PUT", p, s, b, o);
export const del = <T>(p: string, s: ZodType<T>, o?: RequestOptions) => send("DELETE", p, s, undefined, o);