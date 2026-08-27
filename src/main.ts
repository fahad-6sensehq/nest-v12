import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { setupCors } from './config/cors.config';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  setupCors(app);
  setupSwagger(app);

  await app.listen(5000);
  console.log(`Server is running on port 5000`);
}

bootstrap();
