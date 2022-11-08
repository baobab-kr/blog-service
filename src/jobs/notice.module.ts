import { Module } from "@nestjs/common";
import {  JobsController } from './controller/jobs.controller';
import {  JobsService } from './service/jobs.service';
import {  JobsRepository } from './repository/jobs.repository';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from '../users/entity/user.entity';
import { ApplyJobService } from '../applyJob/service/applyJob.service';
import { ApplyJobRepository } from "src/applyJob/repository/applyJob.repository";

@Module({
    controllers : [JobsController],
    providers : [JobsService,ApplyJobService],
    imports : [TypeOrmModule.forFeature([JobsRepository,Users,ApplyJobRepository])]
})
export class JobsModule{

}