/**
 * Common constants used throughout the application
 * Avoid hardcoding magic numbers and strings
 */

/** Timing constants (in milliseconds) */
export const TIMINGS = {
  SPLASH_SCREEN_DURATION: 2500,
  ANIMATION_FAST: 300,
  ANIMATION_NORMAL: 500,
  ANIMATION_SLOW: 800,
  TOAST_DURATION: 4000,
  DEBOUNCE_INPUT: 300,
} as const;

/** API constants */
export const API = {
  REQUEST_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

/** Pagination constants */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [10, 25, 50, 100] as const,
} as const;

/** Form constants */
export const FORM = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 254,
} as const;

/** Validation error messages */
export const ERROR_MESSAGES = {
  REQUIRED: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  PASSWORD_TOO_SHORT: `Password must be at least ${FORM.PASSWORD_MIN_LENGTH} characters`,
  PASSWORD_TOO_LONG: `Password must not exceed ${FORM.PASSWORD_MAX_LENGTH} characters`,
  PASSWORDS_DONT_MATCH: "Passwords do not match",
  USERNAME_TOO_SHORT: `Username must be at least ${FORM.USERNAME_MIN_LENGTH} characters`,
  INVALID_URL: "Please enter a valid URL",
  NETWORK_ERROR: "Network error. Please try again.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNAUTHORIZED: "Unauthorized. Please log in again.",
  FORBIDDEN: "You do not have permission to perform this action.",
} as const;

/** Toast messages */
export const TOAST_MESSAGES = {
  SUCCESS: "Operation completed successfully",
  ERROR: "An error occurred. Please try again.",
  LOADING: "Loading...",
  SAVED: "Changes saved successfully",
  DELETED: "Item deleted successfully",
} as const;
