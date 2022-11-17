import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/setupSwagger';
const session = require('express-session');

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
    origin: ['http://localhost:2999', 'http://localhost:3000', /baobab\.blog$/],
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(session({
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      sameSite: 'strict', // sameSite임을 명시
      domain: ['http://localhost:2999', 'http://localhost:3000', '.baobab.blog'], // 앞에 .을 찍어야함
      secure: true, // https환경임을 명시
    },
  }));

  setupSwagger(app);
  await app.listen(3000);
}
bootstrap();
