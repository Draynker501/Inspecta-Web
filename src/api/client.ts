const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");
const TOKEN_KEY = "inspecta_token";

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

export class ApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly details?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export const isApiConfigured = Boolean(API_BASE_URL);
export const getApiBaseUrl = () => API_BASE_URL;
export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const setAuthToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearAuthToken = () => localStorage.removeItem(TOKEN_KEY);

function getErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;
  const record = data as Record<string, unknown>;
  if (typeof record.message === "string") return record.message;
  if (record.errors && typeof record.errors === "object") {
    const first = Object.values(record.errors as Record<string, unknown>)[0];
    if (Array.isArray(first) && typeof first[0] === "string") return first[0];
  }
  return fallback;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError("Falta configurar VITE_API_BASE_URL en .env.local.", 0);
  }

  const token = getAuthToken();
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let body: BodyInit | undefined;
  if (options.body !== undefined) {
    if (options.body instanceof FormData || typeof options.body === "string") {
      body = options.body as BodyInit;
    } else {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(options.body);
    }
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`, {
      ...options,
      headers,
      body,
    });
  } catch {
    throw new ApiError("No fue posible conectar con la API. Comprueba la URL, la conexión y CORS.", 0);
  }

  if (response.status === 204) {
    if (!response.ok) throw new ApiError(`Error HTTP ${response.status}`, response.status);
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  let responseData: unknown;
  if (contentType.includes("application/json")) {
    try { responseData = await response.json(); }
    catch { responseData = null; }
  } else {
    responseData = await response.text();
  }

  if (response.status === 401) clearAuthToken();
  if (!response.ok) {
    const fallback = `Error HTTP ${response.status}${response.statusText ? `: ${response.statusText}` : ""}`;
    throw new ApiError(getErrorMessage(responseData, fallback), response.status, responseData);
  }
  return responseData as T;
}
