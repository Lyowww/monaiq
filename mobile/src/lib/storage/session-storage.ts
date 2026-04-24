import type { AuthSessionResponse } from '@ai-finance/shared-types';
import * as SecureStore from 'expo-secure-store';

const SESSION_STORAGE_KEY = 'ai-finance.auth-session';

export async function readSessionFromStorage(): Promise<AuthSessionResponse | null> {
  const storedValue = await SecureStore.getItemAsync(SESSION_STORAGE_KEY);
  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as AuthSessionResponse;
  } catch {
    await SecureStore.deleteItemAsync(SESSION_STORAGE_KEY);
    return null;
  }
}

export function persistSession(session: AuthSessionResponse): Promise<void> {
  return SecureStore.setItemAsync(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearPersistedSession(): Promise<void> {
  return SecureStore.deleteItemAsync(SESSION_STORAGE_KEY);
}
