import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync
} from 'class-validator';
import 'reflect-metadata';

export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsOptional()
  @IsEnum(NodeEnv)
  NODE_ENV!: NodeEnv;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  CORS_ORIGINS!: string;

  @IsString()
  @IsNotEmpty()
  MONGODB_URI!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  MONGODB_DB_NAME!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  USER_GRPC_URL!: string;
}

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const messages = errors
      .flatMap((error) => Object.values(error.constraints ?? {}))
      .join('; ');

    throw new Error(`Environment validation failed: ${messages}`);
  }

  return validatedConfig;
}
