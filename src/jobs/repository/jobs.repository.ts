import { EntityRepository, Repository, getConnection } from 'typeorm';
import { Jobs } from '../entity/jobs.entity';
import { CreateJobsDTO } from "../dto/create-jobs.dto";
import * as dayjs from 'dayjs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SelectJobsDTO } from '../dto/select-jobs.dto';
import { Users } from '../../users/entity/user.entity';
import { SelectJobsHeadHuntDTO } from '../dto/select-jobs-headhunt.dto';
import { appendFile } from 'fs';
import { SelectJobsForServiceAdminDTO } from '../dto/select-jobs-service-admin.dto';

@EntityRepository(Jobs)
export class JobsRepository extends Repository<Jobs>{

    /**
     * 공지사항 생성 
     * @param CreateJobsDTO 
     * @returns 
     */
    async createNotice(CreateJobsDTO : CreateJobsDTO){
        let user_id : number;
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
        let jobStatus : number = 1 ;
        let license : string = ""
        let logo : string = ""
        try {
            user_id = Number(CreateJobsDTO.user_id)
            companyName = String(CreateJobsDTO.companyName);
            managerName = String(CreateJobsDTO.managerName);
            managerContact = String(CreateJobsDTO.managerContact);
            field =   String(CreateJobsDTO.field);
            title =   String(CreateJobsDTO.title);
            location =   String(CreateJobsDTO.location);
            message =   String(CreateJobsDTO.message);
            talent =   String(CreateJobsDTO.talent);
            careerType =   Number(CreateJobsDTO.careerType);
            url =   String(CreateJobsDTO.url);
            salary =   String(CreateJobsDTO.salary);
            startDate =  dayjs(String(CreateJobsDTO.startDate)).format("YYYYMMDD");
            endDate =   dayjs(String(CreateJobsDTO.endDate)).format("YYYYMMDD");
            approvalStatus =   Number(CreateJobsDTO.approvalStatus);
            
            license =   String(CreateJobsDTO.license);
            logo =   String(CreateJobsDTO.logo);
        }catch(e){
            throw new HttpException('변수 타입 초기화 실패', HttpStatus.CONFLICT)

        }
        if(startDate == "Invalid Date" || endDate == "Invalid Date"){
            if(CreateJobsDTO.startDate == null && CreateJobsDTO.endDate == null){
                startDate = "00000000";
                endDate = "99999999";
            }else{
                throw new HttpException('it`s no  date', HttpStatus.CONFLICT)
            }
            
        }
        if(isNaN(careerType)||isNaN(approvalStatus)||isNaN(user_id)){
            throw new HttpException('it`s no  Number', HttpStatus.CONFLICT)
        }
        
        const Jobs = this.create({
            user_id ,
            companyName ,
            managerName ,
            managerContact ,
            field ,
            title ,
            location ,
            message ,
            talent ,
            careerType ,
            url ,
            salary ,
            startDate ,
            endDate ,
            approvalStatus,
            jobStatus,
            
            license ,
            logo 
        })

        await this.save(Jobs);
    }

    async getJobs(id : number){
        const State = [0];
        const NowDay = dayjs().format("YYYYMMDD");
        
        

        const notice = await this.createQueryBuilder("jobs")
        .leftJoin("jobs.user_id","users")
        .select([
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
        .addSelect([
            "users.userid",
            "users.username",
            "users.avatar_image",
            "users.role",
        ])
        .where(`jobs.id = ${id}`)
        //.andWhere("jobStatus IN(:State)",{State})
        //.andWhere("endDate >= :NowDay",{NowDay})
        .getOne();


        return notice;

    }


    async getJobsAll(SelectJobsDTO : SelectJobsDTO){
        const dateNow = dayjs().format("YYYYMMDD");
        let apStatus = 1;
        let jpStatus = 1;


        let page = SelectJobsDTO.page
        let limit = 10;
        let skip = page * limit;
        let take = skip + limit;


        

        let companyName : string;
        let field : string;
        let title : string;
        let location : string;
        let careerType : number;
        let startDate : string;
        let endDate : string;
        try{
            location = SelectJobsDTO.location 
            title = SelectJobsDTO.title 
            field = SelectJobsDTO.field 
            careerType = SelectJobsDTO.careerType 
            startDate = SelectJobsDTO.startDate 
            endDate = SelectJobsDTO.endDate 
            companyName  = SelectJobsDTO.companyName
        }catch(e){
            throw new HttpException('변수 타입 초기화 실패', HttpStatus.CONFLICT)
        }
        

        let where = `jobs.startDate <= ${dateNow} AND jobs.endDate >= ${dateNow}`;
        where += ` AND jobs.approvalStatus = ${apStatus} AND jobs.jobStatus = ${jpStatus}`
        if(location != undefined){
            where += ` AND jobs.location LIKE '%${location}%'`;
        }
        if(title != undefined){
            where += ` AND jobs.title LIKE '%${title}%'`;
        }
        if(field != undefined){
            where += ` AND jobs.field LIKE '%${field}%'`;
        }
        if(careerType != undefined){
            where += ` AND jobs.careerType in(${careerType})`;
        }
        if(companyName != undefined){
            where += ` AND jobs.companyName LIKE '%${companyName}%'`;
        }
        if(startDate != undefined){
            where += ` AND jobs.startDate >= ${startDate}`;
        }
        if(endDate != undefined ){
            where += ` AND jobs.startDate <= ${endDate}`;
        }

        const jobs = await this.createQueryBuilder("jobs")
        .select([
            "jobs.id",
            "jobs.companyName", 
            "jobs.field", 
            "jobs.title", 
            "jobs.logo", 
            "jobs.message", 
            "jobs.careerType", 
            "jobs.startDate", 
            "jobs.endDate", 
            "jobs.jobStatus"
        ])
        .where(where)
        .skip(skip)
        .take(take)
        .getMany()

        return jobs;  
    }



    async getJobs_inUser_forHeadHunt(SelectJobsHeadHuntDTO : SelectJobsHeadHuntDTO){
        const dateNow = dayjs().format("YYYYMMDD");
        let apStatus = 1;
        let jpStatus = 1;
        

        let companyName : string;
        let field : string;
        let title : string;
        let location : string;
        let careerType : number;
        let startDate : string;
        let endDate : string;
        try{
            location = SelectJobsHeadHuntDTO.location 
            title = SelectJobsHeadHuntDTO.title 
            field = SelectJobsHeadHuntDTO.field 
            careerType = SelectJobsHeadHuntDTO.careerType 
            startDate = SelectJobsHeadHuntDTO.startDate 
            endDate = SelectJobsHeadHuntDTO.endDate 
            companyName  = SelectJobsHeadHuntDTO.companyName
        }catch(e){
            throw new HttpException('변수 타입 초기화 실패', HttpStatus.CONFLICT)
        }
        

        let where = ` jobs.user_id =  ${Number(SelectJobsHeadHuntDTO.user_id)}`

        if(location != undefined){
            where += ` AND jobs.location LIKE '%${location}%'`;
        }
        if(title != undefined){
            where += ` AND jobs.title LIKE '%${title}%'`;
        }
        if(field != undefined){
            where += ` AND jobs.field LIKE '%${field}%'`;
        }
        if(careerType != undefined){
            where += ` AND jobs.careerType in(${careerType})`;
        }
        if(companyName != undefined){
            where += ` AND jobs.companyName LIKE '%${companyName}%'`;
        }
        if(startDate != undefined){
            where += ` AND jobs.startDate >= ${startDate}`;
        }
        if(endDate != undefined ){
            where += ` AND jobs.startDate <= ${endDate}`;
        }

        const jobs = await this.createQueryBuilder("jobs")
        .select([
            "jobs.id",
            "jobs.companyName", 
            "jobs.field", 
            "jobs.title", 
            "jobs.logo", 
            "jobs.message", 
            "jobs.careerType", 
            "jobs.startDate", 
            "jobs.endDate", 
            "jobs.jobStatus"
        ])
        .where(where)
        .getMany()

        return jobs;  
    }

    async getJobsAll_ForServiceAdmin (SelectJobsDTO : SelectJobsForServiceAdminDTO){
        const dateNow = dayjs().format("YYYYMMDD");
        let apStatus = 1;
        let jpStatus = 1;
        

        let companyName : string;
        let field : string;
        let title : string;
        let location : string;
        let careerType : number;
        let startDate : string;
        let endDate : string;
        try{
            location = SelectJobsDTO.location 
            title = SelectJobsDTO.title 
            field = SelectJobsDTO.field 
            careerType = SelectJobsDTO.careerType 
            startDate = SelectJobsDTO.startDate 
            endDate = SelectJobsDTO.endDate 
            companyName  = SelectJobsDTO.companyName
        }catch(e){
            throw new HttpException('변수 타입 초기화 실패', HttpStatus.CONFLICT)
        }

        let where = ` `

        if(location != undefined){
            where += ` AND jobs.location LIKE '%${location}%'`;
        }
        if(title != undefined){
            where += ` AND jobs.title LIKE '%${title}%'`;
        }
        if(field != undefined){
            where += ` AND jobs.field LIKE '%${field}%'`;
        }
        if(careerType != undefined){
            where += ` AND jobs.careerType in(${careerType})`;
        }
        if(companyName != undefined){
            where += ` AND jobs.companyName LIKE '%${companyName}%'`;
        }
        if(startDate != undefined){
            where += ` AND jobs.startDate >= ${startDate}`;
        }
        if(endDate != undefined ){
            where += ` AND jobs.startDate <= ${endDate}`;
        }

        const jobs = await this.createQueryBuilder("jobs")
        .select([
            "jobs.id",
            "jobs.companyName", 
            "jobs.field", 
            "jobs.title", 
            "jobs.logo", 
            "jobs.message", 
            "jobs.careerType", 
            "jobs.startDate", 
            "jobs.endDate", 
            "jobs.jobStatus"
        ])
        .where(where)
        .getMany()

        return jobs;  
    }

    async Approval_Jobs_ForServiceAdmin(id : number){
        let approvalStatus = 1;

        let updateQuery = await getConnection()
        .createQueryBuilder()
        .update(Jobs)
        .set({
            approvalStatus
        })
        .where(`id = ${id}`)
        .execute();
    }
}

