import type { AuthSessionResponse } from '@ai-finance/shared-types';
import { create } from 'zustand';
import {
  clearPersistedSession,
  persistSession,
  readSessionFromStorage
} from '../../../lib/storage/session-storage';

type AuthStatus = 'bootstrapping' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: AuthStatus;
  session: AuthSessionResponse | null;
  hydrate: () => Promise<void>;
  setSession: (session: AuthSessionResponse) => Promise<void>;
  clearSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'bootstrapping',
  session: null,
  hydrate: async () => {
    const session = await readSessionFromStorage();

    set({
      session,
      status: session ? 'authenticated' : 'unauthenticated'
    });
  },
  setSession: async (session) => {
    await persistSession(session);

    set({
      session,
      status: 'authenticated'
    });
  },
  clearSession: async () => {
    await clearPersistedSession();

    set({
      session: null,
      status: 'unauthenticated'
    });
  }
}));
