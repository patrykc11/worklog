import { z } from 'zod';

export const ConfigOptions = {
  isGlobal: true,
  envFilePath: '.env',
  validationSchema: z.object({
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string().min(1),
    JWT_REFRESH_SECRET: z.string().min(1),
    JWT_SECRET: z.string().min(1),
  }),
};
