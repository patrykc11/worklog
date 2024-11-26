import { createZodDto } from '@anatine/zod-nestjs';
import { startJobBodySchema } from '@worklog/modules/worklog/domain/resources/worklog-resource';

export class StartWorkDto extends createZodDto(startJobBodySchema) {}
