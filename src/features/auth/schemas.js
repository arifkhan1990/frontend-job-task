import { z } from 'zod';

export function createLoginSchema(t) {
  return z.object({
    email: z
      .string()
      .trim()
      .email(t('Enter a valid email.'))
      .max(254, t('Enter a valid email.')),
    password: z.string().min(1, t('Password is required.')).max(72),
  });
}

export function createRegisterSchema(t) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, t('Name must be at least 2 characters.'))
      .max(80, t('Name must be at least 2 characters.')),
    email: z
      .string()
      .trim()
      .email(t('Enter a valid email.'))
      .max(254, t('Enter a valid email.')),
    password: z
      .string()
      .min(8, t('Password must be at least 8 characters.'))
      .max(72, t('Password must be at least 8 characters.')),
    interests: z.string(),
  });
}
