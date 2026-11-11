import { z } from 'zod';

export function createPostSchema() {
  return z.object({
    title: z
      .string()
      .trim()
      .min(1, 'Title is required.')
      .max(200, 'Title is required.'),
    content: z
      .string()
      .min(1, 'Content is required.')
      .max(20000, 'Content is required.'),
  });
}
