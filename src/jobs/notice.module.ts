import { Module } from "@nestjs/common";
import {  JobsController } from './controller/jobs.controller';
import {  JobsService } from './service/jobs.service';
import {  JobsRepository } from './repository/jobs.repository';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from '../users/entity/user.entity';

@Module({
    controllers : [JobsController],
    providers : [JobsService],
    imports : [TypeOrmModule.forFeature([JobsRepository,Users])]
})
export class JobsModule{

}