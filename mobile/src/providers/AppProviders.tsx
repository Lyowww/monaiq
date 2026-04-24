import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppErrorBoundary } from '../components/AppErrorBoundary';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { PushNotificationSetup } from '../features/push/PushNotificationSetup';
import { asyncStoragePersister, queryClient } from '../lib/queryClient';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{
            persister: asyncStoragePersister,
            maxAge: 24 * 60 * 60 * 1000,
            buster: 'v2'
          }}
        >
          <AppErrorBoundary>
            <PushNotificationSetup />
            {children}
          </AppErrorBoundary>
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
