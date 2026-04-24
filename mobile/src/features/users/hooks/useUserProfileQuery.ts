import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/usersApi';

export function useUserProfileQuery() {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: () => usersApi.me(),
    staleTime: 30_000
  });
}
