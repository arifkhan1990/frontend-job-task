import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { listInterests } from './api.js';

export const interestKeys = {
  all: ['interests'],
  list: (params) => ['interests', 'list', params],
};

export function useInterests(params) {
  return useQuery({
    queryKey: interestKeys.list(params),
    queryFn: async () => {
      const payload = await listInterests(params);
      return { groups: payload.data, meta: payload.meta };
    },
    placeholderData: keepPreviousData,
  });
}
