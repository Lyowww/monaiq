import { useCallback, useMemo } from 'react';
import { useUserProfileQuery } from '../../users/hooks/useUserProfileQuery';

export function useEntitlements() {
  const q = useUserProfileQuery();
  const entitled = q.data?.entitledFeatureIds ?? [];
  const set = useMemo(() => new Set(entitled), [entitled]);
  const hasFeature = useCallback((id: string) => set.has(id), [set]);
  return {
    ...q,
    entitledFeatureIds: entitled,
    hasFeature,
    subscriptionPlanKey: q.data?.settings?.subscriptionPlanKey ?? null,
    isPremiumFlag: q.data?.settings?.subscription === 'premium'
  };
}
