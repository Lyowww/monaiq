import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '../api/transactionsApi';

const KEY = ['transactions', 'list'] as const;

export function useTransactionsListQuery(limit = 200) {
  return useQuery({
    queryKey: [...KEY, limit],
    queryFn: () => transactionsApi.listTransactions({ limit, skip: 0 })
  });
}
