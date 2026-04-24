import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useAuthStore } from '../auth/store/useAuthStore';
import { usersApi } from '../users/api/usersApi';
import { registerForPushNotificationsAndSync } from './registerPushNotifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

/**
 * Registers the device for push when the user is authenticated and keeps the backend token in sync.
 */
export function PushNotificationSetup() {
  const status = useAuthStore((s) => s.status);
  const tokenListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') {
      tokenListener.current?.remove();
      tokenListener.current = null;
      return;
    }

    void registerForPushNotificationsAndSync((token) => usersApi.registerPushToken({ token }));

    const sub = Notifications.addPushTokenListener((evt) => {
      const next = typeof evt.data === 'string' ? evt.data : '';
      if (next.length > 0) {
        void usersApi.registerPushToken({ token: next });
      }
    });
    tokenListener.current = sub;

    return () => {
      sub.remove();
      tokenListener.current = null;
    };
  }, [status]);

  return null;
}
