import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { router } from 'expo-router';

type PaywallContextValue = {
  open: (opts?: { featureId?: string }) => void;
  close: () => void;
};

const PaywallContext = createContext<PaywallContextValue | null>(null);

export function SubscriptionPaywallProvider({ children }: { children: ReactNode }) {
  const open = useCallback((opts?: { featureId?: string }) => {
    if (opts?.featureId) {
      router.push({ pathname: '/subscription', params: { featureId: opts.featureId } });
    } else {
      router.push('/subscription');
    }
  }, []);

  const close = useCallback(() => {
    router.back();
  }, []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return <PaywallContext.Provider value={value}>{children}</PaywallContext.Provider>;
}

export function useSubscriptionPaywall(): PaywallContextValue {
  const v = useContext(PaywallContext);
  if (!v) {
    throw new Error('useSubscriptionPaywall must be used inside SubscriptionPaywallProvider');
  }
  return v;
}
