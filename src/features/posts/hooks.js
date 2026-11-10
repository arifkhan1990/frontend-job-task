import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createPost, listUserPosts } from './api.js';

export const postKeys = {
  all: ['posts'],
  list: (userId, params) => ['posts', userId, params],
};

export function useUserPosts(userId, params) {
  return useQuery({
    queryKey: postKeys.list(userId, params),
    queryFn: async () => {
      const payload = await listUserPosts(userId, params);
      return {
        user: payload.data.user,
        posts: payload.data.posts,
        meta: payload.meta,
      };
    },
    placeholderData: keepPreviousData,
  });
}

export function useCreatePost(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['posts', userId] }),
  });
}
