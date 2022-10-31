import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/setupSwagger';

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';

dotenv.config({
  path: path.resolve(
    (process.env.NODE_ENV === 'production') ? './config/env/.production.env'
      : (process.env.NODE_ENV === 'stage') ? './config/env/.stage.env' : './config/env/.development.env'
  )
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  app.use(cookieParser());
  app.enableCors({
    exposedHeaders: ['ATExpires', 'RTExpires'],
    origin: ['http://localhost:2999', 'http://localhost:3000', 'https://*.baobab.blog', 'https://baobab.blog'],
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: true,
});
  setupSwagger(app);
  await app.listen(3000);
}
bootstrap();
