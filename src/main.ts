import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import helmet from 'helmet';
import { GRPC_URL, HTTP_PORT, grpcClientOptions } from './app.grpc';
import { AppModule } from './app.module';
import { setupCors } from './config/cors.config';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice(grpcClientOptions(GRPC_URL));

  app.use(helmet());
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.enableShutdownHooks();
  setupCors(app);
  setupSwagger(app);

  await app.startAllMicroservices();
  await app.listen(HTTP_PORT);
  console.log(
    `HTTP on ${HTTP_PORT}, gRPC on ${GRPC_URL} (pid ${process.pid})`,
  );
}

bootstrap();
