import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  bulkDeleteUsers,
  createUser,
  deleteUser,
  listUsers,
  updateUser,
} from './api.js';

export const userKeys = {
  all: ['users'],
  list: (params) => ['users', 'list', params],
};

export function useUsers(params) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const payload = await listUsers(params);
      return { users: payload.data, meta: payload.meta };
    },
    placeholderData: keepPreviousData,
  });
}

function invalidateUserData(queryClient) {
  queryClient.invalidateQueries({ queryKey: userKeys.all });
  queryClient.invalidateQueries({ queryKey: ['notes'] });
  queryClient.invalidateQueries({ queryKey: ['interests'] });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => invalidateUserData(queryClient),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }) => updateUser(id, body),
    onSuccess: () => invalidateUserData(queryClient),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => invalidateUserData(queryClient),
  });
}

export function useBulkDeleteUsers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteUsers,
    onSuccess: () => invalidateUserData(queryClient),
  });
}
