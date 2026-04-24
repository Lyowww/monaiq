import { useLocalSearchParams, useRouter } from 'expo-router';
import { SubscriptionPaywallScreenContent } from '../../src/features/subscription/SubscriptionPaywallScreenContent';

export default function SubscriptionScreen() {
  const router = useRouter();
  const { featureId } = useLocalSearchParams<{ featureId?: string | string[] }>();
  const lockedFeatureId = Array.isArray(featureId) ? featureId[0] : featureId;

  return (
    <SubscriptionPaywallScreenContent
      lockedFeatureId={lockedFeatureId}
      onClose={() => router.back()}
    />
  );
}
