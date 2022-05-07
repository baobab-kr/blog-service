import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
import * as path from 'path';

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
  await app.listen(3000);
}
bootstrap();
