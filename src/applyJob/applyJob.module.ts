import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplyJobController } from './controller/applyJob.controller';
import {  ApplyJobService } from './service/applyJob.service';
import { Users } from '../users/entity/user.entity';
import { ApplyJobRepository } from './repository/applyJob.repository';
import { JobsRepository } from '../jobs/repository/jobs.repository';

@Module({
    imports : [TypeOrmModule.forFeature([ApplyJobRepository,JobsRepository,Users])
  ],
    controllers: [ApplyJobController],
    providers: [ApplyJobService]
  })
export class ApplyJobModule {}
