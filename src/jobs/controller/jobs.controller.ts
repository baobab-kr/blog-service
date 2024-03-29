import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, Req, Res, UploadedFile, UploadedFiles, UseInterceptors, HttpException, HttpStatus, Delete } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CreateJobsDTO } from "../dto/create-jobs.dto";
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateJobsDTO } from '../dto/update-jobs.dto';
import { JobsService } from "../service/jobs.service";
import { SelectJobsDTO } from '../dto/select-jobs.dto';
import { Request } from 'express';
import { SelectJobsHeadHuntDTO } from '../dto/select-jobs-headhunt.dto';
import { ApplyJobService } from '../../applyJob/service/applyJob.service';
import { ToastUiDTO } from '../dto/toast_ui_jobs.dto';
import { CompanyLicenseDTO } from '../dto/image-jobs-dto';
import { CampanyLogoDTO } from '../dto/Logo-jobs-dto';
import { SelectJobsForServiceAdminDTO } from '../dto/select-jobs-service-admin.dto';
import * as dayjs from 'dayjs'
import axios from 'axios';
import * as fs from 'fs';

@Controller("jobs")
@ApiTags("Baobab_Jobs")
export class JobsController{
    constructor(
        private jobsService : JobsService,
        private applyJobService : ApplyJobService
    ){}
    

    /**
     * CreateJobs(공지생성)
     * @param CreateJobsDTO 
     */
    @Post("/CreateJobs")
    @HttpCode(200)
    @ApiOperation({
        summary:'공지사항 생성 API',
        description:'careerType\n- 경력무관 : 0\n- 인턴 : 1\n- 신입 : 2\n- 경력 : 3\n\napprovalStatus \n - 미승인 :  0 \n- 승인 : 1\n\njobStatus(default : 1)\n- 채용 마감 : 0\n- 채용 중 : 1<br> startDate,endDate<br>YYYYMMDD로 초기화한 string값을 입력<br><br>logo,license는 이미지 업로드 api에서 반환된 데이터를 입력<br><br>user_id 필수값 아님, 로그인 한 상태라면 로그인한 user_id로 생성됨, user_id 를 입력하면 해당 user_id 우선으로 공고가 생성됨',
    })
    async CreateJobs(
        @Req() req: Request,
        @Body() createJobsDTO : CreateJobsDTO
    ) : Promise<void>{
        
        const headhunt_status = 1;

        if(createJobsDTO.user_id != undefined){
            if(await this.jobsService.check_headhunt_in_user_id(Number(createJobsDTO.user_id))){
                await this.jobsService.createNotice(createJobsDTO);
            }else{

            }
        }else if(Object.keys(req.cookies).includes("AccessToken") ){
            const user_id_inPayload : number = await this.jobsService.userIdInCookie(req.cookies.AccessToken);
            let users = await this.jobsService.getUser(user_id_inPayload);
            createJobsDTO.user_id = user_id_inPayload;
            
            if(users.role == headhunt_status){
                await this.jobsService.createNotice(createJobsDTO);
            }else{
                throw new HttpException('해드헌트만 이용가능한 기능입니다.', HttpStatus.CONFLICT)
            }
        }else{
            throw new HttpException('로그인을 해야 사용할 수 있는 기능입니다.', HttpStatus.CONFLICT)
        }

        
    }

    /**
     * UpdateJobs(공지 업데이트)
     * @param updateJobsDTO 
     */
    @Patch("/UpdateJobs")
    @HttpCode(200)
    @ApiOperation({
        summary:'공지사항 수정 API',
        description:'approvalStatus이 1로 변경되면 jobStatus 이외의 컬럼은 수정이 불가능하다.',
    })
    async UpdateJobs(
    @Body("id") id :number,
    @Body() updateJobsDTO : UpdateJobsDTO
    ) : Promise<void>{

        await this.jobsService.updateJobs(id, updateJobsDTO);
    }


    /**
     * getJobsAll(공지사항 전체 조회 API)
     * @returns 
     */
     @Get("/getJobsAll")
     @HttpCode(200)
     @ApiOperation({
         summary:'공지사항 전체 조회 API',
         description:'page 0부터 시작 페이지 당 10개의 공고 반환<br>approvalStatus이 1, jobStatus 1, 현재날짜 기준 startDate와 endDate가 포함된 게시물 반환',
     })
     async getJobsAll( 
        @Query() SelectJobsDTO : SelectJobsDTO
     ){

        const jobs = await this.jobsService.getJobsAll(SelectJobsDTO);

        if(jobs.length <= 0){
        return { "message" : "값이 없습니다." }
        }

        return jobs;
 
     }
    
    
    
    /**
     * GetJobs(공지사항 상세 조회 API)
     * @param id 
     * @returns 
     */
    @Get("/GetJobs")
    @HttpCode(200)
    @ApiOperation({
        summary:'공지사항 상세 조회 API',
        description:'id 로 조회 가능, 모든 게시물 조회 가능',
    })
    async getNotice(
        @Query("id") id : number 
    ){
        const jobs = await this.jobsService.getJobs(id);
        return jobs;

    }

    /**
         * getJobs_inUser_forHeadHunt(관리자의 공지사항 조회 API)
         * @returns 
         */
    @Get("/getJobs_inUser_forHeadHunt")
    @HttpCode(200)
    @ApiOperation({
        summary:'해드헌트의 공지사항 user_id 조회 API',
        description:'user_id에 해당하는 모든 게시물 반환, 해드헌트 계정만 사용 가능 role:1',
    })
    async getJobs_inUser_forHeadHunt( 
        @Req() req: Request,
        @Query() SelectJobsHeadHuntDTO : SelectJobsHeadHuntDTO
    ){

        const headhunt_status = 1;
    


    if(Object.keys(req.cookies).includes("AccessToken") ){
        const user_id_inPayload : number = await this.jobsService.userIdInCookie(req.cookies.AccessToken);
        let users = await this.jobsService.getUser(user_id_inPayload);
        SelectJobsHeadHuntDTO.user_id = user_id_inPayload;
        if(users.role == headhunt_status){
            const jobs = await this.jobsService.getJobs_inUser_forHeadHunt(SelectJobsHeadHuntDTO);

            if(jobs.length <= 0){
                return { "message" : "값이 없습니다." }
            }

            return jobs;
        }else{
            throw new HttpException('해드헌트만 이용가능한 기능입니다.', HttpStatus.CONFLICT)
        }
    }else{
        throw new HttpException('로그인을 해야 사용할 수 있는 기능입니다.', HttpStatus.CONFLICT)
    }
    
        
        

    }
    @Get("/getJobsAll_ForServiceAdmin")
    @HttpCode(200)
    @ApiOperation({
        summary:'관리자의 공지사항 조회 API',
        description:'모든 게시물 반환, 서비스 관리자계정으로 로그인해야 사용가능 role:2 ',
    })
    async getJobsAll_ForServiceAdmin( 
        @Req() req: Request,
        @Query() SelectJobsForServiceAdminDTO : SelectJobsForServiceAdminDTO
    ){

        const admin_status = 2;

        if(Object.keys(req.cookies).includes("AccessToken") ){
            const user_id_inPayload : number = await this.jobsService.userIdInCookie(req.cookies.AccessToken);
            let users = await this.jobsService.getUser(user_id_inPayload);

            if(users.role == admin_status){
                const jobs = await this.jobsService.getJobsAll_ForServiceAdmin(SelectJobsForServiceAdminDTO);
                
                if(jobs.length <= 0){
                    return { "message" : "값이 없습니다." }
                }
                
                return jobs;
            }else{
                throw new HttpException('관리자만 이용가능한 기능입니다.', HttpStatus.CONFLICT)
            }
        }else{
            throw new HttpException('로그인을 해야 사용할 수 있는 기능입니다.', HttpStatus.CONFLICT)
        }
        

    }

    @Patch("/Approval_Jobs_ForServiceAdmin")
    @HttpCode(200)
    @ApiOperation({
        summary:'채용 공고를 승인하는 API',
        description:'채용공고 status를 승인으로 수정한다. 서비스 관리자계정으로 로그인해야 사용가능 role:2 ',
    })
    @ApiBody({schema : {example : {
        id : 1
    } }})
    async Approval_Jobs_ForServiceAdmin( 
        @Req() req: Request,
        @Body("id") id : number
    ){


        const admin_status = 2;

        if(Object.keys(req.cookies).includes("AccessToken") ){
            const user_id_inPayload : number = await this.jobsService.userIdInCookie(req.cookies.AccessToken);
            let users = await this.jobsService.getUser(user_id_inPayload);

            if(users.role == admin_status){
                await this.jobsService.Approval_Jobs_ForServiceAdmin(id);
            }else{
                throw new HttpException('관리자만 이용가능한 기능입니다.', HttpStatus.CONFLICT)
            }
        }else{
            throw new HttpException('로그인을 해야 사용할 수 있는 기능입니다.', HttpStatus.CONFLICT)
        }
        
    }



    @Patch("/unapproved_Jobs_ForServiceAdmin")
    @HttpCode(200)
    @ApiOperation({
        summary:'채용 공고 미승인 API',
        description:'채용공고 status를 미승인으로 수정한다. 헤드헌트 이상이 사용 가능 1, 2 ',
    })
    @ApiBody({schema : {example : {
        id : 1
    } }})
    async unapproved_Jobs_ForServiceAdmin( 
        @Req() req: Request,
        @Body("id") id : number
    ){


        const admin_status = 1;

        if(Object.keys(req.cookies).includes("AccessToken") ){
            const user_id_inPayload : number = await this.jobsService.userIdInCookie(req.cookies.AccessToken);
            let users = await this.jobsService.getUser(user_id_inPayload);

            if(users.role >= admin_status){
                await this.jobsService.unapproved_Jobs_ForServiceAdmin(id);
            }else{
                throw new HttpException('헤드헌트 혹은 서비스관리자만 이용가능한 기능입니다.', HttpStatus.CONFLICT)
            }
        }else{
            throw new HttpException('로그인을 해야 사용할 수 있는 기능입니다.', HttpStatus.CONFLICT)
        }
        
    }

    @Delete("/Delete_Jobs_ForServiceAdmin")
    @HttpCode(200)
    @ApiOperation({
        summary:'채용 공고를 삭제 API',
        description:'채용공고를 삭제한다. 서비스 관리자계정으로 로그인해야 사용가능 role:2 ',
    })
    @ApiBody({schema : {example : {
        id : 1
    } }})
    async Delete_Jobs(
        @Req() req: Request,
        @Body("id") id : number
    ){
        const admin_status = 2;

        if(Object.keys(req.cookies).includes("AccessToken") ){
            const user_id_inPayload : number = await this.jobsService.userIdInCookie(req.cookies.AccessToken);
            let users = await this.jobsService.getUser(user_id_inPayload);

            if(users.role == admin_status){
                const jobs = await this.jobsService.Delete_Jobs(id);
                return jobs;
            }else{
                throw new HttpException('관리자만 이용가능한 기능입니다.', HttpStatus.CONFLICT)
            }
        }else{
            throw new HttpException('로그인을 해야 사용할 수 있는 기능입니다.', HttpStatus.CONFLICT)
        }
    }

    @Delete("/delete_all_posts_in_user")
    @HttpCode(200)
    @ApiOperation({
        summary:'게시물 전체 삭제 api',
        description:'해당 사용자가 작성한 채용공고 및 채용신청의 게시물을 전체 삭제한다.',
    })
    @ApiBody({schema : {example : { user_id : 0}}})
    async delete_all_posts_in_user( 
        @Body("user_id") user_id : number
    ){
        const user = await this.jobsService.getUser(user_id);
        if(!user){
            throw new HttpException('해당유저가 없습니다.', HttpStatus.CONFLICT)
        }
        await this.applyJobService.delete_all_apply_jobs_in_user(user_id);
        await this.jobsService.delete_all_jobs_in_user(user_id);
        
    }
    /**
     * UploadOfCompanyLogo(회사 로고 업로드 API)
     * @param id 
     * @param file 
     * @returns 
     */
    @Post("/UploadOfCompanyLogo")
    @HttpCode(200)
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor("CompanyLogo"))
    @ApiOperation({
        summary:'회사로고 업로드',
        description:'이미지 업로드 후 파일명 반환, ID와 함께 넣으면 해당하는 공지사항의 회사로고를 변경, id는 필수값 아님',
    })
    @ApiBody({description:"Jobs의 Logo 이미지 삽입",type:CampanyLogoDTO})
    async uploadLogo(
        @Body("id") id : number,
        @UploadedFile() file
    ){
        
        return await this.jobsService.uploadLogo(id,file);
    }

    




    /**
     * UploadOfCompanyImage(채용공고 이미지 업로드 API)
     * @param id 
     * @param file 
     * @returns 
     */
     @Post("/UploadOfCompanyLicense")
     @HttpCode(200)
     @UseInterceptors(FileInterceptor("CompanyLicense"))
     @ApiConsumes('multipart/form-data')
     @ApiOperation({
        summary:'채용공고 라이선스 업로드',
        description:'라이선스 업로드 후 파일명 반환, ID와 함께 넣으면 해당하는 공지사항의 라이선스 변경, id는 필수값 아님',
    })
    @ApiBody({description:"Jobs의 license 이미지 삽입",type:CompanyLicenseDTO})
     async uploadImage(
         @Body("id") id : number,
         @UploadedFile() file
     ){
  
 
         return await this.jobsService.uploadImage(id,file);
     }
     @Post("/UploadToastUiImage")
     @HttpCode(200)
     @UseInterceptors(FileInterceptor("ToastImage"))
     @ApiConsumes('multipart/form-data')
     @ApiOperation({
        summary:'토스트UI 이미지 업로드',
        description:'이미지 업로드 후 파일명 반환',
    })
    @ApiBody({description:"ToastUi이미지 삽입",type:ToastUiDTO})
     async uploadToastUiImage(
         @UploadedFile() file
     ){
  
 
         return await this.jobsService.uploadToastUiImage(file);
     }
     
 
    @Post("/getImageFile")
    @HttpCode(200)
    @ApiOperation({
        summary:'이미지 반환 API',
        description:'파일명을 입력하면 이미지를 반환',
    })
    @ApiBody({schema : {example : {file_name : "string"}}})
    async getImageFile(
        @Res() res ,
        @Body("file_name") filename : string
    ){
        const file = await this.jobsService.getImage(filename);
        return file.pipe(res);

    }

    @Get("/getToastImage")
    @HttpCode(200)
    @ApiOperation({
        summary:'ToastUi이미지 반환 API',
        description:'파일명을 입력하면 이미지를 반환',
    })
    @ApiParam({name:"file_name"})
    async getToastImage(
        @Res() res ,
        @Query("file_name") filename : string
    ){
        const file = await this.jobsService.getImage(filename);
        return file.pipe(res);

    }

    @Post("/nts_businessman")
    @HttpCode(200)
    @ApiOperation({
        summary:'사업자확인 API',
        description:'사업자 번호를 입력하면 사업자가 맞는지 반환한다 \"-\" 하이픈 제거됨, 사용가능한 사업자 번호면 \"등록된 사업자등록번호\" 반환, 아닐경우 \"등록되지 않은 사업자등록번호\" 반환함 ',
    })
    @ApiBody({schema : {example : {business_number : "string"}}})
    async nts_businessman(
        @Body("business_number") b_no : string
    ) : Promise<Object>{
        const serviceKey = "I5OxGPqEJSf88oOEtR9HcQIWGmvCgPbiVP9RlqeUFd2Hqd1SsilZLjti5vqPpwl8kD%2BjystU%2BgJDzDyNb3mJfA%3D%3D";
        const axios = require("axios");
        

        const result = await axios({
            method : "post",
            url : `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${serviceKey}`,
            data : {
                b_no : [b_no.replace(/-|\s/gi,"")]
            }
        }).then(function (response){
            if(response.data.data[0].tax_type == "국세청에 등록되지 않은 사업자등록번호입니다."){
                return "등록되지 않은 사업자등록번호"
            }else{

                return "등록된 사업자등록번호";
            }
        });

        //throw new HttpException('board_id가 없습니다.', HttpStatus.CONFLICT)
        return result;

    }


    
    
    @Post("/check_businessman_image")
    @UseInterceptors(FileInterceptor("image"))
    @HttpCode(200)
    async check_businessman_image(
        //@Body("filename") filename : string,
        @UploadedFile() file : any
    ) {
        const secretKey = "WUtURXpSd09TdnJGTHBxTXBQVGJGYmphUGhyTG94RE4=";
        const axios = require("axios");
        const headers = {
            "Content-Type" : "application/json",
            "X-OCR-SECRET" : "WUtURXpSd09TdnJGTHBxTXBQVGJGYmphUGhyTG94RE4="
        }
        const url = `https://vp7t7va0ux.apigw.ntruss.com/custom/v1/19433/85f4c1eeeb80064410fc1353e40201299c23ce6f8b5ac87d881a0e02ee049ba0/general`;
/*  
        const localfilepath = await this.jobsService.uploadFileDisk(file);
        var fileFormat = localfilepath.split(".");
        let fileEXT = '';
        if( localfilepath.indexOf("jpg")){  
          fileEXT = "jpg"   
        }else if( localfilepath.indexOf("png")){
          fileEXT = "png"
        }*/
        //console.log(fileEXT)   
        //console.log("file" +JSON.stringify(file))   
        let encode = Buffer.from(file.buffer).toString('base64');
        
        //let d = fs.readFileSync('C:/File/blog-service_updateversion/blog-service/dist/jobs/service/uploads/1669962513728.jpg', 'base64');
    
        //console.log(file);
        //console.log(`인코드 : ${encode}` );

        const result = await axios({
            method : "post",
            headers : headers,  
            url : url,
            data : {
                "images" :[{
                    "format"  :"jpg",
                    "name" : "medium",
                    "data" : encode,
                    "url" : "https://www.dainfc.com/file_data/dainstore/2021/09/07/3750ef61244636d1d84f1e30743c92ab.jpg"
                }
                ],
                "lang" : "ko",
                "requestId" : "string",
                "resultType" : "string",
                "timestamp"  : dayjs(),
                "version" : "V1"
            }
        }).then(function (response){
                    
            console.log('requestWithBase64 response:', response.data)
                
            if (response.status === 200) {
                console.log('requestWithBase64 response:', response.data)
                console.log('성공?');   
                
            }else{
                console.log('error')
            }
            
        })
        
        .catch(e => {
            console.warn('requestWithBase64 error', e.response)
        });
        
        //console.log(result);


        return 

    }




}