import type { AuthSessionResponse } from '@ai-finance/shared-types';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { getApiBaseUrl } from '../config/apiBaseUrl';

type ApiRequestOptions = RequestInit & {
  requiresAuth?: boolean;
  skipRefresh?: boolean;
  /**
   * When set, logs response status, URL, and raw body to `console.warn` (always, not only in __DEV__).
   * Use for debugging endpoints where failures happen before the caller can see the response.
   */
  debugLog?: string;
};

type ApiErrorPayload = {
  message?: string;
  errorCode?: string;
};

let refreshPromise: Promise<AuthSessionResponse | null> | null = null;

export class ApiError extends Error {
  readonly status: number;
  readonly errorCode?: string;

  constructor(status: number, message: string, errorCode?: string) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { requiresAuth = false, skipRefresh = false, debugLog, headers, body, ...rest } = options;
  const session = useAuthStore.getState().session;
  const requestHeaders = new Headers(headers);

  if (!(body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (requiresAuth && session?.accessToken) {
    requestHeaders.set('Authorization', `Bearer ${session.accessToken}`);
  }

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path}`;

  if (debugLog) {
    try {
      console.warn(`[apiRequest:${debugLog}] → ${(rest as { method?: string }).method ?? 'GET'} ${url}`);
    } catch {
      /* ignore */
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...rest,
      headers: requestHeaders,
      body
    });
  } catch (err) {
    if (debugLog) {
      console.warn(`[apiRequest:${debugLog}] network error:`, err);
    }
    throw err;
  }

  if (debugLog) {
    const peek = await response.clone().text();
    const preview = peek.length > 8000 ? `${peek.slice(0, 8000)}…(truncated)` : peek;
    try {
      console.warn(
        `[apiRequest:${debugLog}] ← status=${response.status} ${url}\n--- body start ---\n${preview}\n--- body end ---`
      );
    } catch {
      /* ignore */
    }
  }

  if (response.status === 401 && requiresAuth && !skipRefresh && session?.refreshToken) {
    const refreshedSession = await refreshAccessToken(session.refreshToken);

    if (refreshedSession) {
      return apiRequest<T>(path, {
        ...options,
        skipRefresh: true
      });
    }
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return parseJsonBodyOrThrow<T>(response);
}

async function refreshAccessToken(refreshToken: string): Promise<AuthSessionResponse | null> {
  if (!refreshPromise) {
    refreshPromise = performRefresh(refreshToken).finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function performRefresh(refreshToken: string): Promise<AuthSessionResponse | null> {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      refreshToken
    })
  });

  if (!response.ok) {
    await useAuthStore.getState().clearSession();
    return null;
  }

  const nextSession = (await response.json()) as AuthSessionResponse;
  await useAuthStore.getState().setSession(nextSession);
  return nextSession;
}

async function toApiError(response: Response): Promise<ApiError> {
  let payload: ApiErrorPayload & { message?: string | string[] } | null = null;

  let errBody = '';
  try {
    const text = await response.text();
    errBody = text;
    if (text.trim()) {
      payload = JSON.parse(text) as typeof payload;
    }
  } catch {
    payload = null;
  }

  const message = payload
    ? formatNestErrorMessage((payload as { message?: string | string[] } | null)?.message)
    : errBody.trim()
      ? `Non-JSON error response (HTTP ${response.status}). ${errBody.replace(/\s+/g, ' ').slice(0, 200)}${errBody.length > 200 ? '…' : ''}`
      : `HTTP ${response.status} with no error body.`;

  return new ApiError(
    response.status,
    message,
    (payload as ApiErrorPayload | null)?.errorCode
  );
}

function formatNestErrorMessage(message: string | string[] | undefined): string {
  if (message == null) {
    return 'Unexpected API error';
  }
  if (Array.isArray(message)) {
    return message.map(String).filter(Boolean).join('. ') || 'Unexpected API error';
  }
  if (typeof message === 'string' && message.trim().length > 0) {
    return message;
  }
  return 'Unexpected API error';
}

async function parseJsonBodyOrThrow<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text.trim()) {
    throw new ApiError(
      response.status,
      'The server sent an empty response. Check that EXPO_PUBLIC_API_URL in mobile/.env includes /api and points at this machine (use your LAN IP on a real device, not localhost).',
      'EMPTY_RESPONSE'
    );
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiError(
      response.status,
      `The server did not return JSON. Check the API base URL. Preview: ${text.replace(/\s+/g, ' ').slice(0, 200)}…`,
      'INVALID_JSON'
    );
  }
}
