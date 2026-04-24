import { Stack } from 'expo-router';
import { SubscriptionPaywallProvider } from '../../src/features/subscription/SubscriptionPaywallProvider';
import { theme } from '../../src/theme/tokens';

export default function AppLayout() {
  return (
    <SubscriptionPaywallProvider>
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 250,
        contentStyle: { backgroundColor: theme.colors.background }
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="quick-add"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          animationDuration: 280,
          headerShown: false
        }}
      />
      <Stack.Screen
        name="plans"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 280
        }}
      />
      <Stack.Screen
        name="subscription"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 280
        }}
      />
      <Stack.Screen
        name="assistant-chat"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 280
        }}
      />
      <Stack.Screen
        name="assistant-settings"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 280
        }}
      />
      <Stack.Screen
        name="assistant-try-asking"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 280
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 280
        }}
      />
      <Stack.Screen
        name="exchange-rates"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 280
        }}
      />
    </Stack>
    </SubscriptionPaywallProvider>
  );
}
