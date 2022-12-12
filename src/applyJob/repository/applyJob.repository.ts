import { EntityRepository, Repository, getConnection } from 'typeorm';
import { ApplyJob } from '../entity/applyJob.entity';
import { CreateJobsDTO } from '../../jobs/dto/create-jobs.dto';
import { CreateApplyJobDTO } from '../dto/create-applyJob.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateApplyJobDTO } from '../dto/update-applyJob.dto';

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
            techStack = CreateApplyJobDTO.techStack == undefined ? null : String(CreateApplyJobDTO.techStack)
            careerYear = isNaN(Number(CreateApplyJobDTO.careerYear)) || CreateApplyJobDTO.careerYear == null ? null : Number(CreateApplyJobDTO.careerYear);
            resumeUrl = String(CreateApplyJobDTO.resumeUrl);
            socialUrl = CreateApplyJobDTO.socialUrl == undefined ? null : String(CreateApplyJobDTO.socialUrl)
            profile = String(CreateApplyJobDTO.profile);
            education = Number(CreateApplyJobDTO.education);
            educationStatus = Number(CreateApplyJobDTO.educationStatus);

        }catch(e){
            throw new HttpException('변수 타입 초기화 실패', HttpStatus.CONFLICT)
        }
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
        .orderBy("apply_jobs.id","DESC")
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
        .orderBy("apply_jobs.id","DESC")
        .getOne();
        

        return jobs;
    } 
    async getApplyJobsAll_inUser(user_id : number){
        let jobs = await this.createQueryBuilder("apply_jobs")
        .leftJoin("apply_jobs.jobs_Id","jobs")
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
            .addSelect([
                "jobs.id" ,
                "jobs.companyName" ,
                "jobs.managerName" ,
                "jobs.managerContact" ,
                "jobs.field" ,
                "jobs.title" ,
                "jobs.location" ,
                "jobs.message" ,
                "jobs.talent" ,
                "jobs.careerType" ,
                "jobs.url" ,
                "jobs.salary" ,
                "jobs.startDate" ,
                "jobs.endDate" ,
                "jobs.approvalStatus",
                "jobs.jobStatus",
                "jobs.license" ,
                "jobs.logo"])

        .where(`apply_jobs.user_id = ${user_id}`)
        .orderBy("apply_jobs.id","DESC")
        .getMany();
        

        return jobs;
    } 

    async updateApplyJobs(id : number, updateApplyJobs : UpdateApplyJobDTO){

        let applyJobs = await this.findOne(id);

        

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
            jobs_Id = updateApplyJobs.jobs_Id !== undefined ? Number(updateApplyJobs.jobs_Id) : applyJobs.jobs_Id;
            user_id = updateApplyJobs.user_id !== undefined ? Number(updateApplyJobs.user_id) : applyJobs.user_id;
            title = updateApplyJobs.title !== undefined ? String(updateApplyJobs.title) : applyJobs.title;
            name = updateApplyJobs.name !== undefined ? String(updateApplyJobs.name) : applyJobs.name;
            email = updateApplyJobs.email !== undefined ? String(updateApplyJobs.email) : applyJobs.email;
            techStack = updateApplyJobs.techStack !== undefined ? String(updateApplyJobs.techStack) : applyJobs.techStack;
            careerYear = updateApplyJobs.careerYear !== undefined ? Number(updateApplyJobs.careerYear) : applyJobs.careerYear;
            resumeUrl = updateApplyJobs.resumeUrl !== undefined ? String(updateApplyJobs.resumeUrl) : applyJobs.resumeUrl;
            socialUrl = updateApplyJobs.socialUrl !== undefined ? String(updateApplyJobs.socialUrl) : applyJobs.socialUrl;
            profile = updateApplyJobs.profile !== undefined ? String(updateApplyJobs.profile) : applyJobs.profile;
            education = updateApplyJobs.education !== undefined ? Number(updateApplyJobs.education) : applyJobs.education;
            educationStatus = updateApplyJobs.educationStatus !== undefined ? Number(updateApplyJobs.educationStatus) : applyJobs.educationStatus;
            
            if(updateApplyJobs.careerYear == null){
                careerYear = null
            }
        }catch(e){
            throw new HttpException('변수 타입 초기화 실패', HttpStatus.CONFLICT)
        }


        let updateQuery = await getConnection()
        .createQueryBuilder()
        .update(ApplyJob)
        .set({
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
        .where(`id = ${id}`)
        .execute();



        


    }
    
}
