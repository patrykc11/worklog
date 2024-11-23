import { applyDecorators } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { API_BEARER_SECURITY_NAME } from '@worklog/shared/definitions';

export function ApiBearerAuth(): ClassDecorator & MethodDecorator {
  return applyDecorators(ApiSecurity(API_BEARER_SECURITY_NAME));
}
