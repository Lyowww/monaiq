import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        animationDuration: 250,
        contentStyle: { backgroundColor: 'transparent' },
        headerShown: false
      }}
    />
  );
}
