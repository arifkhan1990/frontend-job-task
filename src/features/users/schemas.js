import { z } from 'zod';

export function createUserSchema({ isEdit = false } = {}) {
  const password = isEdit
    ? z
        .string()
        .max(72, 'Password must be at least 8 characters.')
        .refine(
          (value) => value.length === 0 || value.length >= 8,
          'Password must be at least 8 characters.',
        )
    : z
        .string()
        .min(8, 'Password must be at least 8 characters.')
        .max(72, 'Password must be at least 8 characters.');

  return z.object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters.')
      .max(80, 'Name must be at least 2 characters.'),
    email: z
      .string()
      .trim()
      .email('Enter a valid email.')
      .max(254, 'Enter a valid email.'),
    password,
    role: z.enum(['user', 'admin']),
    interests: z.string(),
  });
}
