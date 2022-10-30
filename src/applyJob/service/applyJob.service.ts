import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ApplyJobRepository } from '../repository/applyJob.repository';
import {  JobsRepository } from '../../jobs/repository/jobs.repository';
import { CreateApplyJobDTO } from '../dto/create-applyJob.dto';
import { UpdateApplyJobDTO } from '../dto/update-applyJob.dto';
import { url } from 'inspector';
import { Users } from '../../users/entity/user.entity';

@Injectable()
export class ApplyJobService{
    constructor(
        private applyJobRepository : ApplyJobRepository,
        private jobsRepository : JobsRepository
    ){}


    async createApplyJob(createApplyJobDTO : CreateApplyJobDTO){
        await this.applyJobRepository.createApllyJobs(createApplyJobDTO);
    
    }
    async getApplyJobsAll(jobs_id : number){
        return await this.applyJobRepository.getApplyJobsAll(jobs_id)
    } 
    async getApplyJobs(id : number){
        return await this.applyJobRepository.getApplyJobs(id);
    } 
    async getApplyJobsAll_inUser(user_id : number){
        return await this.applyJobRepository.getApplyJobsAll_inUser(user_id);
    } 

    async updateApplyJob(id : number, updateApplyJobDTO : UpdateApplyJobDTO){

        await this.applyJobRepository.updateApplyJobs(id,updateApplyJobDTO)
    }

    async deleteRecruit(id){
        /*
        const notice_id : number = Number(await (await this.recruitRepository.findOne(id)).notice_id);
        
        const notice = await this.noticeRepository.findOne({id:notice_id});

        if(!notice){
            throw new HttpException('해당 공지가 없습니다.', HttpStatus.CONFLICT)
        }
         
        const notice_Volunteer = Number(notice.Volunteer) - 1;
        
        await this.noticeRepository.update({id:notice_id},{Volunteer:notice_Volunteer})

        await this.recruitRepository.update(id,{status : 1})
        */
    }


    async getRecruitAll(id : number){

        /*
        const status = [0];

        const recruit = await this.recruitRepository.createQueryBuilder("recruit")
        .leftJoin("recruit.user_id","users")
        .select([
        "recruit.id",
        "recruit.notice_id",
        "recruit.user_id",
        "recruit.url",
        "recruit.name",
        "recruit.age",
        "recruit.sex"])
        .where("recruit.status IN(:status)",{status})
        .addSelect(["users.userid","users.username","users.email","users.avatar_image"])
        .andWhere("recruit.notice_id = :id",{id})
        .getMany();

        return recruit;
*/
    }

    async getRecruit(id : number){
/*
        const status = [0];

        const recruit = await this.recruitRepository.createQueryBuilder("recruit")
        .leftJoin("recruit.user_id","users")
        .select([
        "recruit.id",
        "recruit.notice_id",
        "recruit.user_id",
        "recruit.url",
        "recruit.name",
        "recruit.age",
        "recruit.sex"])
        .addSelect(["users.userid","users.username","users.email","users.avatar_image"])
        .where("recruit.status IN(:status)",{status})
        .andWhere("recruit.id = :id",{id})
        .getOne();

        return recruit;
*/
    }

}

