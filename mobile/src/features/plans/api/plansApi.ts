import type { FinancePlanRecord } from '@ai-finance/shared-types';
import { apiRequest } from '../../../lib/http/apiClient';

export type CreatePlanBody = {
  title: string;
  planType: FinancePlanRecord['planType'];
  capMinor?: number;
  category?: string;
  targetMinor?: number;
  savedMinor?: number;
  notes?: string;
};

export type UpdatePlanBody = Partial<
  Pick<FinancePlanRecord, 'title' | 'capMinor' | 'category' | 'targetMinor' | 'savedMinor' | 'notes'>
> & { status?: 'active' | 'archived' };

export const plansApi = {
  async list(status?: 'active' | 'archived'): Promise<FinancePlanRecord[]> {
    const q = status ? `?status=${status}` : '';
    return apiRequest<FinancePlanRecord[]>(`/plans${q}`, { method: 'GET', requiresAuth: true });
  },

  async create(body: CreatePlanBody): Promise<FinancePlanRecord> {
    return apiRequest<FinancePlanRecord>('/plans', {
      method: 'POST',
      requiresAuth: true,
      body: JSON.stringify(body)
    });
  },

  async update(id: string, body: UpdatePlanBody): Promise<FinancePlanRecord> {
    return apiRequest<FinancePlanRecord>(`/plans/${id}`, {
      method: 'PUT',
      requiresAuth: true,
      body: JSON.stringify(body)
    });
  },

  async remove(id: string): Promise<{ success: true }> {
    return apiRequest<{ success: true }>(`/plans/${id}`, { method: 'DELETE', requiresAuth: true });
  }
};
