const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export type ApiErrorShape = {
  code: string;
  message: string;
  fields?: Record<string, string>;
};

export class ApiError extends Error {
  constructor(public status: number, public payload: ApiErrorShape) {
    super(payload.message);
    this.name = "ApiError";
  }
  /** Field-level messages for form display. */
  get fields() {
    return this.payload.fields ?? {};
  }
}

/**
 * Access token lives in memory only — never localStorage, which any XSS can
 * read. It's lost on refresh, and rehydrated from the httpOnly refresh cookie.
 */
let accessToken: string | null = null;
export const setAccessToken = (t: string | null) => void (accessToken = t);
export const getAccessToken = () => accessToken;

let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  // Collapse concurrent 401s into one refresh, or a page with 5 queries
  // fires 5 refreshes and rotation invalidates all but one.
  if (refreshing) return refreshing;

  refreshing = (async () => {
    try {
      const res = await fetch(`${BASE}/api/v1/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) return null;
      const json = await res.json();
      setAccessToken(json.accessToken);
      return json.accessToken as string;
    } catch {
      return null;
    } finally {
      refreshing = null;
    }
  })();

  return refreshing;
}

type Options = Omit<RequestInit, "body"> & { body?: unknown; retry?: boolean };

export async function api<T = unknown>(path: string, opts: Options = {}): Promise<T> {
  const { body, retry = true, headers, ...rest } = opts;
  const isFormData = body instanceof FormData;

  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      ...(!isFormData && body !== undefined && { "Content-Type": "application/json" }),
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...headers,
    },
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Access token expired → refresh once, then replay the original request.
  if (res.status === 401 && retry) {
    const fresh = await refreshAccessToken();
    if (fresh) return api<T>(path, { ...opts, retry: false });
  }

  if (res.status === 204) return undefined as T;

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      json?.error ?? { code: "UNKNOWN", message: `Request failed (${res.status})` }
    );
  }
  return json as T;
}

export const bootstrapSession = refreshAccessToken;
export const API_BASE = BASE;
