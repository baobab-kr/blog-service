import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ApplyJobRepository } from '../repository/applyJob.repository';
import {  JobsRepository } from '../../jobs/repository/jobs.repository';
import { CreateApplyJobDTO } from '../dto/create-applyJob.dto';
import { UpdateApplyJobDTO } from '../dto/update-applyJob.dto';
import { url } from 'inspector';
import { Users } from '../../users/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IsNotEmpty, isEmpty } from 'class-validator';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import * as dayjs from 'dayjs';

@Injectable()
export class ApplyJobService{
    constructor(
        private applyJobRepository : ApplyJobRepository,
        private jobsRepository : JobsRepository,
        @InjectRepository(Users)
        private usersRepository : Repository<Users>
    ){}


    async createApplyJob(createApplyJobDTO : CreateApplyJobDTO){
        if(createApplyJobDTO.jobs_Id != undefined ){

            await this.getJobsId(Number(createApplyJobDTO.jobs_Id));
        }
        
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
    async getUser(id){
        return await this.usersRepository.findOne(id);
    }
    /**
     * userIdInCookie(쿠키 Access 토큰의 user_id 반환)
     * @param accessToken 
     * @returns 
     */
    async userIdInCookie(accessToken : string) : Promise<number>{
        const accessTokken = accessToken;
        const base64Payload = accessTokken.split('.')[1]; 
        const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString());
        const user_id_inPayload : number = payload.id;

        return user_id_inPayload ;
    }

    async delete_all_apply_jobs_in_user(user_id : number){
        await this.applyJobRepository.createQueryBuilder("apply_job")
        .delete()
        .where(`apply_job.user_id = ${user_id}`)
        .execute();

    }

    async AutoCompleteAPI(user_id : number){
        return await this.usersRepository.findOne(user_id,{select : ["email","techStack","socialUrl"]});
    }


    async getJobsId(id : number){
        const jobs = await this.jobsRepository.findOne(id);

        if(!jobs){
            throw new HttpException('해당 공고가 없습니다.', HttpStatus.CONFLICT)
        }
    }

    async getUserId(id : number){
        const user = await this.usersRepository.findOne(id);
        
        if(!user){
            throw new HttpException('해당 유저가 없습니다.', HttpStatus.CONFLICT)
        }
    }


    /**
     * getBlobClient(BlobClient연결)
     * @param imageName 
     * @returns 
     */
     getBlobClient(imageName:string):BlockBlobClient{
        const blobClientService = BlobServiceClient.fromConnectionString(process.env.AZURE_CONNECTIONS);
        const containerClient = blobClientService.getContainerClient(process.env.AZURE_BLOB_CONTAINER_NAME);
        const blobClient = containerClient.getBlockBlobClient(imageName);
        return blobClient;
    }

    /**
     * profile_upload(profile_upload 업로드)
     * @param file 
     * @returns 
     */
    async profile_upload(id, file){
        const fileName = file.originalname.trim().replace(/(.png|.jpg|.jpeg|.gif|\s)$/gi,'');
        const fileuploadtime = dayjs().format("YYMMDDHHmmss");
        const uploadFileName = "PR" + fileuploadtime + fileName;
        const blobClient = this.getBlobClient(uploadFileName);
        await blobClient.uploadData(file.buffer);

        if(id){
            await this.applyJobRepository.update({id:id},{profile : uploadFileName})
        }
        
        
        return uploadFileName;
    }

    /**
     * getThumbnail(이미지 다운로드)
     * @param fileName 
     * @returns 
     */
    async getImage(fileName){
        var blobClient = this.getBlobClient(fileName);
        const isExist:Boolean = await blobClient.exists();
        if (!isExist) {
            blobClient = this.getBlobClient('profile-default');
        }
        var blobDownloaded = await blobClient.download();
        return blobDownloaded.readableStreamBody;
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

