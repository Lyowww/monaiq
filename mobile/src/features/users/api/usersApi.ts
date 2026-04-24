import type { CurrencyCode, UserProfile } from '@ai-finance/shared-types';
import { apiRequest } from '../../../lib/http/apiClient';

export type RegisterPushTokenBody = {
  token: string;
  pushEnabled?: boolean;
};

export type PatchUserPayload = {
  firstName?: string;
  lastName?: string;
  currencyCode?: CurrencyCode;
  settings?: Partial<{
    lowBalanceThresholdMinor: number;
    notificationPayments: boolean;
    notificationDebts: boolean;
    notificationLowBalance: boolean;
    notificationUnusualSpending: boolean;
    subscription: 'free' | 'premium';
    subscriptionPlanKey: string | null;
  }>;
};

export const usersApi = {
  me(): Promise<UserProfile> {
    return apiRequest<UserProfile>('/users/me', { method: 'GET', requiresAuth: true });
  },

  patchMe(body: PatchUserPayload): Promise<UserProfile> {
    return apiRequest<UserProfile>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(body),
      requiresAuth: true
    });
  },

  registerPushToken(body: RegisterPushTokenBody): Promise<void> {
    return apiRequest<void>('/users/me/push-token', {
      method: 'POST',
      requiresAuth: true,
      body: JSON.stringify(body)
    });
  }
};
