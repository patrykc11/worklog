import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1).max(50),
});

export const projectSchema = z.object({
  id: z.string().uuid().min(1),
  name: z.string().min(1).max(50),
  createdAt: z.coerce.date().openapi({
    format: 'date-time',
  }),
});

export type CreateProjectResource = z.infer<typeof createProjectSchema>;
export type ProjectResource = z.infer<typeof projectSchema>;
