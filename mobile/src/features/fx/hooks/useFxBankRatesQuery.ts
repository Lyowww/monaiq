import { useQuery } from '@tanstack/react-query';
import { fxApi } from '../api/fxApi';

export function useFxBankRatesQuery() {
  return useQuery({
    queryKey: ['fx', 'bank-rates'],
    queryFn: () => fxApi.getBankRates(),
    staleTime: 4 * 60 * 1000
  });
}
