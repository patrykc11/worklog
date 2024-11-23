import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import PinoPretty from 'pino-pretty';
import { LoggerModule } from 'nestjs-pino';
import { ConfigOptions } from './config';
import { IncomingMessage } from 'http';
import { DrizzleModule } from './modules/common/drizzle/drizzle.module';
import { UserUiRestModule } from './modules/user/ui-rest/user-ui-rest.module';

const prettyTransport: any = PinoPretty({
  hideObject: true,
  singleLine: false,
  translateTime: true,
  ignore: 'pid,hostname',
  messageFormat: (log, messageKey) => {
    const message: any = log[messageKey];
    const context: any = log['context'];

    if (log.requestId) return `[${log.requestId}] ${message}`;
    const messageWithContext: string = `[${
      context || 'HttpInterface'
    }] ${message}`;

    return messageWithContext;
  },
});

@Module({
  imports: [
    ConfigModule.forRoot(ConfigOptions),
    LoggerModule.forRoot({
      pinoHttp: [
        {
          customReceivedMessage: (req: IncomingMessage): string =>
            `${req.method} ${req.url}`,
          customSuccessMessage: (res: IncomingMessage): string =>
            `${res.method} ${res.url} | Response: ${
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              res.statusCode ?? res.res.statusCode
            }`,
        },
        prettyTransport,
      ],
    }),
    DrizzleModule,
    UserUiRestModule,
    // AuthModule,
    // WorklogModule,
    // UserModule,
  ],
})
export class AppModule {}
