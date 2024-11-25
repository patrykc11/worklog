import { z } from 'zod';

export const startJobSchema = z.object({
  description: z.string().min(1).max(200),
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
});

export const finishJobSchema = z.object({
  id: z.string().uuid().min(1),
  userId: z.string().uuid(),
});

export const worklogSchema = z.object({
  id: z.string().uuid().min(1),
  projectId: z.string().uuid().min(1),
  userId: z.string().uuid(),
  description: z.string().min(1).max(200),
  startDate: z.coerce.date().openapi({
    format: 'date-time',
  }),
  finishDate: z.coerce.date().openapi({
    format: 'date-time',
  }),
  createdAt: z.coerce.date().openapi({
    format: 'date-time',
  }),
});

export type WorklogResource = z.infer<typeof worklogSchema>;
export type StartJobResource = z.infer<typeof startJobSchema>;
export type FinishJobResource = z.infer<typeof finishJobSchema>;
