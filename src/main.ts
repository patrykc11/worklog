import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import {
  API_BEARER_SECURITY_NAME,
  API_DEFAULT_VERSION,
  API_VERSION_PREFIX,
  SWAGGER_PATH,
  SWAGGER_VERSION,
} from './shared/definitions';
import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const logger = app.get(Logger);

  app
    .enableShutdownHooks()
    .enableVersioning({
      type: VersioningType.URI,
      defaultVersion: API_DEFAULT_VERSION,
      prefix: API_VERSION_PREFIX,
    })
    .useLogger(logger);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Worklog')
    .setDescription('Worklog API documentation')
    .setVersion(SWAGGER_VERSION)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        in: 'Header',
      },
      API_BEARER_SECURITY_NAME,
    )
    .build();

  patchNestjsSwagger();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    ignoreGlobalPrefix: true,
    operationIdFactory: (controllerKey, methodKey) =>
      `${controllerKey}.${methodKey}`,
  });

  SwaggerModule.setup(SWAGGER_PATH, app, {
    ...document,
    openapi: '3.1.0',
  });

  const port = configService.get<number>('PORT') || 3001;

  await app.listen(port, '0.0.0.0', async () => {
    const url = await app.getUrl();
    logger.log(`Server is listening on ${url}`);
  });
}

bootstrap().catch((error) => {
  console.error(error);
});
