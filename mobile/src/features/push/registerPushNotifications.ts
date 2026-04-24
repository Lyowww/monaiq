import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Requests notification permission, resolves the native push token (FCM on Android),
 * and posts it via `syncToken`.
 */
export async function registerForPushNotificationsAndSync(
  syncToken: (token: string) => Promise<void>
): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX
    });
  }

  if (!Device.isDevice) {
    return;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return;
  }

  const pushToken = await Notifications.getDevicePushTokenAsync();
  const token = typeof pushToken.data === 'string' ? pushToken.data : '';
  if (token.length > 0) {
    await syncToken(token);
  }
}
