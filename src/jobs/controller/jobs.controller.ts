import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, Req, Res, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateJobsDTO } from "../dto/create-jobs.dto";
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateJobsDTO } from '../dto/update-jobs.dto';
import { JobsService } from "../service/jobs.service";
import { SelectJobsDTO } from '../dto/select-jobs.dto';


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
        @Body() createJobsDTO : CreateJobsDTO
    ) : Promise<void>{
        
        await this.jobsService.createNotice(createJobsDTO);
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