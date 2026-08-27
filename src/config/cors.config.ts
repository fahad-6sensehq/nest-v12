import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodeEnv } from './env.validation';

function parseOrigins(raw?: string): string[] {
  return (
    raw
      ?.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean) ?? []
  );
}

export function setupCors(app: INestApplication): void {
  const configService = app.get(ConfigService);
  const origins = parseOrigins(configService.get<string>('CORS_ORIGINS'));
  const isProduction =
    configService.get<string>('NODE_ENV') === NodeEnv.Production;

  app.enableCors({
    origin: origins.length > 0 ? origins : !isProduction,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    maxAge: 86_400,
  });
}
