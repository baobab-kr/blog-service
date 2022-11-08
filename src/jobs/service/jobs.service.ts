import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as dayjs from "dayjs";
import { CreateJobsDTO } from "../dto/create-jobs.dto";
import { JobsRepository } from '../repository/jobs.repository';
import { UpdateJobsDTO } from '../dto/update-jobs.dto';
import { SelectJobsDTO } from "../dto/select-jobs.dto";
import { isNumber, isString } from "class-validator";
import { Users } from '../../users/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { SelectJobsHeadHuntDTO } from '../dto/select-jobs-headhunt.dto';

@Injectable()
export class JobsService{
    constructor(
        private jobsRepository : JobsRepository,
        @InjectRepository(Users)
        private usersRepository : Repository<Users>
    ){}
    
    
    /**
     * createNotice(공지생성)
     * @param CreateJobsDTO 
     */
    async createNotice(CreateJobsDTO : CreateJobsDTO) : Promise<void>{
        
        await this.jobsRepository.createNotice(CreateJobsDTO);

    }

    /**
     * updateNotice(수정)
     * @param id 
     * @param UpdateJobsDTO 
     */
    async updateJobs(id : number, UpdateJobsDTO : UpdateJobsDTO){

        const jobs = await this.jobsRepository.findOne(id);

        if(!jobs){
            throw new HttpException('없는 게시물입니다.', HttpStatus.CONFLICT)
        }

        let isApproval = Number(jobs.approvalStatus) == 0;

        let companyName : string;
        let managerName : string;
        let managerContact : string;
        let field : string;
        let title : string;
        let location : string;
        let message : string;
        let talent : string;
        let careerType : number;
        let url : string;
        let salary : string;
        let startDate : string;
        let endDate : string;
        let approvalStatus : number;
        let jobStatus : number;
        let data ;
        try {
            if(isApproval){
                companyName = UpdateJobsDTO.companyName != undefined? String(UpdateJobsDTO.companyName) : String(jobs.companyName);
                managerName = UpdateJobsDTO.managerName != undefined?String(UpdateJobsDTO.managerName):String(jobs.managerName);
                managerContact = UpdateJobsDTO.managerContact != undefined?String(UpdateJobsDTO.managerContact):String(jobs.managerContact);
                field =   UpdateJobsDTO.field != undefined?String(UpdateJobsDTO.field):String(jobs.field);
                title =   UpdateJobsDTO.title != undefined?String(UpdateJobsDTO.title):String(jobs.title);
                location =   UpdateJobsDTO.location != undefined?String(UpdateJobsDTO.location):String(jobs.location);
                message =   UpdateJobsDTO.message != undefined?String(UpdateJobsDTO.message):String(jobs.message);
                talent =   UpdateJobsDTO.talent != undefined?String(UpdateJobsDTO.talent):String(jobs.talent);
                careerType =   UpdateJobsDTO.careerType != undefined?Number(UpdateJobsDTO.careerType):Number(jobs.careerType);
                url =   UpdateJobsDTO.url != undefined?String(UpdateJobsDTO.url):String(jobs.url);
                salary =   UpdateJobsDTO.salary != undefined?String(UpdateJobsDTO.salary):String(jobs.salary);
                startDate =  UpdateJobsDTO.startDate != undefined?dayjs(String(UpdateJobsDTO.startDate)).format("YYYYMMDD"):String(jobs.startDate);
                endDate =   UpdateJobsDTO.endDate != undefined?dayjs(String(UpdateJobsDTO.endDate)).format("YYYYMMDD"):String(jobs.endDate);
                approvalStatus =  UpdateJobsDTO.approvalStatus != undefined?Number(UpdateJobsDTO.approvalStatus):Number(jobs.approvalStatus);
                if(!isNumber(careerType)||!isNumber(approvalStatus)){
                    throw new HttpException('변수 타입 초기화 실패', HttpStatus.CONFLICT)
                }
                
            }else{
                    companyName = String(jobs.companyName)
                    managerName = String(jobs.managerName)
                    managerContact = String(jobs.managerContact)
                    field = String(jobs.field)
                    title = String(jobs.title)
                    location = String(jobs.location)
                    message = String(jobs.message)
                    talent = String(jobs.talent)
                    careerType = Number(jobs.careerType)
                    url = String(jobs.url)
                    salary = String(jobs.salary)
                    startDate = String(jobs.startDate)
                    endDate = String(jobs.endDate)
                    approvalStatus = Number(jobs.approvalStatus)

            }
            
            jobStatus = UpdateJobsDTO.jobStatus != undefined? Number(UpdateJobsDTO.jobStatus) :Number(jobs.jobStatus);
            if(!isNumber(jobStatus)){
                throw new HttpException('변수 타입 초기화 실패', HttpStatus.CONFLICT)
            }
 
            
        }catch(e){
            throw new HttpException('수정할 수 없음', HttpStatus.CONFLICT)

        }

        await this.jobsRepository.update(id,{companyName,
            managerName,
            managerContact,
            field,
            title,
            location,
            message,
            talent,
            careerType,
            url,
            salary,
            startDate,
            endDate,
            approvalStatus,
            jobStatus
        })

        
    }

    /**
     * getNotice("공지사항 상세 정보 반환 메서드")
     * @param id 
     * @returns 
     */
    async getJobs(id : number){
        const jobs = await this.jobsRepository.getJobs(id);

        return jobs;
    }
    /**
     * getNoticeAll(공지사항 전체 정보 반환 메서드)
     * @returns notice
     */
    async getJobsAll(SelectJobsDTO : SelectJobsDTO){

        let jobs = await this.jobsRepository.getJobsAll(SelectJobsDTO)

        return jobs;
    }
    async getJobs_inUser_forHeadHunt ( SelectJobsHeadHuntDTO : SelectJobsHeadHuntDTO){

        return await this.jobsRepository.getJobs_inUser_forHeadHunt(SelectJobsHeadHuntDTO);

    }

    async getJobsAll_ForServiceAdmin(SelectJobsDTO : SelectJobsDTO){
        let jobs = await this.jobsRepository.getJobsAll_ForServiceAdmin(SelectJobsDTO)

        return jobs;
    }


    async Approval_Jobs_ForServiceAdmin(id : number){
        await this.jobsRepository.Approval_Jobs_ForServiceAdmin(id);


    }
    async Delete_Jobs(id : number){
        await this.jobsRepository.delete(id);
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
     * uploadLogo(로고 업로드)
     * @param file 
     * @returns 
     */
    async uploadLogo(id, file){
        const fileName = file.originalname.trim().replace(/(.png|.jpg|.jpeg|.gif|\s)$/gi,'');
        const fileuploadtime = dayjs().format("YYMMDDHHmmss");
        const uploadFileName = "CL" + fileuploadtime + fileName;
        const blobClient = this.getBlobClient(uploadFileName);
        await blobClient.uploadData(file.buffer);

        if(id){
            await this.jobsRepository.update({id:id},{logo : uploadFileName})
        }
        
        
        return uploadFileName;
    }
    /**
     * uploadImage(이미지 업로드)
     * @param file 
     * @returns 
     */
     async uploadImage(id, file){
        const fileName = file.originalname.trim().replace(/(.png|.jpg|.jpeg|.gif|\s)$/gi,'');
        const fileuploadtime = dayjs().format("YYMMDDHHmmss");
        const uploadFileName = "Li" + fileuploadtime + fileName;
        const blobClient = this.getBlobClient(uploadFileName);
        await blobClient.uploadData(file.buffer);

        if(id){
            await this.jobsRepository.update({id:id},{license  : uploadFileName})
        }
        return uploadFileName;
    }
    /**
     * uploadImage(이미지 업로드)
     * @param file 
     * @returns 
     */
    async uploadToastUiImage(file){
        const fileName = file.originalname.trim().replace(/(.png|.jpg|.jpeg|.gif|\s)$/gi,'');
        const fileuploadtime = dayjs().format("YYMMDDHHmmss");
        const uploadFileName = "TO" + fileuploadtime + fileName;
        const blobClient = this.getBlobClient(uploadFileName);
        await blobClient.uploadData(file.buffer);


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

}