import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, Req, Res, UploadedFile, UploadedFiles, UseInterceptors, HttpException, HttpStatus, Delete } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CreateJobsDTO } from "../dto/create-jobs.dto";
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateJobsDTO } from '../dto/update-jobs.dto';
import { JobsService } from "../service/jobs.service";
import { SelectJobsDTO } from '../dto/select-jobs.dto';
import { Request } from 'express';
import { SelectJobsHeadHuntDTO } from '../dto/select-jobs-headhunt.dto';


@Controller("jobs")
@ApiTags("Baobab_Jobs")
export class JobsController{
    constructor(
        private jobsService : JobsService
    ){}
    

    /**
     * CreateJobs(공지생성)
     * @param CreateJobsDTO 
     */
    @Post("/CreateJobs")
    @HttpCode(200)
    @ApiOperation({
        summary:'공지사항 생성 API',
        description:'careerType\n- 경력무관 : 0\n- 인턴 : 1\n- 신입 : 2\n- 경력 : 3\n\napprovalStatus \n - 미승인 :  0 \n- 승인 : 1\n\njobStatus(default : 0)\n- 채용 마감 : 0\n- 채용 중 : 1        ',
    })
    async CreateJobs(
        @Req() req: Request,
        @Body() createJobsDTO : CreateJobsDTO
    ) : Promise<void>{
        
        const headhunt_status = 2;

        if(Object.keys(req.cookies).includes("AccessToken") ){
            const user_id_inPayload : number = await this.jobsService.userIdInCookie(req.cookies.AccessToken);
            let users = await this.jobsService.getUser(user_id_inPayload);

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
         description:'approvalStatus이 1, jobStatus 1, 현재날짜 기준 startDate와 endDate가 포함된 게시물 반환',
     })
     @ApiQuery({type : SelectJobsDTO})
     @ApiBody({schema : {example : {
        location : "string",
        title : "string",
        field : "string",
        careerType: 1,
        startDate : "YYYYMMDD",
        endDate : "YYYYMMDD",
        companyName : "string"} }})
     async getJobsAll( 
        @Query() SelectJobsDTO : SelectJobsDTO
     ){

         const jobs = await this.jobsService.getJobsAll(SelectJobsDTO);
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
         description:'user_id에 해당하는 모든 게시물 반환',
     })
     @ApiQuery({type : SelectJobsHeadHuntDTO})
     @ApiBody({schema : {example : {
         user_id : 1,
         location : "string",
         title : "string",
         field : "string",
         careerType: 1,
         startDate : "YYYYMMDD",
         endDate : "YYYYMMDD",
         companyName : "string"} }})
     async getJobs_inUser_forHeadHunt( 
         @Req() req: Request,
         @Query() SelectJobsHeadHuntDTO : SelectJobsHeadHuntDTO
     ){
 
         const headhunt_status = 2;
 
         if(Object.keys(req.cookies).includes("AccessToken") ){
             const user_id_inPayload : number = await this.jobsService.userIdInCookie(req.cookies.AccessToken);
             let users = await this.jobsService.getUser(user_id_inPayload);
 
             if(users.role == headhunt_status){
                 const jobs = await this.jobsService.getJobs_inUser_forHeadHunt(SelectJobsHeadHuntDTO);
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
        description:'모든 게시물 반환, 서비스 관리자계정으로 로그인해야 사용가능 role:3 ',
    })
    @ApiQuery({type : SelectJobsDTO})
    @ApiBody({schema : {example : {
        location : "string",
        title : "string",
        field : "string",
        careerType: 1,
        startDate : "YYYYMMDD",
        endDate : "YYYYMMDD",
        companyName : "string"} }})
    async getJobsAll_ForServiceAdmin( 
        @Req() req: Request,
        @Query() SelectJobsDTO : SelectJobsDTO
    ){

        const admin_status = 3;

        if(Object.keys(req.cookies).includes("AccessToken") ){
            const user_id_inPayload : number = await this.jobsService.userIdInCookie(req.cookies.AccessToken);
            let users = await this.jobsService.getUser(user_id_inPayload);

            if(users.role == admin_status){
                const jobs = await this.jobsService.getJobsAll_ForServiceAdmin(SelectJobsDTO);
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
        description:'서비스 관리자계정으로 로그인해야 사용가능 role:3 ',
    })
    @ApiBody({schema : {example : {
        id : 1
    } }})
    async Approval_Jobs_ForServiceAdmin( 
        @Req() req: Request,
        @Body("id") id : number
    ){
        await this.jobsService.Approval_Jobs_ForServiceAdmin(id);
    }

    @Delete("/Delete_Jobs_ForServiceAdmin")
    @HttpCode(200)
    @ApiOperation({
        summary:'채용 공고를 삭제 API',
        description:'서비스 관리자계정으로 로그인해야 사용가능 role:3 ',
    })
    @ApiBody({schema : {example : {
        id : 1
    } }})
    async Delete_Jobs(
        @Req() req: Request,
        @Body("id") id : number
    ){
        const admin_status = 3;

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
    /**
     * UploadOfCompanyLogo(회사 로고 업로드 API)
     * @param id 
     * @param file 
     * @returns 
     */
    @Post("/UploadOfCompanyLogo")
    @HttpCode(200)
    @UseInterceptors(FileInterceptor("CompanyLogo"))
    @ApiOperation({
        summary:'회사로고 업로드',
        description:'이미지 업로드 후 파일명 반환, ID와 함께 넣으면 해당하는 공지사항의 회사로고를 변경',
    })
    @ApiBody({schema : {example : {id : 0, CompanyLogo : "File"}}})
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
     @Post("/UploadOfCompanyImage")
     @HttpCode(200)
     @UseInterceptors(FileInterceptor("CompanyImage"))
     @ApiOperation({
        summary:'채용공고 이미지 업로드',
        description:'이미지 업로드 후 파일명 반환, ID와 함께 넣으면 해당하는 공지사항의 회사로고를 변경',
    })
    @ApiBody({schema : {example : {id : 0, CompanyLogo : "File"}}})
     async uploadImage(
         @Body("id") id : number,
         @UploadedFile() file
     ){
  
 
         return await this.jobsService.uploadImage(id,file);
     }
     @Post("/UploadToastUiImage")
     @HttpCode(200)
     @UseInterceptors(FileInterceptor("ToastImage"))
     @ApiOperation({
        summary:'토스트UI 이미지 업로드',
        description:'이미지 업로드 후 파일명 반환',
    })
    @ApiBody({schema : {example : { ToastImage : "File"}}})
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

}