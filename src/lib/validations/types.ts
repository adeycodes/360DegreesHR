import { z } from "zod";

import type { ZodType } from "zod";

import { ValidationError } from "./parser";

/** Reusable primitives for API and forms */
export const idSchema = z.string().min(1, "ID is required");

export const emailSchema = z.email("Enter a valid email address");

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const paginatedMetaSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export function createPaginatedSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    data: z.array(itemSchema),
    meta: paginatedMetaSchema,
  });
}

/** Standard API error envelope from backend (adjust when contract is known) */
export const apiErrorBodySchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  details: z.record(z.string(), z.unknown()).optional(),
});
