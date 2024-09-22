import { z } from 'zod';

export const TaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  delivery: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'require a valid date',
  }),
});
