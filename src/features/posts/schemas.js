import { z } from 'zod';

export function createPostSchema(t) {
  return z.object({
    title: z
      .string()
      .trim()
      .min(1, t('Title is required.'))
      .max(200, t('Title is required.')),
    content: z
      .string()
      .min(1, t('Content is required.'))
      .max(20000, t('Content is required.')),
  });
}
