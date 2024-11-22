import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const cursorPageOptionsSchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .positive()
    .min(1)
    .max(100)
    .default(10)
    .optional()
    .openapi({
      type: 'integer',
      example: 10,
      minimum: 1,
      maximum: 100,
      description: 'The number of items to retrieve per page',
    }),
  token: z.string().nullable().optional().default(null).openapi({
    type: 'string',
    description: 'Base64 encoded token to retrieve the next page of items',
  }),
});

export const cursorPageMetadataSchema = z.object({
  itemCount: z.number().int().positive().min(0).openapi({
    type: 'integer',
    example: 10,
    minimum: 0,
    description: 'The number of items in the current page',
  }),
  totalCount: z.number().int().positive().min(0).openapi({
    type: 'integer',
    example: 100,
    minimum: 0,
    description: 'The total number of items available',
  }),
  nextToken: z.string().base64().nullable().openapi({
    type: 'string',
    description: 'Base64 encoded token to retrieve the next page of items',
  }),
});

export type CursorPageOptions = z.infer<typeof cursorPageOptionsSchema>;

export type CursorPageMetadata = z.infer<typeof cursorPageMetadataSchema>;
