import { UserRole } from '@worklog/shared/definitions';
import { z } from 'zod';

export const userRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const userLoginSchema = userRegisterSchema;

export const confirEmailSchema = z.object({
  id: z.string().uuid().openapi({
    format: 'uuid',
  }),
  email: z.string().email(),
});

export const changeRolesSchema = z.object({
  id: z.string().uuid().openapi({
    format: 'uuid',
  }),
  roles: z.array(
    z.nativeEnum(UserRole).openapi({
      type: 'string',
      enum: Object.values(UserRole),
    }),
  ),
});

export const registerUserResponseSchema = z.object({
  url: z.string(),
});

export const loginUserResponseSchema = z.object({
  token: z.string().min(1),
  refreshToken: z.string().min(1),
});

export const userResourceSchema = z.object({
  id: z.string().uuid().openapi({
    format: 'uuid',
  }),
  email: z.string().email(),
  password: z.string().min(8),
  isEmailConfirmed: z.boolean(),
  roles: z.array(
    z.nativeEnum(UserRole).openapi({
      type: 'string',
      enum: Object.values(UserRole),
    }),
  ),
  createdAt: z.coerce.date().openapi({
    format: 'date-time',
  }),
});

export type ConfirmEmailResource = z.infer<typeof confirEmailSchema>;
export type UserRegisterResource = z.infer<typeof userRegisterSchema>;
export type UserLoginResource = UserRegisterResource;
export type UserResource = z.infer<typeof userResourceSchema>;
export type ChangeRolesResource = z.infer<typeof changeRolesSchema>;
