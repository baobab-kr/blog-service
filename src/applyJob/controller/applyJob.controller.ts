import { Body, Controller, Get, HttpCode, Patch, Post, Query, Req, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApplyJobService } from '../service/applyJob.service';
import { CreateApplyJobDTO } from '../dto/create-applyJob.dto';
import { UpdateApplyJobDTO } from '../dto/update-applyJob.dto';
import { Request } from "express";
import { SelectJobsDTO } from 'src/jobs/dto/select-jobs.dto';


@Controller("ApplyJob")
@ApiTags("Baobab_ApplyJob")
export class ApplyJobController{
    constructor(
        private applyJobService : ApplyJobService
    ){}

    /**
     * CreateApplyJob(채용공고 신청 API)
     * @param req 
     * @param createApplyJobDTO 
     */
    @Post("/CreateApplyJob")
    @HttpCode(200)
    @ApiOperation({
        summary:'채용공고 신청 API',
        description:'채용공고를 신청하는 API, user_id 필수값 아님',
    })
    async CreateApplyJob(
        @Req() req: Request,
        @Body() createApplyJobDTO : CreateApplyJobDTO
    ){

        if(Object.keys(req.cookies).includes("AccessToken") ){
            const user_id_inPayload : number = await this.applyJobService.userIdInCookie(req.cookies.AccessToken);

            if(createApplyJobDTO.user_id == undefined){
                
                createApplyJobDTO.user_id = user_id_inPayload;
            }
                    
            return await this.applyJobService.createApplyJob(createApplyJobDTO);
        }else{
            throw new HttpException('로그인을 해야 사용할 수 있는 기능입니다.', HttpStatus.CONFLICT)
        }
        
    }

    /**
     * AutoCompleteAPI(user 정보 반환 API)
     * @param req 
     * @returns 
     */
    @Get("/AutoCompleteAPI")
    @HttpCode(200)
    @ApiOperation({
        summary:'user 정보 반환 API',
        description:'로그인한 user의 email, techstack, socialUrl',
    })
    async AutoCompleteAPI(
        @Req() req: Request
    ){
        if(Object.keys(req.cookies).includes("AccessToken") ){
            const user_id_inPayload : number = await this.applyJobService.userIdInCookie(req.cookies.AccessToken);
            
            return await this.applyJobService.AutoCompleteAPI(user_id_inPayload);
        }else{
            throw new HttpException('로그인을 해야 사용할 수 있는 기능입니다.', HttpStatus.CONFLICT)
        }
        
    }
    
    /**
     * UpdateApplyJob(채용 수정 API)
     * @param id 
     * @param updateApplyJobDTO 
     */
    @Patch("/UpdateApplyJob")
    @HttpCode(200)
    @ApiOperation({
        summary:'채용 수정 API',
        description:'작성했던 채용을 수정하는 API, id를 제외한 속성은 넣지 않아도 작동함',
    })
    async UpdateApplyJob(
        @Body("id") id : number,
        @Body() updateApplyJobDTO : UpdateApplyJobDTO
    ){
        await this.applyJobService.updateApplyJob(id, updateApplyJobDTO)
    }


    /**
     * GetMyApplyJobs(사용자 채용 반환API)
     * @param req 
     * @returns 
     */
    @Get("/GetMyApplyJobs")
    @HttpCode(200)
    @ApiOperation({
        summary:'사용자 채용 반환API',
        description:'로그인한 사용자의 채용전부를 반환하는 기능',
    })
    async GetMyApplyJobs(
        @Req() req : Request
    ){


        if(Object.keys(req.cookies).includes("AccessToken") ){
            const user_id_inPayload : number = await this.applyJobService.userIdInCookie(req.cookies.AccessToken);
            
            return await this.applyJobService.getApplyJobsAll_inUser(user_id_inPayload);
        }else{
            throw new HttpException('로그인을 해야 사용할 수 있는 기능입니다.', HttpStatus.CONFLICT)
        }
    }


    /**
     * GetApplyJobAll(Jobs에 신청한 채용 반환 API)
     * @param jobs_id 
     * @returns 
     */
    @Get("/GetApplyJobAll")
    @HttpCode(200)
    @ApiOperation({
        summary:'Jobs에 신청한 채용 반환 API',
        description:'jobs_id를 기준으로 해당 공고에 신청한 채용을 반환하는API',
    })
    async GetApplyJobAll(
        @Query("jobs_id") jobs_id : number
    ){
        return await this.applyJobService.getApplyJobsAll(jobs_id);
    }

    /**
     * GetApplyJob(채용 상세 API)
     * @param id 
     * @returns 
     */
    @Get("/GetApplyJob")
    @HttpCode(200)
    @ApiOperation({
        summary:'채용 상세 API',
        description:'입력한 id에 맞는 채용을 반환하는 Api',
    })
    async GetApplyJob(
        @Query("id") id : number
    ){
        return await this.applyJobService.getApplyJobs(id);
    }

    /**
     * GetApplyJobsAll_inUser(User 대한 채용 반환 api)
     * @param user_id 
     * @returns 
     */
    @Get("/GetApplyJobsAll_inUser")
    @HttpCode(200)
    @ApiOperation({
        summary:'User 대한 채용 반환 api',
        description:'입력한 user_id에 맞는 채용을 반환하는 api',
    })
    async GetApplyJobsAll_inUser(
        @Query("user_id") user_id : number
    ){
        return await this.applyJobService.getApplyJobsAll_inUser(user_id);
    }

    /*
    @Patch("/DeleteApplyJob")
    @HttpCode(200)
    @ApiOperation({
        summary:'User 대한 채용 반환 api',
        description:'입력한 user_id에 맞는 채용을 반환하는 api',
    })
    async DeleteApplyJob(
        @Body("id") id : number
    ){
        await this.applyJobService.deleteRecruit(id)
    }
*/

}