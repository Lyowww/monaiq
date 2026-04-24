import type { DashboardSummary } from '@ai-finance/shared-types';
import { apiRequest } from '../../../lib/http/apiClient';

export const dashboardApi = {
  summary(): Promise<DashboardSummary> {
    return apiRequest<DashboardSummary>('/dashboard/summary', {
      method: 'GET',
      requiresAuth: true
    });
  }
};
