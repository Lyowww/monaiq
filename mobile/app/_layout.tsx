import { useEffect } from 'react';
import { Stack, useRouter, useSegments, type Href } from 'expo-router';
import { AppProviders } from '../src/providers/AppProviders';
import { BrandedSplashView } from '../src/components/splash/BrandedSplashView';
import { useAuthStore } from '../src/features/auth/store/useAuthStore';
import { useUiStore } from '../src/features/ui/store/useUiStore';
import { translate } from '../src/locales/i18n';
import { theme } from '../src/theme/tokens';

function RootNavigator() {
  const router = useRouter();
  const segments = useSegments();
  const status = useAuthStore((state) => state.status);
  const lang = useUiStore((s) => s.appLanguage);

  useEffect(() => {
    if (status === 'bootstrapping') {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (status === 'authenticated' && inAuthGroup) {
      router.replace('/(app)/(tabs)' as Href);
      return;
    }

    if (status === 'unauthenticated' && !inAuthGroup) {
      router.replace('/login');
    }
  }, [router, segments, status]);

  if (status === 'bootstrapping') {
    return <BrandedSplashView tagline={translate(lang, 'monaiq.tagline')} />;
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: theme.colors.background },
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 260
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
