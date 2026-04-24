import { apiRequest } from '../../../lib/http/apiClient';

export type BankFxRateItem = {
  code: string;
  fromRateAm: boolean;
  buyAmd: number | null;
  sellAmd: number | null;
  midAmdPerUnit: number;
};

export type BankFxRatesResponse = {
  asOf: string;
  usdAmdFromCba: number;
  usdAmdFromRateAmMid: number | null;
  sourceNote: string;
  rates: BankFxRateItem[];
};

export const fxApi = {
  getBankRates(): Promise<BankFxRatesResponse> {
    return apiRequest<BankFxRatesResponse>('/fx/bank-rates', {
      method: 'GET',
      requiresAuth: false
    });
  }
};
