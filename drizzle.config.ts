import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/modules/common/drizzle/schemas/**/*.schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  breakpoints: true,
  strict: true,
  dbCredentials: {
    url: process.env['DATABASE_URL'] as string,
  },
});
