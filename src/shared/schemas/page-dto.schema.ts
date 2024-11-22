import { z } from 'zod';

import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { offsetPageMetadataSchema } from './offset-pagination.schema';
import { cursorPageMetadataSchema } from './cursor-pagination.schema';

extendZodWithOpenApi(z);
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createPageDtoSchema<T extends z.ZodTypeAny>(
  itemSchema: T,
  metaType: 'offset' | 'cursor' = 'offset',
) {
  return z.object({
    data: z.array(itemSchema).openapi({
      description: 'The items for the current page',
      type: 'array',
    }),
    meta:
      metaType === 'offset'
        ? offsetPageMetadataSchema
        : cursorPageMetadataSchema,
  });
}
