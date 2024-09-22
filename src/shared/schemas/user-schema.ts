import { z } from 'zod';

export const UserSchema = z.object({
  name: z.string().min(8),
  email: z.string().email(),
});

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});
