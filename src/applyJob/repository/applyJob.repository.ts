import { EntityRepository, Repository } from "typeorm";
import { ApplyJob } from '../entity/applyJob.entity';
import { CreateJobsDTO } from '../../jobs/dto/create-jobs.dto';
import { CreateApplyJobDTO } from '../dto/create-applyJob.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@EntityRepository(ApplyJob)
export class ApplyJobRepository extends Repository<ApplyJob>{

    async createApllyJobs(CreateApplyJobDTO : CreateApplyJobDTO){

        let jobs_Id : number ;
        let user_id : number ;
        let title : string ;
        let name : string
        let email : string
        let techStack : string
        let careerYear : number
        let resumeUrl : string
        let socialUrl : string
        let profile : string
        let education : number
        let educationStatus : number
        try{
            jobs_Id = Number(CreateApplyJobDTO.jobs_Id);
            user_id = Number(CreateApplyJobDTO.user_id);
            title = String(CreateApplyJobDTO.title);
            name = String(CreateApplyJobDTO.name);
            email = String(CreateApplyJobDTO.email);
            techStack = String(CreateApplyJobDTO.techStack);
            careerYear = Number(CreateApplyJobDTO.careerYear);
            resumeUrl = String(CreateApplyJobDTO.resumeUrl);
            socialUrl = String(CreateApplyJobDTO.socialUrl);
            profile = String(CreateApplyJobDTO.profile);
            education = Number(CreateApplyJobDTO.education);
            educationStatus = Number(CreateApplyJobDTO.educationStatus);

        }catch(e){
            throw new HttpException('변수 타입 초기화 실패', HttpStatus.CONFLICT)
        }
        console.log(
        jobs_Id,
        user_id,
        title,
        name,
        email,
        techStack,
        careerYear,
        resumeUrl,
        socialUrl,
        profile,
        education,
        educationStatus
        )
        const Jobs = await this.create({
            jobs_Id,
            user_id,
            title,
            name,
            email,
            techStack,
            careerYear,
            resumeUrl,
            socialUrl,
            profile,
            education,
            educationStatus
        })

        await this.save(Jobs);
    }
    
    async getApplyJobsAll(jobs_id : number){
        let jobs = await this.createQueryBuilder("apply_jobs")
        .select([
            "apply_jobs.id",
            "apply_jobs.jobs_Id",
            "apply_jobs.user_id",
            "apply_jobs.title",
            "apply_jobs.name",
            "apply_jobs.email",
            "apply_jobs.techStack",
            "apply_jobs.careerYear",
            "apply_jobs.resumeUrl",
            "apply_jobs.socialUrl",
            "apply_jobs.profile",
            "apply_jobs.education",
            "apply_jobs.educationStatus"
            ])
        .where(`apply_jobs.jobs_id = ${jobs_id}`)
        .getMany();
        

        return jobs;
    } 
    async getApplyJobs(id : number){
        let jobs = await this.createQueryBuilder("apply_jobs")
        .select([
            "apply_jobs.id",
            "apply_jobs.jobs_Id",
            "apply_jobs.user_id",
            "apply_jobs.title",
            "apply_jobs.name",
            "apply_jobs.email",
            "apply_jobs.techStack",
            "apply_jobs.careerYear",
            "apply_jobs.resumeUrl",
            "apply_jobs.socialUrl",
            "apply_jobs.profile",
            "apply_jobs.education",
            "apply_jobs.educationStatus"
            ])
        .where(`apply_jobs.id = ${id}`)
        .getOne();
        

        return jobs;
    } 
    async getApplyJobsAll_inUser(user_id : number){
        let jobs = await this.createQueryBuilder("apply_jobs")
        .select([
            "apply_jobs.id",
            "apply_jobs.jobs_Id",
            "apply_jobs.user_id",
            "apply_jobs.title",
            "apply_jobs.name",
            "apply_jobs.email",
            "apply_jobs.techStack",
            "apply_jobs.careerYear",
            "apply_jobs.resumeUrl",
            "apply_jobs.socialUrl",
            "apply_jobs.profile",
            "apply_jobs.education",
            "apply_jobs.educationStatus"
            ])
        .where(`apply_jobs.user_id = ${user_id}`)
        .getMany();
        

        return jobs;
    } 
}
