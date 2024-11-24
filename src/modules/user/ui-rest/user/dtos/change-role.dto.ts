import { createZodDto } from '@anatine/zod-nestjs';
import { changeUserRoleSchema } from '@worklog/modules/user/domain/resources/user-resource';

export class ChangeRoleDto extends createZodDto(changeUserRoleSchema) {}
