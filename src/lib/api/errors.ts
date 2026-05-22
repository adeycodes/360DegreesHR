import type { ZodError } from "zod";

/** User-safe message — never expose internal details in production UI */
export function toUserMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.userMessage;
  }
  if (error instanceof ValidationError) {
    return "We received unexpected data. Please try again.";
  }
  return "Something went wrong. Please try again.";
}

export class ApiError extends Error {
  readonly name = "ApiError";
  readonly status: number;
  readonly code?: string;
  readonly userMessage: string;

  constructor(options: {
    message: string;
    status: number;
    code?: string;
    userMessage?: string;
  }) {
    super(options.message);
    this.status = options.status;
    this.code = options.code;
    this.userMessage = options.userMessage ?? defaultMessageForStatus(options.status);
  }
}

export class ValidationError extends Error {
  readonly name = "ValidationError";
  readonly zodError: ZodError;

  constructor(zodError: ZodError, message = "Response validation failed") {
    super(message);
    this.zodError = zodError;
  }
}

function defaultMessageForStatus(status: number): string {
  if (status === 401) return "Please sign in to continue.";
  if (status === 403) return "You do not have permission to do that.";
  if (status === 404) return "The requested resource was not found.";
  if (status >= 500) return "Our servers are unavailable. Please try again later.";
  return "Something went wrong. Please try again.";
}
