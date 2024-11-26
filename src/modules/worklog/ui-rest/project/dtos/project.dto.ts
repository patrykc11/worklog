import { createZodDto } from '@anatine/zod-nestjs';
import { projectSchema } from '@worklog/modules/worklog/domain/resources/project-resource';
import { createPageDtoSchema } from '@worklog/shared/schemas';
import { createProjectSchema } from '@worklog/modules/worklog/domain/resources/project-resource';

export class GetQuestsResponseDto extends createZodDto(
  createPageDtoSchema(projectSchema),
) {}

export class CreateNewProjectDto extends createZodDto(createProjectSchema) {}
