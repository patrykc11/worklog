import { createZodDto } from '@anatine/zod-nestjs';
import {
  confirEmailSchema,
  loginUserResponseSchema,
  registerUserResponseSchema,
  userLoginSchema,
  userRegisterSchema,
} from '@worklog/modules/user/domain/resources/user-resource';

export class RegisterUserDto extends createZodDto(userRegisterSchema) {}

export class LoginUserDto extends createZodDto(userLoginSchema) {}

export class VerifyUserDto extends createZodDto(
  confirEmailSchema.pick({
    email: true,
  }),
) {}

export class RegisterUserDtoResponse extends createZodDto(
  registerUserResponseSchema,
) {}

export class LoginUserDtoResponse extends createZodDto(
  loginUserResponseSchema,
) {}

export class RefreshTokensDtoResponse extends createZodDto(
  loginUserResponseSchema,
) {}
