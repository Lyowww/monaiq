import Constants from 'expo-constants';

const DEFAULT_DEV_API_BASE = 'http://localhost:3001/api';

/**
 * Resolves the backend REST base URL including the global `/api` prefix.
 * Set `EXPO_PUBLIC_API_URL` in `mobile/.env` (e.g. `http://192.168.1.10:3001/api` on a device).
 * Also available at runtime as `expo-constants` `extra.apiUrl` from `app.config.js`.
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  const fromExtra = (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl;

  const raw =
    typeof fromEnv === 'string' && fromEnv.trim().length > 0
      ? fromEnv.trim()
      : typeof fromExtra === 'string' && fromExtra.trim().length > 0
        ? fromExtra.trim()
        : null;

  if (raw) {
    return raw.replace(/\/+$/, '');
  }

  return DEFAULT_DEV_API_BASE;
}
