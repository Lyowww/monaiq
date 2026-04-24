import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { AppFixedHeader } from '../../../src/components/navigation/AppFixedHeader';
import { MonAiqTabBar } from '../../../src/components/navigation/MonAiqTabBar';
import { theme } from '../../../src/theme/tokens';

export default function TabsLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: theme.colors.background }
      }}
      tabBar={(props) => <MonAiqTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="stats" />
      <Tabs.Screen name="assistant" />
      <Tabs.Screen name="wallet" />
      <Tabs.Screen name="profile" />
    </Tabs>
    <AppFixedHeader />
    </View>
  );
}
