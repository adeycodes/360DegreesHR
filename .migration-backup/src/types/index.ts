/** Shared app types that are not inferred from Zod schemas */
export type Nullable<T> = T | null;

export type AsyncStatus = "idle" | "loading" | "success" | "error";
