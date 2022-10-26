import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './config/database/database.module';
import { BoardModule } from './Board/board.module';
import { JobsModule } from './jobs/notice.module';
import { ApplyJobModule } from './applyJob/applyJob.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig],
      isGlobal: true,
      validationSchema,
    }),
    DatabaseModule,
    UsersModule,
    BoardModule,
    JobsModule,
    ApplyJobModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}