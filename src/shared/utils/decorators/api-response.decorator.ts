import { applyDecorators } from '@nestjs/common';
import {
  ApiResponse as NestApiResponse,
  type ApiResponseOptions,
} from '@nestjs/swagger';
import { type SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { toOpenAPI, ToOpenApiInput } from './to-open-api';

export type ResponseOptions = Pick<
  ApiResponseOptions,
  'content' | 'description' | 'headers' | 'status'
> & {
  readonly schema?: ToOpenApiInput | SchemaObject;
};

export function ApiResponse(
  options: ResponseOptions | ResponseOptions[] = [],
): ClassDecorator & MethodDecorator {
  const responseOptions = Array.isArray(options) ? options : [options];

  const normalizedOptions = responseOptions.map((option) => ({
    ...option,
    schema: option.schema ? toOpenAPI(option.schema) : undefined,
  }));

  return applyDecorators(
    ...normalizedOptions.map((option) => NestApiResponse(option)),
  );
}
