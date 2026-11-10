import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createNote,
  deleteNote,
  listNotes,
  updateNote,
} from './api.js';

export const noteKeys = {
  all: ['notes'],
  list: (params) => ['notes', 'list', params],
};

export function useNotes(params) {
  return useQuery({
    queryKey: noteKeys.list(params),
    queryFn: async () => {
      const payload = await listNotes(params);
      return { notes: payload.data, meta: payload.meta };
    },
    placeholderData: keepPreviousData,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: noteKeys.all }),
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }) => updateNote(id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: noteKeys.all }),
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: noteKeys.all }),
  });
}
