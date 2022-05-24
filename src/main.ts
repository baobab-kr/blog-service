import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

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
  const app = await NestFactory.create(AppModule, {cors:true});
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
