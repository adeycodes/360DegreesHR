const TOKEN_COOKIE = "auth_token";
const TOKEN_STORAGE_KEY = "auth_token";

function getTokenFromCookie(): string | null {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  // Prioritize sessionStorage as it's more reliable for SPA auth
  const token = sessionStorage.getItem(TOKEN_STORAGE_KEY) ?? getTokenFromCookie();
  return token;
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; SameSite=Lax${secure}`;
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function getAuthHeader(): HeadersInit {
  const token = getAccessToken();
  console.log("[Auth] Retrieved token:", token);

  if (!token) {
    console.log("[Auth] No access token found in session or cookies.");

    console.warn("[Auth] No access token found in session or cookies.");
    return {};
  }

  // Return the header explicitly
  return {
    Authorization: `Bearer ${token}`
  };
}