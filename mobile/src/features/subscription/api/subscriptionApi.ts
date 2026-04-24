import { apiRequest } from '../../../lib/http/apiClient';

export type SubscriptionPlanPublic = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  priceMinor: number;
  currencyCode: string;
  billingPeriod: string;
  featureIds: string[];
  sortOrder: number;
  isActive: boolean;
  highlightTag: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type SubscriptionFeaturePublic = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export const subscriptionApi = {
  listPlans(): Promise<SubscriptionPlanPublic[]> {
    return apiRequest<SubscriptionPlanPublic[]>('/app/subscriptions/plans', { method: 'GET' });
  },

  listFeatures(): Promise<SubscriptionFeaturePublic[]> {
    return apiRequest<SubscriptionFeaturePublic[]>('/app/subscriptions/features', {
      method: 'GET'
    });
  }
};
